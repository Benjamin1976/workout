import React, { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Container, Row } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";

const Validate = () => {
  const {
    user,
    isAuthenticated,
    isValidated,
    error,
    loading,
    validateUser,
    sendValidationEmail,
    clearErrors,
  } = useAuth();
  const { setAlert } = useAlert();

  const location = useLocation();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(0);

  // this is used to return you to the page
  //   you originally were at or going to
  let { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
    if (isValidated) {
      navigate(from, { replace: true });
    }
    if (error === "Invalid Credentials") {
      setAlert(error, "danger");
      clearErrors();
    }

    // eslint-disable-next-line
  }, [error, isValidated, code]);

  const updateCode = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e?.target?.value) setCode(e.target.value);
  };

  const resendEmail = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (user) sendValidationEmail(user);
  };

  const validateCode = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (user) validateUser(user, code);
    let a = attempts + 1;
    setAttempts(a);
    setCode("");
  };

  if (loading) return "Loading...";

  const failedAttempt = attempts > 0 && isValidated === false;
  const inputColorClass = failedAttempt ? "bg-warning" : "";

  return (
    <Container>
      <Row>
        <Col>
          <p>Thank you for registering {user?.name || "name"}.</p>
          <p>
            Your account needs to be validated. An activation email has been
            sent to your email account. Please login to your email, enter the
            code from the email below.
          </p>
        </Col>
      </Row>
      <Row>
        <Col>
          <input
            className="form-control"
            name={"code"}
            id={"code"}
            type="text"
            onChange={(e) => updateCode(e)}
          />
          <Button onClick={(e) => validateCode(e)}>Validate</Button>{" "}
        </Col>
      </Row>
      {failedAttempt && (
        <Row>
          <Col className={`${inputColorClass}`}>Validation Code Incorrect</Col>
        </Row>
      )}
      <Row>
        <Col>
          <div>
            The link will be valid for 20 mins
            <p>
              {" "}
              <Button
                className="btn btn-primary"
                onClick={(e) => resendEmail(e)}
              >
                Re-send Validation Email
              </Button>
            </p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>Timer</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Validate;
