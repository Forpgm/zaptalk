import { Navigate, Outlet, useRoutes } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import { path } from "../constants/path";
import AuthPage from "../pages/auth/AuthPage";
import EmailVerify from "../pages/auth/EmailVerify";
import EmailVerifiedResult from "../components/auth/EmailVerifiedResult";
import Inbox from "../pages/Inbox";
import { useAuthStore } from "../utils/store";
import { useShallow } from "zustand/react/shallow";

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    }))
  );
  return isAuthenticated ? <Outlet /> : <Navigate to={path.login} replace />;
}

function RejectedRoute() {
  const { isAuthenticated } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
    }))
  );
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.inbox} />;
}

export default function AppRoutes() {
  const routeElements = useRoutes([
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        { path: path.login, element: <AuthPage /> },
        { path: path.home, element: <Landing /> },
      ],
    },
    {
      path: path.emailVerify,
      element: <EmailVerify />,
    },
    { path: path.emailVerifyResult, element: <EmailVerifiedResult /> },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [{ path: path.inbox, element: <Inbox /> }],
    },
  ]);

  return routeElements;
}
