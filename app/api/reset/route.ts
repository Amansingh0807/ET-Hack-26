import { NextResponse } from "next/server";
import { resetDb, getTankers, getEvents, getRoutes } from "@/lib/db";
import { eventEmitter } from "@/lib/eventBus";

export async function POST() {
  await resetDb();
  const payload = {
    tankers: await getTankers(),
    events: await getEvents(),
    routes: await getRoutes()
  };

  eventEmitter.emit("broadcast", "system_reset", payload);
  return NextResponse.json({ success: true, ...payload });
}

export async function GET() {
  await resetDb();
  const payload = {
    tankers: await getTankers(),
    events: await getEvents(),
    routes: await getRoutes()
  };

  eventEmitter.emit("broadcast", "system_reset", payload);
  return NextResponse.json({ success: true, ...payload });
}
