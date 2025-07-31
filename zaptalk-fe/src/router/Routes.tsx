import { useRoutes } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import { path } from "../constants/path";
import AuthForm from "../pages/auth/AuthForm";

export default function AppRoutes() {
  const routeElements = useRoutes([
    { path: path.home, element: <Landing /> },
    {
      path: path.login,
      element: <AuthForm />,
    },
  ]);

  return routeElements;
}
