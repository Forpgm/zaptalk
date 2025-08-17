import "./App.css";
import { useAuthStore } from "./utils/store";
import { router } from "./router";
import { RouterProvider } from "@tanstack/react-router";

function App() {
  const auth = useAuthStore();
  return <RouterProvider router={router} context={{ auth }} />;
}

export default App;
