import { EventEmitter } from "events";

// Next.js Dev Server can hot reload and erase standard instances.
// We bind the EventEmitter to the global context to ensure all API
// requests share the same broker instance.

const globalForEmitter = global as unknown as {
  eventEmitter: EventEmitter;
};

export const eventEmitter = globalForEmitter.eventEmitter || new EventEmitter();

if (process.env.NODE_ENV !== "production") {
  globalForEmitter.eventEmitter = eventEmitter;
}

export const SSE_EVENTS = {
  CRISIS_TRIGGERED: "crisis_triggered",
  TANKER_REROUTED: "tanker_rerouted",
  SYSTEM_RESET: "system_reset"
};
