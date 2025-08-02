import { useRoutes } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import { path } from "../constants/path";
import AuthPage from "../pages/auth/AuthPage";
import EmailVerify from "../pages/auth/EmailVerify";

export default function AppRoutes() {
  const routeElements = useRoutes([
    { path: path.home, element: <Landing /> },
    {
      path: path.login,
      element: <AuthPage />,
    },
    {
      path: path.emailVerify,
      element: <EmailVerify />,
    },
  ]);

  return routeElements;
}
