import { path } from "@/constants/path";
import AuthPage from "@/pages/auth/AuthPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: path.inbox,
      });
    }
  },
  component: AuthPage,
});
