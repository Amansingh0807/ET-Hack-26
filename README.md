# 🛡️ Project RAMPART — Autonomous Crude Oil Supply Chain Resilience Platform

> **ET Hackathon 26 Solution** | Built by **Team FLIQ ODD**  
> *India's first AI-powered command center for real-time maritime threat detection, economic cascade modeling, and autonomous tanker procurement & rerouting.*

---

![Project Rampart Banner](https://img.shields.io/badge/Architecture-3--Agent%20Autonomous%20System-ff6b4b?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16.2%20(Turbopack)-000000?style=for-the-badge&logo=nextdotjs)
![Supabase PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![AI Model](https://img.shields.io/badge/AI%20Engine-Google%20Gemma%202%20via%20OpenRouter-4285F4?style=for-the-badge&logo=google)
![Live Market Data](https://img.shields.io/badge/Market%20Data-Yahoo%20Finance%20API-6001D2?style=for-the-badge&logo=yahoo)

---

## 📌 Executive Summary & Macroeconomic Context

India is the world's **third-largest consumer of crude oil**, importing over **85% of its total energy requirements** (approximately **4.5 million barrels per day**). Over **65% of these imports** transit through three highly volatile maritime chokepoints:

1. **Strait of Hormuz**: Handles 20+ million barrels/day (~30% of global seaborne crude). Susceptible to Iranian naval blockades and missile strikes.
2. **Bab el-Mandeb & Red Sea**: Vulnerable to Houthi drone strikes, forcing tankers to abandon the Suez Canal shortcut.
3. **Suez Canal**: Critical corridor connecting European/Russian crude to Indian west coast refineries.

```
+-----------------------------------------------------------------------------------+
|                            THE MARITIME VULNERABILITY                             |
+-----------------------------------------------------------------------------------+
|  Saudi Aramco / Iraq / UAE  --> [ Strait of Hormuz ] ---> (Jamnagar / Vadinar)    |
|  Russian Urals (Black Sea)  --> [ Suez / Red Sea ]  ---> (Kochi Refinery)         |
|  West African / US Gulf     --> [ Cape of Good Hope ] -> (Paradeep Refinery)      |
+-----------------------------------------------------------------------------------+
```

### The Problem
When a geopolitical disruption occurs (e.g., drone strikes, naval blockades, OPEC+ production cuts):
- **Information Lag**: Government ministries take **hours to days** to verify OSINT and news reports.
- **Siloed Analysis**: Economic forecasting and maritime logistics operate in isolated silos, delaying impact assessment on Indian Strategic Petroleum Reserves (SPR) and refinery capacities (Jamnagar, Vadinar, Kochi, Paradeep).
- **Delayed Rerouting**: Manual procurement negotiations and route adjustments take **3 to 7 days**, resulting in hundreds of millions of dollars in demurrage costs, fuel price spikes (+15-20% at petrol pumps), and potential refinery shutdowns.

---

## 🚀 The Rampart Solution

**Rampart** solves this national security threat by building an **autonomous, end-to-end supply chain resilience engine**. It compresses the multi-day chain of threat detection, economic impact modeling, and procurement rerouting into **under 2 seconds**.

```
  ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
  │ Agent 1: Watcher│ ────> │ Agent 2: Modeler│ ────> │  Agent 3: Fixer │
  │ (OSINT Ingestion│       │(Economic Cascade│       │ (Procurement &  │
  │   & Threat LLM) │       │   Surge Model)  │       │ Route Rerouting)│
  └─────────────────┘       └─────────────────┘       └─────────────────┘
```

### 🧠 The 3-Agent Autonomous Pipeline

1. **Agent 1: The Watcher (Threat Intelligence Ingestor)**
   - Ingests real-time maritime intelligence and news feeds (gCaptain, Reuters, Lloyd's List, OSINT feeds).
   - Uses **Google Gemma 2 (via OpenRouter)** to parse unstructured text and output structured JSON:
     - Target Chokepoint (`Strait of Hormuz`, `Red Sea`, `Suez Canal`)
     - Threat Type (`DRONE_STRIKE`, `NAVAL_BLOCKADE`, `PIRACY`, `OPEC_CUT`)
     - Severity Score (`1 to 10`)

2. **Agent 2: The Modeler (Economic Cascade Engine)**
   - Triggers the moment a threat is verified.
   - Queries live **Brent Crude (BZ=F)** spot pricing via Yahoo Finance API.
   - Calculates the macroeconomic cascade:
     - Immediate Brent Crude price surge percentage (e.g., +10.2%)
     - Indian Strategic Petroleum Reserve (SPR) drawdown countdown
     - Refinery operational run-rate degradation (e.g., Jamnagar 80%, Kochi 70%)

3. **Agent 3: The Fixer (Procurement Orchestrator & Rerouter)**
   - Evaluates India's global supplier database (Saudi Aramco, Rosneft Urals, Petrobras Brazil, Nigeria NNPC, US Gulf Coast).
   - Performs grade-compatibility matching (API gravity & sulfur content matching).
   - Computes maritime bypass alternatives (e.g., Cape of Good Hope bypass adding 12 days but eliminating 100% chokepoint risk).
   - Generates a military-grade executive briefing for the Ministry of Petroleum and allows **one-click autonomous rerouting**.

---

## 🏗️ System Architecture & Data Flow

Rampart is built on a decoupled, event-driven multi-agent architecture utilizing Next.js 16 App Router, Prisma ORM, Supabase PostgreSQL, and Server-Sent Events (SSE) for zero-latency live updates.

```mermaid
graph TD
    A[Live News Feeds / OSINT] -->|Raw Text| B(Agent 1: Watcher LLM)
    B -->|Structured Threat JSON| C{Event Bus / SSE Stream}
    
    C -->|Broadcast Event| D(Agent 2: Modeler)
    D -->|Query Live Quotes| E[Yahoo Finance API BZ=F]
    E -->|Spot Price Data| D
    D -->|Economic Cascade Model| C
    
    C -->|Risk & Shortfall Data| F(Agent 3: Fixer)
    F -->|Query Supplier DB| G[(Supabase PostgreSQL)]
    G -->|Supplier & Route Matrix| F
    F -->|Reroute Recommendation| C

    C -->|Realtime Event Stream| H[Frontend Command Center]
    H --> I[Leaflet Geospatial Map Engine]
    H --> J[Impact & Refinery Panel]
    H --> K[Live Oil Price Terminal /live-price]
```

---

## 💻 Key Platform Capabilities

### 1. 🌐 Live Command Center (`/`)
- **Full-Bleed Geospatial Map**: Leaflet-powered map displaying live Indian tanker locations, strategic refineries, and critical chokepoints.
- **Uber-Style Animated Routes**: Custom SVG flowing dashed polylines visualizing active maritime oil supply lines across the Indian Ocean.
- **Interactive Crisis Simulator**: One-click scenario triggers (`Gulf of Oman Escalation`, `Red Sea Drone Attack`, `OPEC Surprise Cut`) to test system resilience live.
- **Confetti Victory Protocol**: Autonomous visual confirmation when a recommended reroute protocol is executed.

### 2. 📊 Bento-Box Financial Terminal (`/live-price`)
- **Dribbble-Grade SaaS Aesthetic**: Matte charcoal theme (`#08090d`), modular slate cards (`#12141c`), and vibrant coral-orange (`#ff6b4b`) data highlights.
- **Multi-Market Live Ticker**: Concurrent quotes for **Brent Crude** (BZ=F), **WTI Crude** (CL=F), **Dubai/Oman**, and the **Indian Crude Basket**.
- **Interactive Timeframe Selector**:
  - `Today's Live`: 15-minute intraday tick data for 24 hours.
  - `5 Days`: 30-minute interval trend line.
  - `50 Days`: Daily closing OHLC records with 7-period Simple Moving Average (SMA) overlays.
- **Dynamic Timeframe Bounds**: Interactive range slider displaying exact price positioning within the active period high/low.
- **Maritime Supply Route Matrix**: Route-by-route breakdown of delivered cost per barrel, transit days, chokepoints, logistics surcharges, and 7-day predictive forecasts.
- **☀️ / 🌙 Light & Dark Theme Toggle**: Full light and dark mode palette adaptation.

---

## ⚡ Technical Stack

| Component | Technology | Description |
|---|---|---|
| **Framework** | Next.js 16.2 (Turbopack) | App Router, Server Components & Dynamic API Routes |
| **Database** | Supabase PostgreSQL | Managed cloud database with persistent state |
| **ORM** | Prisma ORM 6.x | Type-safe schema definition, migrations, and seed scripts |
| **AI LLM Engine** | Google Gemma 2 (via OpenRouter) | Unstructured news parsing & risk classification |
| **Realtime Sync** | Server-Sent Events (SSE) | Event-driven streaming of multi-agent state updates |
| **Market Data** | Yahoo Finance API | Real-time Brent Crude & WTI market quotes |
| **Geospatial Map** | Leaflet.js | Map rendering, custom markers, threat circle overlays |
| **Charts** | Recharts 2.x | Area charts, volume bars, SMA overlays, custom tooltips |
| **Styling** | Tailwind CSS v4 | Glassmorphism, CSS variables, dark/light themes |

---

## 🏆 Why Rampart Stands Out (Competitive Differentiators)

| Metric / Feature | Traditional Solutions | Other Hackathon Entries | **Project Rampart (FLIQ ODD)** |
|---|---|---|---|
| **Threat Detection** | Manual News Ingestion (Hours) | Hardcoded If/Else Rules | **Real LLM AI Agents (Google Gemma 2)** |
| **Economic Modeling** | Static Excel Spreadsheets | Fixed Mock Numbers | **Live Market Quotes (Yahoo Finance API)** |
| **Database Persistence** | Session Memory / LocalStorage | Hardcoded In-Memory Objects | **Live Supabase PostgreSQL via Prisma** |
| **Geospatial Visualization** | Static Images / Maps | Simple Marker Points | **Animated Flowing Routes & Live Tankers** |
| **Procurement Engine** | None | Simple Text List | **Supplier Matching & Cape Bypass Rerouting** |
| **Financial Terminal** | None | Simple Single Line Graph | **Bento-Box Multi-Market 1D/5D/50D Terminal** |

---

## 🛠️ Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL Database**: Supabase or local Postgres instance

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

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👥 Team Credits

Built with ❤️ for **ET Hackathon 26** by **Team FLIQ ODD**:
- **Project Lead & Developer**: Aman Singh (`@Amansingh0807`)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
