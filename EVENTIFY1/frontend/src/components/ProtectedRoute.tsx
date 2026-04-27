import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

type User = {
  uid: string;
  email: string;
  displayName: string;
  role: string;
};

const ProtectedRoute = ({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;