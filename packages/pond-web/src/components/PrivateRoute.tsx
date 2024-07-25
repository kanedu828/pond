import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useStatus } from "../hooks/api/UseAuthClient";
import { LoadingPage } from "./LoadingPage";

interface PrivateRouteProps {
  element: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { data: status, isLoading } = useStatus();
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (status?.authenticated) {
    return element;
  } else {
    return <Navigate to="/login" state={{ from: location }} />;
  }
};

export default PrivateRoute;
