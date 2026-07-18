import { eventEmitter } from "@/lib/eventBus";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const responseStream = new ReadableStream({
    start(controller) {
      const onEvent = (eventName: string, data: any) => {
        try {
          const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
          controller.enqueue(new TextEncoder().encode(message));
        } catch (e) {
          console.error("Error writing to stream:", e);
        }
      };

      // Register event listener
      eventEmitter.on("broadcast", onEvent);

      // Send initial handshake
      controller.enqueue(new TextEncoder().encode("event: handshake\ndata: {\"status\":\"connected\"}\n\n"));

      // Clean up on disconnect
      req.signal.addEventListener("abort", () => {
        eventEmitter.off("broadcast", onEvent);
        try {
          controller.close();
        } catch (e) {
          // ignore stream already closed errors
        }
      });
    }
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no" // Disables caching in reverse proxies like Vercel/Nginx
    }
  });
}
