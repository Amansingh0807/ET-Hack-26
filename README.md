# 🛡️ Project RAMPART — Autonomous Crude Oil Supply Chain Resilience Platform

> **Official Solution for ET Hackathon 26** | Developed by **Team FLIQ ODD**  
> *India’s flagship autonomous AI command center for real-time maritime geopolitical threat intelligence, macroeconomic cascade modeling, and automated crude oil tanker procurement & rerouting.*

---

![Project Rampart Banner](https://img.shields.io/badge/Architecture-3--Agent%20Autonomous%20System-ff6b4b?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16.2%20(Turbopack)-000000?style=for-the-badge&logo=nextdotjs)
![Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemma%202%20via%20OpenRouter-4285F4?style=for-the-badge&logo=google)
![Live Market Data](https://img.shields.io/badge/Market%20Data-Yahoo%20Finance%20API-6001D2?style=for-the-badge&logo=yahoo)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📑 TABLE OF CONTENTS

1. [Executive Overview & Mission Statement](#1-executive-overview--mission-statement)
2. [Macroeconomic & Geopolitical Vulnerability Analysis](#2-macroeconomic--geopolitical-vulnerability-analysis)
   - 2.1 [India's Energy Security Profile](#21-indias-energy-security-profile)
   - 2.2 [The Three Critical Maritime Bottlenecks](#22-the-three-critical-maritime-bottlenecks)
   - 2.3 [Indian Refinery Feedstock Mapping](#23-indian-refinery-feedstock-mapping)
   - 2.4 [The Flaws of Legacy Government Workflows](#24-the-flaws-of-legacy-government-workflows)
3. [The Rampart Autonomous Multi-Agent Architecture](#3-the-rampart-autonomous-multi-agent-architecture)
   - 3.1 [Agent 1: The Watcher (OSINT & Threat Classifier)](#31-agent-1-the-watcher-osint--threat-classifier)
   - 3.2 [Agent 2: The Modeler (Economic Cascade Engine)](#32-agent-2-the-modeler-economic-cascade-engine)
   - 3.3 [Agent 3: The Fixer (Procurement & Reroute Orchestrator)](#33-agent-3-the-fixer-procurement--reroute-orchestrator)
4. [Mathematical & Quantitative Simulation Models](#4-mathematical--quantitative-simulation-models)
   - 4.1 [Spot Price Surge Formula](#41-spot-price-surge-formula)
   - 4.2 [Refinery Operational Run-Rate Degradation](#42-refinery-operational-run-rate-degradation)
   - 4.3 [Delivered Crude Cost & Logistics Surcharge Equation](#43-delivered-crude-cost--logistics-surcharge-equation)
5. [System Topography & Architecture Diagram](#5-system-topography--architecture-diagram)
6. [Database Schema & Data Persistence Model](#6-database-schema--data-persistence-model)
7. [Real-Time Streaming Engine (Server-Sent Events)](#7-real-time-streaming-engine-server-sent-events)
8. [Platform Modules Deep-Dive](#8-platform-modules-deep-dive)
   - 8.1 [Geospatial Command Center (`/`)](#81-geospatial-command-center-)
   - 8.2 [Bento-Box Financial Market Terminal (`/live-price`)](#82-bento-box-financial-market-terminal-live-price)
9. [Competitive Differentiator Matrix](#9-competitive-differentiator-matrix)
10. [Failure Mode Resilience & API Fallback Protocols](#10-failure-mode-resilience--api-fallback-protocols)
11. [Installation & Developer Quickstart](#11-installation--developer-quickstart)
12. [Team & License Information](#12-team--license-information)

---

## 1. EXECUTIVE OVERVIEW & MISSION STATEMENT

**Project Rampart** is a national-grade energy security platform engineered explicitly to shield India’s industrial and domestic economy from maritime oil supply chain shocks. India currently ranks as the world’s third-largest consumer of crude oil, consuming approximately **5.2 million barrels per day (bpd)**. Because domestic crude production yields less than **15% of total demand**, India is forced to import over **85% of its crude oil requirements** (approximately **4.5 million barrels per day**) via seaborne tankers.

When geopolitical crises erupt in critical maritime transit zones — such as naval blockades in the Strait of Hormuz, Houthi drone strikes in the Red Sea, or sudden OPEC+ production cuts — traditional government ministries and state-owned refiners suffer from severe information fragmentation. News reports take up to **48 hours** to verify, economic impact modeling across India's Strategic Petroleum Reserves (SPR) takes days, and manual spot procurement negotiations require lengthy committee deliberations.

```
+---------------------------------------------------------------------------------------------------+
|                                 PROJECT RAMPART VALUE PIPELINE                                    |
+---------------------------------------------------------------------------------------------------+
|  [OSINT News Stream] ──> [Agent 1: Watcher]  ──> [Agent 2: Modeler]  ──> [Agent 3: Fixer]       |
|  Live Maritime News      AI Risk Classification   Economic Surge Model     Procurement Rerouting  |
|  (gCaptain, Reuters)    (Gemma 2 via OpenRouter)  (Yahoo Finance BZ=F)     (Cape Route & Supp)    |
+---------------------------------------------------------------------------------------------------+
```

Rampart eliminates this operational lag by deploying an **autonomous 3-agent artificial intelligence pipeline** running on Server-Sent Events (SSE). Rampart continuously monitors global maritime intelligence, classifies geopolitical threats using Google Gemma 2 LLM, projects cascading economic shocks on Indian refineries in milliseconds, and autonomously generates executable procurement rerouting plans — compressing a multi-day government deliberation into **under 2 seconds**.

---

## 2. MACROECONOMIC & GEOPOLITICAL VULNERABILITY ANALYSIS

### 2.1 India's Energy Security Profile

The Indian refining ecosystem processes over **250 million metric tonnes per annum (MMTPA)** of crude feedstock across key coastal refineries. However, because over 85% of this crude is imported by sea, India’s national macro-economy is exceptionally vulnerable to geopolitical choke points. A sustained **$10 per barrel increase** in global crude prices inflates India's annual import bill by approximately **$13 billion**, widens the Current Account Deficit (CAD) by **0.4% of GDP**, and directly triggers retail fuel inflation (+12-18% at petrol pumps) across transport, logistics, and agricultural supply chains.

```
+-----------------------------------------------------------------------------------+
|                            THE MARITIME VULNERABILITY                             |
+-----------------------------------------------------------------------------------+
|  Middle East (Saudi/Iraq/UAE) --> [ Strait of Hormuz ] ---> (Jamnagar / Vadinar)  |
|  Russian Urals (Black Sea)    --> [ Suez / Red Sea ]  ---> (Kochi Refinery)       |
|  West African / US Gulf       --> [ Cape of Good Hope ] -> (Paradeep Refinery)    |
+-----------------------------------------------------------------------------------+
```

### 2.2 The Three Critical Maritime Bottlenecks

India's primary crude oil import lines are concentrated through three extremely narrow maritime chokepoints:

1. **Strait of Hormuz**: Connecting the Persian Gulf to the Arabian Sea, this narrow passage handles over **20 million barrels per day** (~30% of total global seaborne crude). Over **60% of India's Middle Eastern crude imports** (from Saudi Aramco, Iraq SOMO, UAE ADNOC, and Kuwait KPC) pass through Hormuz. It is highly susceptible to Iranian naval blockades, mine threats, and ship seizures.
2. **Bab el-Mandeb & Red Sea**: Connecting the Indian Ocean to the Red Sea and Suez Canal, this corridor carries ~**6.2 million barrels per day**. Drone and anti-ship ballistic missile attacks by Houthi insurgents have made this route highly dangerous for commercial Very Large Crude Carriers (VLCCs).
3. **Suez Canal**: The primary shortcut linking Mediterranean and Russian Black Sea ports (Novorossiysk) to India’s west coast ports (Kochi and Mumbai). 

### 2.3 Indian Refinery Feedstock Mapping

India's major refining complexes rely on specific crude oil slates imported via dedicated maritime shipping lanes:

```
+---------------------------------------------------------------------------------------------------+
|                               INDIAN REFINERY FEEDSTOCK MAPPING                                   |
+---------------------------------------------------------------------------------------------------+
|  Refinery Complex    | Operational Capacity | Primary Feedstock Grade  | Primary Shipping Corridor|
| ---------------------|----------------------|--------------------------|--------------------------|
|  Jamnagar (Reliance) | ~1.24 Million bpd    | Arab Light / Medium      | Strait of Hormuz         |
|  Vadinar (Nayara)    | ~400,000 bpd         | Basrah Medium (Iraq)     | Strait of Hormuz         |
|  Kochi (BPCL)        | ~310,000 bpd         | Russian Urals            | Suez Canal / Red Sea     |
|  Paradeep (IOCL)     | ~300,000 bpd         | Bonny Light / US Gulf    | Cape of Good Hope        |
+---------------------------------------------------------------------------------------------------+
```

### 2.4 The Flaws of Legacy Government Workflows

When a maritime disruption occurs in any of these corridors, legacy administrative frameworks fail due to three structural bottlenecks:

- **Information Verification Lag (24 - 48 Hours)**: Diplomatic cables and OSINT reports must be manually read, translated, and verified across multiple intelligence bureaus before official risk advisories are issued.
- **Siloed Economic Impact Forecasting (1 - 2 Days)**: Strategic Petroleum Reserve (SPR) drawdown trajectories and refinery capacity degradations are computed manually using static, disconnected spreadsheets.
- **Protracted Spot Procurement Negotiations (3 - 7 Days)**: Finding alternative crude suppliers with compatible API gravity and sulfur specifications and re-charting VLCC routes takes up to a week. During this delay, demurrage costs escalate, spot oil prices surge, and domestic refineries are forced to reduce run-rates, leading to fuel shortages across domestic markets.

---

## 3. THE RAMPART AUTONOMOUS MULTI-AGENT ARCHITECTURE

To overcome human verification latency, Rampart implements an **autonomous 3-agent orchestration engine**. Operating as decoupled microservices over an event-driven Server-Sent Events (SSE) channel, these three agents handle **intelligence ingestion**, **economic modeling**, and **procurement rerouting** simultaneously.

```
  ┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
  │   Agent 1: Watcher      │ ────> │   Agent 2: Modeler      │ ────> │   Agent 3: Fixer        │
  │ (OSINT Ingestion Feed   │       │ (Economic Cascade Engine│       │ (Procurement Matcher    │
  │  & Gemma 2 Threat LLM)  │       │  & Brent Price Surge)   │       │  & Cape Route Rerouter) │
  └─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
```

### 3.1 Agent 1: The Watcher (OSINT & Threat Classifier)

- **Purpose**: Continuously monitors unstructured intelligence feeds (gCaptain, Reuters Energy, Lloyd's List, maritime Twitter/X OSINT feeds) and extracts actionable threat telemetry.
- **LLM Engine**: **Google Gemma 2** running via **OpenRouter API**.
- **Ingestion Pipeline**: The Watcher receives raw text bodies, passes them to a specialized prompt template, and enforces strict JSON output parsing:
  ```json
  {
    "affectedZone": "Strait of Hormuz",
    "threatType": "NAVAL_BLOCKADE",
    "severityScore": 9,
    "confidenceScore": 0.94,
    "summary": "Iranian naval forces seize crude oil tanker near Fujairah, blocking commercial traffic."
  }
  ```
- **Risk Weighting**: Assigns a severity score ($1 \le S \le 10$) and maps the threat to a specific geopolitical chokepoint (`Strait of Hormuz`, `Red Sea`, `Suez Canal`).

---

### 3.2 Agent 2: The Modeler (Economic Cascade Engine)

- **Purpose**: Triggers immediately upon threat verification to model macroeconomic damage across India's energy sector.
- **Live Market Integration**: Queries live **Brent Crude Spot (BZ=F)** pricing from Yahoo Finance API.
- **Cascade Simulation Output**:
  1. Calculates the percentage surge in global crude spot prices based on chokepoint threat severity.
  2. Simulates operational run-rate drops across affected Indian refineries (e.g. Jamnagar dropping to 80%, Kochi to 70%).
  3. Computes Indian Strategic Petroleum Reserve (SPR) depletion rates and days-to-empty projections.

---

### 3.3 Agent 3: The Fixer (Procurement & Reroute Orchestrator)

- **Purpose**: Generates military-grade executive procurement plans and reroutes affected tankers around high-risk zones.
- **Database Matching**: Queries India's supplier database in **Supabase PostgreSQL** to identify alternative global suppliers (Saudi Aramco, Rosneft, Petrobras, NNPC, US Gulf Coast) that match crude gravity (API Gravity) and sulfur content requirements.
- **Route Optimization**: Calculates alternative shipping corridors (e.g. bypassing the Red Sea via the Cape of Good Hope) and estimates added transit days and logistics surcharges.
- **One-Click Execution**: Emits an executive recommendation card allowing operational commanders to execute the reroute with a single click, instantly updating map coordinates and triggering visual confirmation.

---

## 4. MATHEMATICAL & QUANTITATIVE SIMULATION MODELS

To ensure high empirical accuracy, Rampart relies on structured quantitative economic equations:

### 4.1 Spot Price Surge Formula
$$\text{Price}_{\text{new}} = \text{Price}_{\text{base}} \times \left(1 + \frac{S \cdot Z_k}{100}\right)$$

Where:
- $\text{Price}_{\text{base}}$ = Live Brent Crude spot price fetched from Yahoo Finance API.
- $S$ = Threat severity score ($1 \le S \le 10$).
- $Z_k$ = Chokepoint Risk Weight ($Z_{\text{Hormuz}} = 1.15$, $Z_{\text{RedSea}} = 0.85$, $Z_{\text{Suez}} = 0.65$).

### 4.2 Refinery Operational Run-Rate Degradation
$$\text{RunRate}_{\text{refinery}} = \max\left(50\%, 100\% - (S \times 3.5\%)\right)$$

If an imported crude slate passes through an active high-severity conflict zone, the refinery's operational capacity degrades proportionally to prevent complete feedstock exhaustion.

### 4.3 Delivered Crude Cost & Logistics Surcharge Equation
$$\text{Cost}_{\text{delivered}} = \text{Price}_{\text{spot}} + \text{Freight}_{\text{base}} + \text{Surcharge}_{\text{logistics}} + \text{Insurance}_{\text{war\_risk}}$$

Where logistics surcharges increase dynamically based on additional transit days incurred by bypassing chokepoints via the Cape of Good Hope.

---

## 5. SYSTEM TOPOGRAPHY & ARCHITECTURE DIAGRAM

```mermaid
graph TD
    A[OSINT News Stream & Maritime Intelligence] -->|Raw Text Payload| B(Agent 1: Watcher)
    B -->|Google Gemma 2 LLM Parsing| C{Structured Threat JSON}
    
    C -->|Emit Event| D[SSE Real-time Event Bus]
    
    D -->|Broadcast Event| E(Agent 2: Modeler)
    E -->|Query Live Quotes| F[Yahoo Finance API BZ=F]
    F -->|Spot Price Data| E
    E -->|Economic Cascade Model| D
    
    D -->|Risk Telemetry| G(Agent 3: Fixer)
    G -->|Query Supplier Database| H[(Supabase PostgreSQL)]
    H -->|Grade & Location Data| G
    G -->|Procurement Reroute Plan| D

    D -->|Realtime Stream| I[Next.js 16 Client App]
    I --> J[Leaflet Geospatial Map Engine]
    I --> K[Impact & Refinery Panel]
    I --> L[Bento Financial Terminal /live-price]
```

---

## 6. DATABASE SCHEMA & DATA PERSISTENCE MODEL

Rampart uses **Supabase PostgreSQL** managed through **Prisma ORM 6.x** to enforce strict type safety and relational data integrity across suppliers, routes, tankers, and geopolitical events:

```prisma
model Supplier {
  id               String   @id @default(cuid())
  name             String
  country          String
  crudeGrade       String   // e.g. "Arab Light", "Urals", "Bonny Light"
  apiGravity       Float    // API Gravity Rating
  sulfurContent    Float    // Sulfur Percentage
  dailyCapacityBpd Int
  pricePerBarrel   Float
  routes           Route[]
}

model Route {
  id               String        @id @default(cuid())
  name             String
  originPort       String
  destinationPort  String
  chokepoints      String[]      // e.g. ["Strait of Hormuz"]
  transitDays      Int
  geoCoordinates   Json          // Array of coordinate pairs [[lat, lng], ...]
  tankers          ActiveTanker[]
}

model ActiveTanker {
  id              String   @id @default(cuid())
  name            String
  imoNumber       String   @unique
  capacityBarrels Int
  status          String   // "IN_TRANSIT", "AT_RISK", "REROUTED"
  currentLat      Float
  currentLng      Float
  progress        Float
  routeId         String
  route           Route    @relation(fields: [routeId], references: [id])
}

model GeopoliticalEvent {
  id            String   @id @default(cuid())
  headline      String
  affectedZone  String
  severityScore Int
  timestamp     DateTime @default(now())
}
```

---

## 7. REAL-TIME STREAMING ENGINE (SERVER-SENT EVENTS)

Rather than using heavy WebSocket connections or wasteful client-side polling, Rampart implements an **event-driven Server-Sent Events (SSE)** broadcasting channel (`/api/events`).

When a user triggers a scenario or an OSINT headline is processed, the backend server pushes an SSE event stream directly to connected client browsers. The Next.js client listens via standard `EventSource` APIs, triggering instant state updates (`setTankers`, `setEvents`, `setModeler`, `setFixer`) across both the geospatial map and financial panels without requiring page reloads.

---

## 8. PLATFORM MODULES DEEP-DIVE

### 8.1 Geospatial Command Center (`/`)

- **Full-Bleed Leaflet Map**: Interactive geospatial map displaying real-time locations of active tankers, Indian refinery complexes, and glowing red threat circles around high-risk chokepoints.
- **Uber-Style Animated Flowing Routes**: Custom SVG polylines rendered with continuous CSS animations (`stroke-dashoffset`) visualizing active crude oil movement across the Arabian Sea.
- **Interactive Crisis Simulator**: Scenario triggers (`Gulf of Oman Escalation`, `Red Sea Drone Attack`, `OPEC Surprise Cut`) enabling instant live demonstrations for judges.
- **Confetti Victory Protocol**: Interactive visual confirmation using `canvas-confetti` when an operational reroute protocol is executed.

---

### 8.2 Bento-Box Financial Market Terminal (`/live-price`)

Accessible by clicking any crude rate in the command center, `/live-price` is a standalone financial terminal designed with a Dribbble-trending Bento-Box layout:

- **Multi-Market Tickers**: Live spot pricing for **Brent Crude** (BZ=F), **WTI Crude** (CL=F), **Dubai/Oman**, and **Indian Basket**.
- **Interactive Timeframe Selector**:
  - `Today's Live`: 15-minute intraday tick data for the past 24 hours.
  - `5 Days`: 30-minute interval trend analysis.
  - `50 Days`: Daily closing records with **7-period Simple Moving Average (SMA)** overlays.
- **Dynamic Timeframe Slider Bar**: Interactive indicator displaying exact price positioning ($0\% - 100\%$) relative to period High and Low bounds.
- **Maritime Supply Route Matrix**: Route-by-route breakdown showing delivered cost ($/bbl), transit days, chokepoint risk badges, logistics surcharges, and **7-day predictive forecasts**.
- **☀️ / 🌙 Light & Dark Theme Toggle**: Instant transition between dark matte charcoal (`#08090d`) and crisp slate white (`#f8fafc`) aesthetics.

---

## 9. COMPETITIVE DIFFERENTIATOR MATRIX

| Capability / Metric | Legacy Government Workflow | Typical Hackathon Entry | **Project Rampart (FLIQ ODD)** |
|---|---|---|---|
| **Threat Detection** | Manual News Monitoring (24h+) | Hardcoded If/Else Strings | **Real Gemma 2 LLM AI Agents** |
| **Market Data** | Delayed Static Quotes | Mocked Static Numbers | **Live Yahoo Finance API (BZ=F/CL=F)** |
| **Data Persistence** | Isolated Spreadsheets | LocalStorage / In-Memory | **Supabase PostgreSQL DB via Prisma** |
| **Map Visualization** | Static PDF Maps | Standard Map Markers | **Uber-Style Animated Flowing Polylines** |
| **Reroute Protocol** | Manual Negotiations (Days) | Simple Text Suggestions | **Executable Procurement & Cape Rerouting** |
| **Financial Terminal** | None | Single Line Chart | **Bento-Box Multi-Market 1D/5D/50D Terminal** |
| **Theme Adaptability** | Fixed Theme | Single Theme | **Dynamic Light / Dark Theme Switcher** |

---

## 10. FAILURE MODE RESILIENCE & API FALLBACK PROTOCOLS

Rampart is engineered for extreme high-availability:

1. **Market Price Fallback Chain**:
   - Primary: Yahoo Finance API (`query1.finance.yahoo.com`).
   - Secondary: Stooq Market Index CSV feed.
   - Tertiary: Rampart Oil Index synthetic fluctuation fallback algorithm.
2. **Geospatial Coordinate Guard Rails**:
   - Defensive validation (`isNaN` filtering) on tanker coordinates to prevent Leaflet map rendering crashes.
3. **Database Unique Constraint Defense**:
   - Automatic pre-deletion and upsert operations during database resetting and re-seeding to prevent key conflict crashes.

---

## 11. INSTALLATION & DEVELOPER QUICKSTART

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **PostgreSQL Database**: Supabase or local PostgreSQL instance

### 1. Clone Repository
```bash
git clone https://github.com/Amansingh0807/ET-Hack-26.git
cd ET-Hack-26
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_SUPABASE_PROJECT].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_SUPABASE_PROJECT].supabase.co:5432/postgres"

OPENROUTER_API_KEY="your_openrouter_api_key_here"
```

### 4. Push Database Schema & Seed Data
```bash
npx prisma db push
npx prisma db seed
```

### 5. Build and Verify Production Bundle
```bash
npm run build
```

### 6. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 12. TEAM & LICENSE INFORMATION

Developed with ❤️ for **ET Hackathon 26** by **Team FLIQ ODD**:
- **Project Lead & Developer**: Aman Singh (`@Amansingh0807`)

> **Note**: While Rampart successfully advanced past the initial stages, this prototype was not selected for the final round of the ET Hackathon 2026. However, it stands as a testament to what autonomous, AI-driven architectures can achieve in supply chain resilience! 

Distributed under the **MIT License**.
