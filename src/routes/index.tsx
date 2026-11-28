import { createFileRoute } from "@tanstack/react-router";

import { FastNotificationsPage } from "./products/fastnotifications";

export const Route = createFileRoute("/")({
  component: FastNotificationsPage,
});
