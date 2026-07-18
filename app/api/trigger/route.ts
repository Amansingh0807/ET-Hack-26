import { NextResponse } from "next/server";
import { dbInstance } from "@/lib/db";
import { runWatcher, runModeler, runFixer } from "@/lib/agents";
import { eventEmitter } from "@/lib/eventBus";

export async function POST(req: Request) {
  try {
    const { headline, source, daysDisrupted = 1 } = await req.json();

    if (!headline) {
      return NextResponse.json({ error: "Headline is required" }, { status: 400 });
    }

    // 1. Run Watcher to parse geopolitical risk signal
    const watcherResult = await runWatcher(headline);

    // 2. Add event to mock database
    const newEvent = dbInstance.addEvent({
      headline,
      source: source || "Global Intel Feed",
      affectedZone: watcherResult.affected_chokepoint,
      severityScore: watcherResult.severity_score,
      briefSummary: watcherResult.brief_summary
    });

    // 3. Run Modeler to calculate cascading economic impacts
    const modelerResult = runModeler(watcherResult.severity_score, daysDisrupted);

    // 4. Run Fixer for any affected tankers
    let fixerRecommendation = null;
    const tankers = dbInstance.getTankers();
    
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

    const payload = {
      event: newEvent,
      modeler: modelerResult,
      fixer: fixerRecommendation,
      tankers: dbInstance.getTankers()
    };

    // Broadcast update to all connected SSE clients
    eventEmitter.emit("broadcast", "crisis_triggered", payload);

    return NextResponse.json({ success: true, ...payload });
  } catch (error: any) {
    console.error("Error in trigger API route:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
