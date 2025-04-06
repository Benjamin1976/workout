import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";

const Login = () => {
  const { login, error, clearErrors, isAuthenticated, loading } = useAuth();
  const { setAlert } = useAlert();

  const location = useLocation();
  const navigate = useNavigate();
  let { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      // navigate("/session");
    }
    if (error === "Invalid Credentials") {
      setAlert(error, "danger");
      clearErrors();
    }

    // eslint-disable-next-line
  }, [error, isAuthenticated]);
  // }, [error, isAuthenticated, history]);

  type LoginUserType = {
    [key: string]: string;
    email: string;
    password: string;
  };

  const LoginUserInitialValue = {
    email: "",
    password: "",
  };

  const [user, setUser] = useState<LoginUserType>(LoginUserInitialValue);
  const { email, password } = user;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e?.target?.name !== undefined || e?.target?.value !== undefined) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setAlert("Please fill in all fields", "danger");
    } else {
      login({
        email,
        password,
      });
    }
  };

  if (loading) return "Loading ...";
  // if (loading) return <Spinner />;

  return (
    <Container className="form-container">
      <form onSubmit={onSubmit}>
        <h1>
          Account <span className="text-primary">Login</span>
        </h1>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <div className="d-grid gap-2">
          <Button className="btn" type="submit">
            Login
          </Button>
        </div>
      </form>
    </Container>
  );
};

export default Login;
