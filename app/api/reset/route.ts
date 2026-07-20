import { NextResponse } from "next/server";
import { resetDb, getTankers, getEvents, getRoutes } from "@/lib/db";
import { eventEmitter } from "@/lib/eventBus";
import { getLiveBrentCrudePrice } from "@/lib/oilPrice";

export async function POST() {
  await resetDb();
  const liveOil = await getLiveBrentCrudePrice();
  const payload = {
    tankers: await getTankers(),
    events: await getEvents(),
    routes: await getRoutes(),
    liveOil
  };

  eventEmitter.emit("broadcast", "system_reset", payload);
  return NextResponse.json({ success: true, ...payload });
}

export async function GET() {
  await resetDb();
  const liveOil = await getLiveBrentCrudePrice();
  const payload = {
    tankers: await getTankers(),
    events: await getEvents(),
    routes: await getRoutes(),
    liveOil
  };

  eventEmitter.emit("broadcast", "system_reset", payload);
  return NextResponse.json({ success: true, ...payload });
}
