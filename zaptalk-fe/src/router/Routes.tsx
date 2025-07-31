import { useRoutes } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import { path } from "../constants/path";

export default function AppRoutes() {
  const routeElements = useRoutes([{ path: path.home, element: <Landing /> }]);

  return routeElements;
}
