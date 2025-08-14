import AuthPage from "@/pages/auth/AuthPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: AuthPage,
});
