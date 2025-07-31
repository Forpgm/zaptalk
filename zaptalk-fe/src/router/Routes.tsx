import { useRoutes } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import { path } from "../constants/path";
import AuthPage from "../pages/auth/AuthPage";

export default function AppRoutes() {
  const routeElements = useRoutes([
    { path: path.home, element: <Landing /> },
    {
      path: path.login,
      element: <AuthPage />,
    },
  ]);

  return routeElements;
}
