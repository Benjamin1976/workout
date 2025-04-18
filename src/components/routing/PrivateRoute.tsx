import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Spinner from "../common/Spinner";

const PrivateRoute = () => {
  const authContext = useAuth();
  const { isAuthenticated, isValidated, loading } = authContext;

  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  if (loading) return <Spinner />;
  return !isAuthenticated && !loading ? (
    <Navigate to="/login" state={{ from: from }} />
  ) : !isValidated && !loading ? (
    <Navigate to="/validate" state={{ from: from }} />
  ) : (
    <Outlet />
  );
};

export default PrivateRoute;
