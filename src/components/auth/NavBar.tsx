import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Container, Nav, Navbar as NavbarBs } from "react-bootstrap";

import useAuth from "../../hooks/useAuth";

const NavBar = () => {
  const { isAuthenticated, loadUser, logout } = useAuth();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const guestLinks = (
    <Nav>
      <Nav.Link className="text-white" to="/login" as={NavLink}>
        Login
      </Nav.Link>
      <Nav.Link className="text-white" to="/register" as={NavLink}>
        Register
      </Nav.Link>
    </Nav>
  );
  const authLinks = (
    <Nav className="text-white">
      <Nav.Link to="/" as={NavLink}>
        Workouts
      </Nav.Link>
      <Nav.Link onClick={() => logout()}>Logout</Nav.Link>
    </Nav>
  );

  return (
    <NavbarBs className="bg-primary shadow-sm align-items-center">
      <Container>
        <h1 className="text-white b-0 m-0">Workouts</h1>
        {isAuthenticated ? authLinks : guestLinks}
      </Container>
    </NavbarBs>
  );
};

export default NavBar;
