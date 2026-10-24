import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/member-club/admin")({
  beforeLoad: () => { throw redirect({ to: "/admin", statusCode: 301 }); },
});
