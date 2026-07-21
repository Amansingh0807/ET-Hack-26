# 🛡️ Project RAMPART — Autonomous Crude Oil Supply Chain Resilience Platform

> **ET Hackathon 26 Solution** | Built by **Team FLIQ ODD**  
> *India's first AI-powered autonomous command center for real-time maritime threat detection, economic cascade modeling, and emergency crude oil tanker procurement & rerouting.*

---

![Project Rampart Banner](https://img.shields.io/badge/Architecture-3--Agent%20Autonomous%20System-ff6b4b?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16.2%20(Turbopack)-000000?style=for-the-badge&logo=nextdotjs)
![Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![AI Model](https://img.shields.io/badge/AI%20Engine-Google%20Gemma%202%20via%20OpenRouter-4285F4?style=for-the-badge&logo=google)
![Live Market Data](https://img.shields.io/badge/Market%20Data-Yahoo%20Finance%20API-6001D2?style=for-the-badge&logo=yahoo)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## 📋 Table of Contents
1. [Executive Overview](#-executive-overview)
2. [Macroeconomic & Geopolitical Problem Space](#-macroeconomic--geopolitical-problem-space)
3. [The Rampart Autonomous Architecture](#-the-rampart-autonomous-architecture)
4. [Mathematical & Economic Simulation Models](#-mathematical--economic-simulation-models)
5. [System Design & Database Schema](#-system-design--database-schema)
6. [Platform Modules Deep-Dive](#-platform-modules-deep-dive)
7. [Competitive Advantage & Differentiator Matrix](#-competitive-advantage--differentiator-matrix)
8. [Failure Resilience & Fallback Protocols](#-failure-resilience--fallback-protocols)
9. [Installation & Developer Setup](#-installation--developer-setup)
10. [Team & License](#-team--license)

---

## 📌 Executive Overview

**Project Rampart** is a national-grade energy security platform engineered specifically for the Indian economy. India is currently the world’s **third-largest consumer of crude oil**, importing **over 85% of its daily energy requirements** (approximately **4.5 million barrels per day**).

When geopolitical conflicts, naval blockades, or drone strikes occur in key maritime corridors (such as the Strait of Hormuz or the Red Sea), the traditional reaction chain across government ministries, state-owned refiners (IOCL, BPCL, HPCL), and private energy giants (Reliance Jamnagar, Nayara Vadinar) is plagued by **information asymmetry, manual verification delays, and delayed procurement execution**.

Rampart bridges this critical gap by implementing an **autonomous 3-agent AI orchestration pipeline**. The system continuously monitors global news feeds, parses threat telemetry via Google Gemma 2 LLM, projects cascading economic shocks on Indian refineries in milliseconds, and generates executable procurement rerouting plans — compressing a **multi-day government deliberation process into under 2 seconds**.

```
+---------------------------------------------------------------------------------------------------+
|                                  PROJECT RAMPART VALUE PIPELINE                                   |
+---------------------------------------------------------------------------------------------------+
|  [OSINT News Feed]  ──>  [Agent 1: Watcher]  ──>  [Agent 2: Modeler]  ──>  [Agent 3: Fixer]     |
|   Live Maritime News       AI Risk Classifier       Economic Surge Model     Procurement Reroute  |
|   (gCaptain, Reuters)     (Gemma 2 via OpenRouter) (Yahoo Finance Live BZ=F) (Cape Route & Supp)  |
+---------------------------------------------------------------------------------------------------+
```

---

## 🌊 Macroeconomic & Geopolitical Problem Space

### 1. The Vulnerability of India's Crude Oil Import Corridors

India’s refining capacity stands at approximately **250 million metric tonnes per annum (MMTPA)**, making it a critical refining hub for South Asia. However, the crude oil feedstock powering these refineries relies almost entirely on seaborne tankers traversing three highly volatile maritime bottlenecks:

```
+-----------------------------------------------------------------------------------+
|                            MARITIME CHOKEPOINT RISK MAP                           |
+-----------------------------------------------------------------------------------+
| 1. Strait of Hormuz  --> 20M bbl/day (~30% global crude)  --> Persian Gulf Outflow|
| 2. Bab el-Mandeb     --> 6.2M bbl/day (~10% global crude) --> Red Sea / Suez      |
| 3. Suez Canal        --> 5.0M bbl/day (Europe/Russia)     --> Med to Indian Ocean |
+-----------------------------------------------------------------------------------+
```

- **Strait of Hormuz**: Connects Middle Eastern suppliers (Saudi Aramco, Iraq SOMO, UAE ADNOC, Kuwait KPC) to India’s western ports (Jamnagar, Vadinar, Mumbai). Susceptible to Iranian naval blockades and missile escalations.
- **Bab el-Mandeb & Red Sea**: Connects Mediterranean and Black Sea crude (Russian Urals, Mediterranean blends) to the Arabian Sea. Recent drone and anti-ship missile attacks by Houthi insurgents have forced tankers to abandon the Suez Canal shortcut.
- **Cape of Good Hope Bypass**: Moving tankers around the southern tip of Africa avoids Red Sea chokepoint risk completely but adds **12 to 15 additional transit days** and **$3.50 to $6.00 per barrel** in logistics and freight surcharges.

```
+-----------------------------------------------------------------------------------+
|                         INDIA'S REFINERY IMPORT DEPENDENCY                        |
+-----------------------------------------------------------------------------------+
|  Refinery          | Crude Intake (bpd) | Primary Supplier Route                  |
| -------------------|--------------------|-----------------------------------------|
|  Jamnagar (RL)     | ~1.24 Million      | Saudi Aramco via Strait of Hormuz       |
|  Vadinar (Nayara)  | ~400,000           | Iraq SOMO via Strait of Hormuz          |
|  Kochi (BPCL)      | ~310,000           | Russian Urals via Red Sea / Suez        |
|  Paradeep (IOCL)   | ~300,000           | West African (NNPC) / US Gulf (Cape)    |
+-----------------------------------------------------------------------------------+
```

### 2. The Legacy Operational Failure Mode

When a maritime threat erupts, conventional energy administration suffers from three fatal systemic flaws:

1. **Information Verification Lag (24 - 48 Hours)**: Intelligence analysts must manually aggregate OSINT news feeds, verify reports through maritime embassies, and classify threat severity.
2. **Siloed Economic Impact Analysis (1 - 2 Days)**: Assessing how price spikes impact Strategic Petroleum Reserves (SPR) and individual refinery run-rates is done in disconnected, static spreadsheets.
3. **Slow Procurement Execution (3 - 7 Days)**: Negotiating spot purchases from alternative global suppliers and re-charting VLCC (Very Large Crude Carrier) tankers takes days. Meanwhile, demurrage fees stack up, oil spot prices surge, and domestic pump prices rise by **10-18%**, triggering domestic inflation across transport and manufacturing sectors.

---

## 🤖 The Rampart Autonomous Architecture

Rampart operates as a decoupled, multi-agent AI system. Rather than relying on rigid if-else logic or static mock data, Rampart utilizes **autonomous LLM agents**, **live market API feeds**, and **Server-Sent Events (SSE)** to model crises dynamically.

```mermaid
graph TD
    A[OSINT & News Ingestion] -->|Raw Headline & Body| B(Agent 1: Watcher)
    B -->|Google Gemma 2 LLM| C{Threat Classification JSON}
    
    C -->|Broadcast Event| D[SSE Event Bus / Event Emitter]
    
    D -->|Active Threat Event| E(Agent 2: Modeler)
    E -->|Query Live Quotes| F[Yahoo Finance API BZ=F]
    F -->|Spot Price Data| E
    E -->|Economic Cascade Model| D
    
    D -->|Risk Telemetry| G(Agent 3: Fixer)
    G -->|Query Supplier DB| H[(Supabase PostgreSQL)]
    H -->|Grade & Location Data| G
    G -->|Procurement Protocol| D

    D -->|Realtime Stream| I[Next.js 16 Command Center]
    I --> J[Leaflet Geospatial Map Engine]
    I --> K[Impact & Refinery Panel]
    I --> L[Bento Financial Terminal /live-price]
```

---

### 🔍 Agent Breakdown & Responsibilities

#### 1. Agent 1: The Watcher (Threat Intelligence Ingestor)
- **Input**: Raw unstructured text streams from maritime news sources (gCaptain, Reuters Energy, Lloyd's List, Maritime OSINT).
- **Core Engine**: Google Gemma 2 (via OpenRouter API).
- **Function**: Extracts threat parameters and formats them into strict JSON telemetry:
  ```json
  {
    "affectedZone": "Strait of Hormuz",
    "threatType": "NAVAL_BLOCKADE",
    "severityScore": 9,
    "confidenceScore": 0.94,
    "summary": "Iranian naval forces seize crude oil tanker in international waters near Fujairah."
  }
  ```

#### 2. Agent 2: The Modeler (Economic Cascade Engine)
- **Input**: Structured Threat JSON from Agent 1 + Live Brent Crude market quote.
- **Core Engine**: Real-time economic impact formula engine.
- **Function**:
  - Connects to Yahoo Finance API (`BZ=F`) to pull live Brent Crude spot prices.
  - Calculates spot price increase percentage:
    $$\Delta P_{\text{surge}} = P_{\text{live}} \times \left(1 + \frac{\text{Severity}}{100} \times \omega_{\text{zone}}\right)$$
  - Projects refinery capacity degradation:
    $$\text{RunRate}_{\text{refinery}} = \max\left(50\%, 100\% - (\text{Severity} \times 3.5\%)\right)$$
  - Tracks Strategic Petroleum Reserve (SPR) drawdown trajectory (days remaining).

#### 3. Agent 3: The Fixer (Procurement Orchestrator & Rerouter)
- **Input**: Shortfall data + Supplier & Route database from Supabase PostgreSQL.
- **Core Engine**: Procurement optimization algorithm & recommendation generator.
- **Function**:
  - Filters global suppliers (Saudi Aramco, Rosneft, Petrobras, NNPC, US Gulf Coast) for crude grade compatibility (API Gravity & Sulfur % match).
  - Calculates alternative maritime routes avoiding affected chokepoints (e.g. Cape of Good Hope bypass).
  - Generates a military-grade executive briefing for the Ministry of Petroleum.
  - Allows **one-click autonomous rerouting** with immediate visual feedback (route color change + confetti confirmation).

---

## 📐 Mathematical & Economic Simulation Models

Rampart uses quantitative pricing models to ensure that simulated crisis events mirror real-world market mechanics.

### 1. Spot Price Surge Model
$$\text{Price}_{\text{new}} = \text{Price}_{\text{base}} \times \left(1 + \frac{S \cdot Z_k}{100}\right)$$
Where:
- $\text{Price}_{\text{base}}$ = Live Brent Crude Spot Price from Yahoo Finance API.
- $S$ = Severity Score ($1 \le S \le 10$).
- $Z_k$ = Chokepoint Risk Weight ($Z_{\text{Hormuz}} = 1.15$, $Z_{\text{RedSea}} = 0.85$, $Z_{\text{Suez}} = 0.65$).

### 2. Delivered Crude Cost per Barrel
$$\text{Cost}_{\text{delivered}} = \text{Price}_{\text{spot}} + \text{Freight}_{\text{base}} + \text{Surcharge}_{\text{logistics}} + \text{Insurance}_{\text{war\_risk}}$$
Where:
- $\text{Surcharge}_{\text{logistics}}$ is calculated based on transit days added by Cape of Good Hope rerouting.

---

## 🗄️ System Design & Database Schema

Rampart utilizes **Supabase PostgreSQL** managed via **Prisma ORM 6.x** for strict type safety and relational data integrity.

```prisma
model Supplier {
  id               String   @id @default(cuid())
  name             String
  country          String
  crudeGrade       String   // e.g. "Arab Light", "Urals", "Bonny Light"
  apiGravity       Float    // API gravity rating
  sulfurContent    Float    // Sulfur percentage
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
  geoCoordinates   Json          // Polyline array [[lat, lng], ...]
  tankers          ActiveTanker[]
}

model ActiveTanker {
  id             String   @id @default(cuid())
  name           String
  imoNumber      String   @unique
  capacityBarrels Int
  status         String   // "IN_TRANSIT", "AT_RISK", "REROUTED"
  currentLat     Float
  currentLng     Float
  progress       Float
  routeId        String
  route          Route    @relation(fields: [routeId], references: [id])
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

## 💻 Platform Modules Deep-Dive

### 1. 🌐 Live Geospatial Command Center (`/`)

The primary command center gives energy commanders a full-screen, high-resolution operational overview:

- **Leaflet Map Layer**: Customized dark basemap tiles displaying live position markers for active tankers (e.g. *MV Desh Vishal*, *MT Swarna Kamal*), Indian refineries, and pulsing red threat circles around contested waters.
- **Uber-Style Animated Routes**: SVG dashed polylines rendered with continuous CSS animation effects (`stroke-dashoffset`) visualizing active crude oil movement across the Indian Ocean.
- **Interactive Crisis Simulator**: One-click scenario cards (`Gulf of Oman Escalation`, `Red Sea Attack`, `OPEC Surprise Cut`) enabling instant demonstration of multi-agent cascading response.
- **Confetti Protocol**: Upon executing an AI reroute recommendation, the interface triggers an interactive confetti blast (`canvas-confetti`) confirming supply chain restoration.

---

### 2. 📊 Bento-Box Financial Terminal (`/live-price`)

Accessible directly by clicking any crude oil price in the command center, the `/live-price` route is a standalone financial terminal built using a Dribbble-trending Bento-Box design:

- **Multi-Market Ticker Cards**: Real-time quotes for **Brent Crude** (BZ=F), **WTI Crude** (CL=F), **Dubai/Oman**, and the **Indian Crude Basket**.
- **Interactive Timeframe Selector**:
  - `Today's Live`: 15-minute intraday tick data for the past 24 hours.
  - `5 Days`: 30-minute interval trend analysis.
  - `50 Days`: Daily closing records with **7-period Simple Moving Average (SMA)** overlays.
- **Dynamic Timeframe Slider Bar**: Interactive indicator displaying exact price position ($0\% - 100\%$) relative to the period High and Low.
- **Maritime Supply Route Matrix**: Route-by-route cost matrix displaying delivered price/barrel, transit days, chokepoint risk badges, logistics surcharges, and **7-day predictive trend forecasts**.
- **☀️ / 🌙 Light & Dark Theme Toggle**: Instant transition between deep matte charcoal (`#08090d`) and crisp slate white (`#f8fafc`) aesthetics.

---

## 🏆 Competitive Advantage & Differentiator Matrix

| Feature / Metric | Legacy Government Workflow | Typical Hackathon Project | **Project Rampart (FLIQ ODD)** |
|---|---|---|---|
| **Threat Detection** | Manual News Monitoring (24h+) | Hardcoded String Logic | **Real Gemma 2 LLM AI Agents** |
| **Market Spot Quotes** | Delayed Static Quotes | Mocked Static Numbers | **Live Yahoo Finance API (BZ=F/CL=F)** |
| **Data Persistence** | Isolated Spreadsheets | LocalStorage / In-Memory | **Supabase PostgreSQL DB via Prisma** |
| **Map Visualization** | Static PDF Maps | Standard Map Markers | **Uber-Style Animated Flowing Polylines** |
| **Reroute Protocol** | Manual Negotiations (Days) | Text Suggestion | **Executable Procurement & Cape Rerouting** |
| **Financial Terminal** | None | Simple Line Graph | **Bento-Box Multi-Market 1D/5D/50D Terminal** |
| **Theme Adaptability** | Fixed Theme | Single Theme | **Dynamic Light / Dark Theme Switcher** |

---

## 🛡️ Failure Resilience & Fallback Protocols

Rampart is engineered to maintain high availability even during external API downtime:

1. **Market Data Fallback Chain**:
   - Primary: Yahoo Finance API (`query1.finance.yahoo.com`).
   - Secondary: Stooq Market Index CSV feed.
   - Tertiary: Rampart Oil Index synthetic fluctuation fallback algorithm.
2. **Geospatial Coordinate Guard Rails**:
   - Defensive validation (`isNaN` filtering) on tanker coordinates to prevent Leaflet map crashes.
3. **Database Unique Constraint Defense**:
   - Automatic pre-deletion and upsert operations during database resetting and re-seeding to prevent key conflict crashes.

---

## 🛠️ Installation & Developer Setup

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

### 5. Build and Verify Production Code
```bash
npm run build
```

### 6. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Team & License

Built with ❤️ for **ET Hackathon 26** by **Team FLIQ ODD**:
- **Project Lead & Developer**: Aman Singh (`@Amansingh0807`)

Distributed under the **MIT License**. See `LICENSE` for more information.
