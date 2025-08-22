import { path } from "@/constants/path";
import Landing from "@/pages/landing/Landing";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({
        to: path.inbox,
      });
    }
  },
  component: Landing,
});
