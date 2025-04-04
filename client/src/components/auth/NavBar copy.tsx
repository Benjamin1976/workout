import { useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Nav,
  Navbar as NavbarBs,
  Row,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useExercise from "../../hooks/useExercise";

const NavBar = () => {
  const { user, isAuthenticated, isValidated, loadUser, logout } = useAuth();
  const { sessions, currentSession } = useExercise();

  useEffect(() => {
    loadUser("navbar");
    // eslint-disable-next-line
  }, []);
  // db-eslint-disable-next-line

  const onLogout = () => {
    logout();
  };

  const guestLinks = (
    <>
      <Nav>
        <Nav.Link className="text-white" to="/login" as={NavLink}>
          Login
        </Nav.Link>
        <Nav.Link className="text-white" to="/register" as={NavLink}>
          Register
        </Nav.Link>
      </Nav>
    </>
  );
  const authLinks = (
    <>
      <Nav className="text-white">
        <Nav.Link to="/" as={NavLink}>
          Workouts
        </Nav.Link>
        <Nav.Link onClick={onLogout}>Logout</Nav.Link>
      </Nav>
    </>
  );

  const authDebugRow = () => {
    const token = localStorage.getItem("token") ?? "no token";
    const tokenShort = token !== "no token" ? token.substring(0, 5) : token;

    return (
      <Row className=" bg-secondary text-white text-center ">
        <Col className="col-3">user: {user?.name ?? "not loaded"}</Col>
        <Col className="col-3">
          authenticated: {isAuthenticated ? "true" : "false"}
        </Col>
        <Col className="col-3">validated: {isValidated ? "true" : "false"}</Col>
        <Col
          className="col-3"
          title={token ?? "no token"}
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
        >
          token: {tokenShort ?? "no token"}
        </Col>
      </Row>
    );
  };

  const sessionDebugRow = () => {
    const storedSession = localStorage.getItem("session") ?? "no session";
    const sessionShort =
      storedSession !== "no session"
        ? storedSession.substring(0, 5)
        : storedSession;

    return (
      <Row className=" bg-secondary text-white text-center ">
        <Col className="col-4">sessions: {sessions?.length ?? 0}</Col>
        <Col className="col-6">stored sessionId: {storedSession}</Col>
        <Col className="col-4">
          currentSession: {currentSession ? currentSession?._id : "none"}
        </Col>
      </Row>
    );
  };

  return (
    <>
      <NavbarBs className="bg-primary shadow-sm align-items-center">
        <Container>
          {/* <Row>
          <Col className="col-12"> */}
          <h1 className="text-white b-0 m-0">Workouts</h1>
          {/* <Button
            className="btn btn-warning"
            onClick={() => {
              localStorage.removeItem("token");
            }}
          >
            Clear Storage
          </Button> */}
          {isAuthenticated ? authLinks : guestLinks}
        </Container>
      </NavbarBs>
      {/* {authDebugRow()}
      {sessionDebugRow()} */}
    </>
  );
};

export default NavBar;
