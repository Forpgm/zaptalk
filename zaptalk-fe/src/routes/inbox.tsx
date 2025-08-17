import { path } from "@/constants/path";
import Inbox from "@/pages/Inbox";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/inbox")({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: path.login,
      });
    }
  },
  component: Inbox,
});
