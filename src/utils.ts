import type { RequestEvent } from "@sveltejs/kit";
export function sessionFromEvent(event: RequestEvent) {
  return event.locals.session.data;
};