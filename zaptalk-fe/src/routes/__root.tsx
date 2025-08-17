import * as React from "react";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import type { AuthState } from "@/utils/store";

interface MyRouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}
