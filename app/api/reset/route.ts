import { NextResponse } from "next/server";
import { dbInstance } from "@/lib/db";
import { eventEmitter } from "@/lib/eventBus";

export async function POST() {
  dbInstance.reset();
  const payload = {
    tankers: dbInstance.getTankers(),
    events: dbInstance.getEvents()
  };

  eventEmitter.emit("broadcast", "system_reset", payload);
  return NextResponse.json({ success: true, ...payload });
}

export async function GET() {
  dbInstance.reset();
  const payload = {
    tankers: dbInstance.getTankers(),
    events: dbInstance.getEvents()
  };

  eventEmitter.emit("broadcast", "system_reset", payload);
  return NextResponse.json({ success: true, ...payload });
}
