import Landing from "@/pages/landing/Landing";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Landing,
});
