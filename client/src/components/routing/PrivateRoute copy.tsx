import { Navigate, Outlet, Route, redirect } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../../hooks/useAuth";
import { JSX } from "react/jsx-runtime";
import App from "../../App";

// import AuthContext from "../../context/auth/authContext";
// import Spinner from "../layout/Spinner";

type PrivateRouteType = {
  path: string;
  Component: any;
  // Component: () => {}
};

const PrivateRoute = () => {
  const authContext = useAuth();
  const {
    // user,
    isAuthenticated,
    isValidated,
    loading,
  } = authContext;

  const location = useLocation();
  // const history = useHistory();
  let { from } = location.state || { from: { pathname: "/" } };

  if (loading) "Loading...";
  // return !isAuthenticated && !loading ? (
  return !isAuthenticated ? (
    <Navigate to="/login" state={{ from: from }} />
  ) : (
    // ) : !isValidated && !loading ? (
    //   <Navigate to="/validate" state={{ from: from }} />
    // <Navigate
    //   to="/path"
    //     state={{ from: from }}
    // />
    // <App />
    // <Component  />
    // <Component />
    <Outlet />
  );
};

PrivateRoute.propTypes = {
  component: PropTypes.func,
  location: PropTypes.object,
};

export default PrivateRoute;
