import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container, Form, InputGroup } from "react-bootstrap";

import useAlert from "../../hooks/useAlert";
import useAuth from "../../hooks/useAuth";

// set blank user state and extract vairables
type RegisterUserType = {
  name: string;
  email: string;
  password: string;
  password2: string;
};

const Register = () => {
  const { register, error, clearErrors, isAuthenticated } = useAuth();
  const { setAlert } = useAlert();

  const location = useLocation();
  const navigate = useNavigate();
  let { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }

    // if (isAuthenticated) {
    //   props.history.push("/");
    // }

    if (error === "User already exists") {
      setAlert(error, "danger");
      clearErrors();
    }

    // eslint-disable-next-line
  }, [error, isAuthenticated, from]);

  const [user, setUser] = useState<RegisterUserType>({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = user;

  const onChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name === "" || email === "" || password === "") {
      setAlert("Please enter all fields", "danger");
    } else if (password !== password2) {
      setAlert("Passwords do not match", "danger");
    } else {
      register({
        name,
        email,
        password,
      });
    }
  };

  return (
    <Container>
      <h1>
        Account <span className="text-primary">Register</span>
      </h1>
      <Form onSubmit={onSubmit}>
        <InputGroup>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            required
          />
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength={6}
          />
          <label htmlFor="password2">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
            minLength={6}
          />
          <div className="d-grid gap-2">
            <Button className="btn" type="submit"></Button>
          </div>
        </InputGroup>
      </Form>
    </Container>
  );
};

export default Register;
