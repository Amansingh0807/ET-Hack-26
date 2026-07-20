import { NextResponse } from "next/server";
import { addEvent, getTankers } from "@/lib/db";
import { runWatcher, runModeler, runFixer } from "@/lib/agents";
import { eventEmitter } from "@/lib/eventBus";
import { getLiveBrentCrudePrice } from "@/lib/oilPrice";

export async function POST(req: Request) {
  try {
    const { headline, source, daysDisrupted = 1 } = await req.json();

    if (!headline) {
      return NextResponse.json({ error: "Headline is required" }, { status: 400 });
    }

    // 1. Fetch live market Brent Crude price
    const liveOilData = await getLiveBrentCrudePrice();

    // 2. Run Watcher to parse geopolitical risk signal
    const watcherResult = await runWatcher(headline);

    // 3. Add event to Prisma database
    const newEvent = await addEvent({
      headline,
      source: source || "Global Intel Feed",
      affectedZone: watcherResult.affected_chokepoint,
      severityScore: watcherResult.severity_score,
      briefSummary: watcherResult.brief_summary
    });

    // 4. Run Modeler to calculate cascading economic impacts based on live base price
    const modelerResult = runModeler(watcherResult.severity_score, daysDisrupted, liveOilData.price);

    // 4. Run Fixer for any affected tankers
    let fixerRecommendation = null;
    const tankers = await getTankers();
    
    // Find a tanker affected by this chokepoint to generate alternatives for
    const affectedTanker = tankers.find(
      t => t.status === "AT_RISK"
    );

    if (affectedTanker && watcherResult.affected_chokepoint !== "None") {
      // Calculate shortfall volume based on the tanker's capacity
      const shortfallVolume = affectedTanker.cargoVolume;
      
      fixerRecommendation = await runFixer(
        watcherResult.affected_chokepoint,
        watcherResult.severity_score,
        shortfallVolume,
        affectedTanker.vesselName,
        affectedTanker.routeId
      );
    }

    // Must await the second getTankers() call to get updated statuses (since addEvent updates them)
    const updatedTankers = await getTankers();

    const payload = {
      event: newEvent,
      modeler: modelerResult,
      fixer: fixerRecommendation,
      tankers: updatedTankers
    };

    // Broadcast update to all connected SSE clients
    eventEmitter.emit("broadcast", "crisis_triggered", payload);

    return NextResponse.json({ success: true, ...payload });
  } catch (error: any) {
    console.error("Error in trigger API route:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
