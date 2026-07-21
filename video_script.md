# Project RAMPART — ET Hackathon Video Script & Concept

---

## PART 1: What Exactly Are We Building?

### The One-Liner
**Rampart** is India's first AI-powered, real-time crude oil supply chain resilience platform that detects geopolitical threats from live news, simulates cascading economic impacts on Indian refineries in milliseconds, and autonomously orchestrates emergency tanker rerouting — all before the Ministry of Petroleum even picks up the phone.

### The Full Picture
India imports **85% of its crude oil**. Every single barrel travels through some of the most dangerous maritime corridors on earth — the Strait of Hormuz, the Red Sea, the Suez Canal. One Houthi drone strike. One Iranian naval blockade. One OPEC surprise cut. And suddenly, petrol prices at your local pump jump by 15 rupees overnight.

**Rampart** solves this by building a **live command center** that:

1. **Watches** — Ingests real-time maritime news from gCaptain, Reuters, and OSINT intelligence feeds. An AI agent (powered by Google Gemma 2 via OpenRouter) instantly classifies whether a headline is a genuine supply chain threat, which chokepoint is affected, and how severe it is (1-10).

2. **Models** — The moment a threat is detected, a second AI agent calculates the cascading economic damage: Brent Crude spot price surge (fetched LIVE from Yahoo Finance), Indian Strategic Petroleum Reserve (SPR) depletion countdown, and which of India's 4 major refineries (Jamnagar, Vadinar, Kochi, Paradeep) will face critical crude shortfalls.

3. **Fixes** — A third AI agent (the Procurement Orchestrator) instantly evaluates alternative suppliers (Saudi Aramco, Petrobras Brazil, Nigeria NNPC, US Gulf Coast), calculates Cape of Good Hope bypass routes, and generates a military-grade executive briefing for the Ministry of Petroleum. One click, and the tanker is rerouted in real time on a live interactive map.

---

## PART 2: Why This Solution Stands Out (Killer Differentiators)

### vs. Other Hackathon Solutions

| What Others Will Build | What Rampart Does |
|---|---|
| Static dashboards with mock data | Live Supabase PostgreSQL database with persistent state across restarts |
| Hardcoded "if-else" risk scoring | Real LLM AI agents (OpenRouter/Gemma) parsing live news headlines |
| No actual map | Full interactive Leaflet map with Uber-style animated flowing routes and live tanker movement |
| No live market data | Real-time Brent Crude BZ=F pricing from Yahoo Finance API |
| Desktop-only layout | Fully responsive (mobile bottom nav, tablet, desktop floating glass panels) |
| Monolithic code | 3-agent architecture (Watcher -> Modeler -> Fixer) with SSE real-time event streaming |
| No procurement logic | Full alternative supplier database with grade compatibility matching and Cape route bypass calculations |

### The "Holy Shit" Moments for Judges
1. **Live news → AI classification → price spike → tanker reroute in under 3 seconds**
2. **Tankers visually sailing across the ocean in real time (Uber-style)**
3. **Confetti explosion when the reroute saves India's supply chain**
4. **Live Brent Crude price with a green LIVE badge updating from actual market feeds**
5. **One-click system reset that wipes and re-seeds the entire Supabase database live**

---

## PART 3: Video Concept & Shot List

### Video Format
- **Duration**: 3-4 minutes
- **Tone**: Cinematic urgency → Technical depth → Emotional payoff
- **Style**: Screen recording with voiceover narration. Dark theme dashboard looks incredible on screen.

### Shot-by-Shot Breakdown

---

#### SHOT 1: THE HOOK (0:00 - 0:25)
**Visual**: Black screen. White text fades in, one line at a time.

> *Text on screen:*
> "India imports 85% of its crude oil."
> "Every barrel passes through the world's most dangerous waters."
> "One missile. One blockade. One tweet."
> "And 1.4 billion people feel the price at the pump."
> 
> *Beat. Then:*
> "What if India could see it coming?"

**Visual**: Hard cut to the Rampart dashboard — dark map, glowing blue route lines flowing across the Arabian Sea, tanker markers pulsing.

**Voiceover**: *"This is Project Rampart."*

---

#### SHOT 2: THE PROBLEM (0:25 - 1:00)
**Visual**: Quick cuts of real news headlines (screenshot Google News for "Houthi Red Sea attack", "Strait of Hormuz tensions", "OPEC production cut"). Then show the map zoomed into the chokepoints.

**Voiceover**:
> *"India's energy security hangs on three chokepoints — the Strait of Hormuz, the Red Sea, and the Suez Canal. When Houthi rebels launch drone strikes, when Iran threatens naval blockades, India's crude oil supply doesn't just slow down — it stops. Refineries run dry. Fuel prices spike. The entire economy feels the shockwave."*
>
> *"The problem? By the time traditional systems detect a threat, analyze the impact, and find alternatives — it's already too late. Days lost. Billions spent."*

---

#### SHOT 3: THE SOLUTION REVEAL (1:00 - 1:30)
**Visual**: Show the full Rampart dashboard in its glory. Slowly pan across: the Signal Feed on the left, the live map with flowing routes in the center, the Economic Impact panel on the right.

**Voiceover**:
> *"Rampart is a 3-agent AI system that compresses this entire chain — threat detection, economic modeling, and procurement orchestration — into a single real-time command center."*
>
> *"Agent 1, The Watcher, ingests live maritime intelligence feeds and uses an LLM to classify threats in real time."*
> *"Agent 2, The Modeler, calculates the immediate economic cascade — live Brent Crude price surges, SPR depletion timelines, and refinery shortfall projections."*
> *"Agent 3, The Fixer, evaluates alternative suppliers across the globe and generates optimized rerouting strategies."*

---

#### SHOT 4: THE LIVE DEMO — CRISIS TRIGGER (1:30 - 2:30)
**Visual**: This is the money shot. Screen record the following flow LIVE:

1. Click the **"Gulf of Oman Escalation"** scenario card
2. Watch the **Tactical Alert** banner animate in at the top
3. Watch the **map zoom into the Strait of Hormuz** with the red threat circle pulsing
4. Watch the tanker marker turn **amber/orange** (AT_RISK status)
5. Watch **Brent Crude price spike from live baseline to +10%** in the Economic Impact panel
6. Watch the **Refinery Status cards drop** (Jamnagar 80%, Kochi 70%)
7. Watch the **AI Reroute Ready** card slide in with the Fixer's recommendation

**Voiceover**:
> *"Watch this. A crisis breaks — explosions reported near the Strait of Hormuz. In under 2 seconds, Rampart's Watcher agent classifies this as a Severity 9 threat. The Modeler instantly calculates a 10% Brent Crude price surge. Kochi refinery drops to 70% capacity. And here — the Fixer agent has already found an alternative: reroute via the Cape of Good Hope, bypassing the entire conflict zone."*

---

#### SHOT 5: THE REROUTE — EMOTIONAL PAYOFF (2:30 - 3:00)
**Visual**: Click the **"Reroute via Rosneft / Urals"** button. Show:

1. The button loading animation
2. The **confetti explosion** on success
3. The tanker route **instantly changing** on the map to the new Cape route (green dashed line)
4. The tanker marker turning **emerald green** (REROUTED)
5. The price stabilizing back down

**Voiceover**:
> *"One click. The tanker is rerouted. India's supply chain is secured. The Brent price stabilizes. Refineries resume full operations. What used to take the Ministry of Petroleum days of emergency meetings — Rampart does in 2 seconds."*

---

#### SHOT 6: TECH STACK & ARCHITECTURE (3:00 - 3:30)
**Visual**: Show a clean architecture diagram (you can quickly make one in Canva/Figma):

```
[Live News Feeds] → [Agent 1: Watcher (LLM)] → [Agent 2: Modeler]
                                                       ↓
[Supabase PostgreSQL] ← [Agent 3: Fixer] → [Live Map + SSE Stream]
                                                       ↓
                                              [Yahoo Finance API]
```

**Voiceover**:
> *"Under the hood: Next.js 16 with Turbopack. Prisma ORM connected to a live Supabase PostgreSQL database. Three AI agents powered by Google Gemma 2 through OpenRouter. Server-Sent Events for instant real-time updates. Yahoo Finance API for live Brent Crude pricing. And a fully responsive glassmorphism interface that works on desktop, tablet, and mobile."*

---

#### SHOT 7: THE CLOSER (3:30 - 3:50)
**Visual**: Zoom out to show the full dashboard one final time. Slowly fade to black.

**Voiceover**:
> *"India can't control where its oil comes from. But with Rampart, India can control what happens when the world tries to cut it off."*
>
> *"Project Rampart. Built for ET Hack 26."*

**Visual**: Logo/team name appears on black screen.

---

## PART 4: Pro Tips for Maximum Impact

1. **Record in Dark Mode**: The glassmorphism + dark Leaflet map tiles look absolutely cinematic on video. Never use light mode for the recording.

2. **Use OBS Studio** for screen recording. Set resolution to 1920x1080, 60fps. Record the browser in fullscreen.

3. **Record the demo flow in ONE continuous take** — judges love seeing that it's genuinely live and not spliced together.

4. **Add subtle background music**: Use royalty-free cinematic/tension music (try Artlist or YouTube Audio Library — search "cinematic tension"). Keep it low, under the voiceover.

5. **Pause for 1-2 seconds** after each major visual moment (price spike, reroute, confetti) to let the judge absorb what just happened.

6. **End with your problem statement number** and team name clearly visible for 3 seconds.

---

## PART 5: Winning Argument (Why ONLY Rampart Solves This PS)

If judges ask "why is this better than existing solutions?", here's your answer:

> *"Existing solutions are either pure dashboards with no intelligence, or pure AI models with no operational integration. Rampart is the ONLY solution that closes the entire loop — from raw news ingestion, through AI-powered risk classification, through live economic modeling with actual market data, all the way to executable procurement action with real supplier databases and maritime route optimization. No other solution at this hackathon has live LLM agents, live market data, live database persistence, AND live interactive geospatial visualization — all working together in real time."*
