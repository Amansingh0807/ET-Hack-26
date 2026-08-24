const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Project RAMPART — Official Technical Submission Brief</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    @page {
      size: A4;
      margin: 18mm 15mm 20mm 15mm;
    }
    
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      background-color: #ffffff;
      line-height: 1.6;
      font-size: 13.5px;
      margin: 0;
      padding: 0;
    }

    /* Cover / Header Banner */
    .header-banner {
      background: linear-gradient(135deg, #08090d 0%, #12141c 100%);
      color: #ffffff;
      padding: 32px 36px;
      border-radius: 16px;
      margin-bottom: 30px;
      border-left: 6px solid #ff6b4b;
      box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    }

    .header-badge {
      display: inline-block;
      background: rgba(255, 107, 75, 0.15);
      color: #ff6b4b;
      border: 1px solid rgba(255, 107, 75, 0.3);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 12px;
    }

    .header-banner h1 {
      font-size: 26px;
      font-weight: 900;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
      color: #ffffff;
    }

    .header-banner p {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
      font-weight: 400;
      line-height: 1.5;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .meta-item {
      font-size: 11px;
    }
    .meta-item span {
      display: block;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
    }
    .meta-item strong {
      color: #f1f5f9;
      font-weight: 700;
    }

    /* Headings */
    h2 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-top: 32px;
      margin-bottom: 16px;
      letter-spacing: -0.3px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 22px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    p {
      margin-top: 0;
      margin-bottom: 14px;
      text-align: justify;
    }

    /* Section highlight callout */
    .callout {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #3b82f6;
      padding: 14px 18px;
      border-radius: 8px;
      margin: 18px 0;
      font-size: 13px;
    }
    .callout-title {
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 4px;
    }

    /* Mermaid Architecture Container */
    .diagram-container {
      background-color: #08090d;
      border: 1px solid #1e293b;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    }

    .diagram-title {
      color: #ff6b4b;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 16px;
    }

    .mermaid {
      background: transparent;
      display: flex;
      justify-content: center;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
      page-break-inside: avoid;
    }

    th {
      background-color: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 10px 12px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    td {
      padding: 9px 12px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    tr:nth-child(even) td {
      background-color: #f8fafc;
    }

    /* Code Blocks */
    pre, code {
      font-family: 'JetBrains Mono', monospace;
    }

    code {
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11.5px;
    }

    pre {
      background-color: #0f172a;
      color: #f8fafc;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 11px;
      line-height: 1.5;
      margin: 16px 0;
      page-break-inside: avoid;
    }

    pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
    }

    /* ASCII Diagrams */
    .ascii-box {
      font-family: 'JetBrains Mono', monospace;
      background: #0f172a;
      color: #38bdf8;
      padding: 14px;
      border-radius: 8px;
      font-size: 10.5px;
      line-height: 1.4;
      white-space: pre;
      margin: 16px 0;
      page-break-inside: avoid;
    }

    /* Page Breaks */
    .page-break {
      page-break-before: always;
    }

    /* Footer */
    .doc-footer {
      margin-top: 40px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- Cover Header Banner -->
  <div class="header-banner">
    <div class="header-badge">Official Hackathon Submission Whitepaper</div>
    <h1>PROJECT RAMPART</h1>
    <p>Autonomous Crude Oil Supply Chain Resilience Command Center — Real-time maritime threat classification, macroeconomic impact modeling, and automated tanker rerouting.</p>
    
    <div class="meta-grid">
      <div class="meta-item">
        <span>Hackathon Track</span>
        <strong>AI & Supply Chain</strong>
      </div>
      <div class="meta-item">
        <span>Event</span>
        <strong>ET Hackathon 26</strong>
      </div>
      <div class="meta-item">
        <span>Team Name</span>
        <strong>FLIQ ODD</strong>
      </div>
      <div class="meta-item">
        <span>Lead Developer</span>
        <strong>Aman Singh</strong>
      </div>
    </div>
  </div>

  <!-- 1. Executive Summary -->
  <h2>1. Executive Summary & Mission Statement</h2>
  <p><strong>Project Rampart</strong> is an autonomous, AI-powered crude oil supply chain resilience command center engineered specifically for the Indian economy. India is currently the world’s third-largest consumer of crude oil, consuming over <strong>5.2 million barrels per day (bpd)</strong>. Because domestic crude production yields less than 15% of total demand, India is forced to import over <strong>85% of its crude oil requirements</strong> (approximately 4.5 million barrels per day) via seaborne oil tankers.</p>
  
  <p>When geopolitical conflicts, naval blockades, or drone strikes occur in key maritime corridors (such as the Strait of Hormuz or the Red Sea), the traditional reaction chain across government ministries, state-owned refiners (IOCL, BPCL, HPCL), and private energy giants (Reliance Jamnagar, Nayara Vadinar) is plagued by information asymmetry, manual verification delays, and delayed spot procurement execution.</p>

  <div class="ascii-box">+---------------------------------------------------------------------------------------------------+
|                                 PROJECT RAMPART VALUE PIPELINE                                    |
+---------------------------------------------------------------------------------------------------+
|  [OSINT News Stream] ──> [Agent 1: Watcher]  ──> [Agent 2: Modeler]  ──> [Agent 3: Fixer]       |
|  Live Maritime News      AI Risk Classification   Economic Surge Model     Procurement Rerouting  |
|  (gCaptain, Reuters)    (Gemma 2 via OpenRouter)  (Yahoo Finance BZ=F)     (Cape Route & Supp)    |
+---------------------------------------------------------------------------------------------------+</div>

  <p>Rampart eliminates this operational lag by deploying an <strong>autonomous 3-agent artificial intelligence pipeline</strong> running on Server-Sent Events (SSE). Rampart continuously monitors global news feeds, parses threat telemetry via Google Gemma 2 LLM, projects cascading economic shocks on Indian refineries in milliseconds, and autonomously generates executable procurement rerouting plans — compressing a multi-day government deliberation into <strong>under 2 seconds</strong>.</p>

  <!-- 2. Macroeconomic Context -->
  <h2>2. Macroeconomic & Geopolitical Vulnerability Analysis</h2>
  
  <h3>2.1 India's Energy Security Profile</h3>
  <p>The Indian refining ecosystem processes over <strong>250 million metric tonnes per annum (MMTPA)</strong> of crude feedstock across key coastal refineries. However, because over 85% of this crude is imported by sea, India’s national macro-economy is exceptionally vulnerable to geopolitical choke points. A sustained <strong>$10 per barrel increase</strong> in global crude prices inflates India's annual import bill by approximately <strong>$13 billion</strong>, widens the Current Account Deficit (CAD) by <strong>0.4% of GDP</strong>, and directly triggers retail fuel inflation (+12-18% at petrol pumps) across transport, logistics, and agricultural supply chains.</p>

  <h3>2.2 The Three Critical Maritime Bottlenecks</h3>
  <p>India's primary crude oil import lines are concentrated through three extremely narrow maritime chokepoints:</p>

  <table>
    <thead>
      <tr>
        <th>Chokepoint</th>
        <th>Daily Crude Volume</th>
        <th>Global Share</th>
        <th>Primary Vulnerability Profile</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Strait of Hormuz</strong></td>
        <td>~20.5 Million bpd</td>
        <td>30% Global Crude</td>
        <td>Persian Gulf outflow. Susceptible to Iranian naval blockades & missile strikes.</td>
      </tr>
      <tr>
        <td><strong>Bab el-Mandeb / Red Sea</strong></td>
        <td>~6.2 Million bpd</td>
        <td>10% Global Crude</td>
        <td>Red Sea shortcut. Susceptible to Houthi drone & anti-ship missile strikes.</td>
      </tr>
      <tr>
        <td><strong>Suez Canal</strong></td>
        <td>~5.0 Million bpd</td>
        <td>8% Global Crude</td>
        <td>Mediterranean / Black Sea crude link to Indian west coast ports.</td>
      </tr>
    </tbody>
  </table>

  <h3>2.3 Indian Refinery Feedstock Mapping</h3>
  <table>
    <thead>
      <tr>
        <th>Refinery Complex</th>
        <th>Capacity (bpd)</th>
        <th>Primary Crude Slate</th>
        <th>Primary Maritime Shipping Corridor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Jamnagar (Reliance)</strong></td>
        <td>~1,240,000 bpd</td>
        <td>Arab Light / Medium</td>
        <td>Saudi Arabia via Strait of Hormuz</td>
      </tr>
      <tr>
        <td><strong>Vadinar (Nayara)</strong></td>
        <td>~400,000 bpd</td>
        <td>Basrah Medium (Iraq)</td>
        <td>Persian Gulf via Strait of Hormuz</td>
      </tr>
      <tr>
        <td><strong>Kochi (BPCL)</strong></td>
        <td>~310,000 bpd</td>
        <td>Russian Urals</td>
        <td>Black Sea via Red Sea / Suez Canal</td>
      </tr>
      <tr>
        <td><strong>Paradeep (IOCL)</strong></td>
        <td>~300,000 bpd</td>
        <td>Bonny Light / US Gulf</td>
        <td>West Africa / US via Cape of Good Hope</td>
      </tr>
    </tbody>
  </table>

  <!-- Page Break for Clean Layout -->
  <div class="page-break"></div>

  <!-- 3. The 3-Agent Architecture -->
  <h2>3. The Rampart Autonomous Multi-Agent Architecture</h2>
  
  <p>Rampart operates as a decoupled, multi-agent AI system. Rather than relying on rigid if-else logic or static mock data, Rampart utilizes <strong>autonomous LLM agents</strong>, <strong>live market API feeds</strong>, and <strong>Server-Sent Events (SSE)</strong> to model crises dynamically.</p>

  <div class="diagram-container">
    <div class="diagram-title">System Topography & Multi-Agent Dataflow Architecture</div>
    <div class="mermaid">
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

        D -->|Realtime Stream| I[Next.js 16 Command Center]
        I --> J[Leaflet Geospatial Map Engine]
        I --> K[Impact & Refinery Panel]
        I --> L[Bento Financial Terminal /live-price]
    </div>
  </div>

  <h3>3.1 Agent 1: The Watcher (OSINT Threat Classifier)</h3>
  <p>The Watcher ingests raw text streams from maritime sources (gCaptain, Reuters Energy, Lloyd's List) and passes them to <strong>Google Gemma 2</strong> via OpenRouter API. It enforces strict JSON telemetry output:</p>

<pre><code>{
  "affectedZone": "Strait of Hormuz",
  "threatType": "NAVAL_BLOCKADE",
  "severityScore": 9,
  "confidenceScore": 0.94,
  "summary": "Iranian naval forces seize crude oil tanker near Fujairah, blocking commercial traffic."
}</code></pre>

  <h3>3.2 Agent 2: The Modeler (Economic Cascade Engine)</h3>
  <p>The Modeler queries live <strong>Brent Crude (BZ=F)</strong> quotes from Yahoo Finance API, calculates immediate spot price surges, projects refinery run-rate drops (e.g. Jamnagar 80%, Kochi 70%), and tracks Indian Strategic Petroleum Reserve (SPR) drawdown trajectories.</p>

  <h3>3.3 Agent 3: The Fixer (Procurement Orchestrator & Rerouter)</h3>
  <p>The Fixer queries India's supplier database in <strong>Supabase PostgreSQL</strong> to identify alternative global suppliers (Saudi Aramco, Rosneft, Petrobras, NNPC, US Gulf Coast) that match crude gravity (API Gravity) and sulfur requirements. It calculates Cape of Good Hope bypass routes and enables <strong>one-click autonomous tanker rerouting</strong>.</p>

  <!-- 4. Mathematical Models -->
  <h2>4. Quantitative Simulation Models</h2>
  
  <div class="callout">
    <div class="callout-title">1. Spot Price Surge Equation</div>
    <code>Price_new = Price_base * (1 + (Severity * Risk_Weight) / 100)</code><br>
    Where <code>Risk_Weight</code> for Strait of Hormuz is 1.15, Red Sea is 0.85, and Suez Canal is 0.65.
  </div>

  <div class="callout">
    <div class="callout-title">2. Refinery Operational Run-Rate Degradation</div>
    <code>RunRate_refinery = max(50%, 100% - (Severity * 3.5%))</code><br>
    Calculates feedstock shortfall when shipping lanes pass through high-severity conflict zones.
  </div>

  <!-- 5. Database Schema -->
  <h2>5. Database Schema & Data Model</h2>
  <p>Rampart uses <strong>Supabase PostgreSQL</strong> with <strong>Prisma ORM 6.x</strong> for complete relational data integrity:</p>

<pre><code>model Supplier {
  id               String   @id @default(cuid())
  name             String
  country          String
  crudeGrade       String   // e.g. "Arab Light", "Urals", "Bonny Light"
  apiGravity       Float
  sulfurContent    Float
  dailyCapacityBpd Int
  pricePerBarrel   Float
  routes           Route[]
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
}</code></pre>

  <!-- Page Break -->
  <div class="page-break"></div>

  <!-- 6. Platform Capabilities -->
  <h2>6. Platform Modules Deep-Dive</h2>
  
  <h3>6.1 Live Geospatial Command Center ('/')</h3>
  <p>Provides an interactive <strong>Leaflet geospatial map</strong> with live tanker markers, refinery status indicators, threat circle overlays, and <strong>Uber-style animated polyline routes</strong> with continuous CSS movement (<code>stroke-dashoffset</code>). Includes one-click scenario crisis triggers and interactive confetti victory protocol upon reroute execution.</p>

  <h3>6.2 Bento-Box Financial Terminal ('/live-price')</h3>
  <p>A standalone Dribbble-grade financial dashboard featuring:</p>
  <ul>
    <li><strong>Multi-Market Tickers</strong>: Live prices for Brent Crude, WTI Crude, Dubai/Oman, and Indian Basket.</li>
    <li><strong>Interactive Timeframes</strong>: Today's Live (15m ticks), 5 Days (30m ticks), and 50 Days (daily OHLC + 7-period SMA).</li>
    <li><strong>Dynamic Range Slider</strong>: Visual indicator displaying price positioning relative to period High/Low bounds.</li>
    <li><strong>Route-Wise Matrix</strong>: Shipping corridor cost breakdown, logistics surcharges, and 7-day forecasts.</li>
    <li><strong>Light & Dark Theme Switcher</strong>: Instant transition between deep matte charcoal ('#08090d') and crisp slate white ('#f8fafc').</li>
  </ul>

  <!-- 7. Competitive Matrix -->
  <h2>7. Competitive Advantage & Differentiator Matrix</h2>
  
  <table>
    <thead>
      <tr>
        <th>Capability</th>
        <th>Legacy Government Workflow</th>
        <th>Typical Hackathon Entry</th>
        <th>Project Rampart (FLIQ ODD)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Threat Detection</strong></td>
        <td>Manual OSINT Verification (24h+)</td>
        <td>Hardcoded Strings</td>
        <td><strong>Real Gemma 2 LLM AI Agents</strong></td>
      </tr>
      <tr>
        <td><strong>Market Data</strong></td>
        <td>Delayed Static Quotes</td>
        <td>Mocked Static Numbers</td>
        <td><strong>Live Yahoo Finance API (BZ=F/CL=F)</strong></td>
      </tr>
      <tr>
        <td><strong>Data Persistence</strong></td>
        <td>Isolated Spreadsheets</td>
        <td>In-Memory Objects</td>
        <td><strong>Supabase PostgreSQL DB via Prisma</strong></td>
      </tr>
      <tr>
        <td><strong>Map Visualization</strong></td>
        <td>Static PDF Maps</td>
        <td>Standard Map Markers</td>
        <td><strong>Uber-Style Animated Flowing Polylines</strong></td>
      </tr>
      <tr>
        <td><strong>Procurement Engine</strong></td>
        <td>Manual Meetings (Days)</td>
        <td>Text Suggestions</td>
        <td><strong>Executable Cape Rerouting & Matching</strong></td>
      </tr>
      <tr>
        <td><strong>Financial Terminal</strong></td>
        <td>None</td>
        <td>Single Line Chart</td>
        <td><strong>Bento-Box Multi-Market 1D/5D/50D Terminal</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- 8. Technical Stack -->
  <h2>8. Technical Stack & Deployment</h2>
  <p>Rampart is built using Next.js 16.2 (Turbopack), Prisma ORM 6.x, Supabase PostgreSQL, Google Gemma 2 LLM via OpenRouter, Yahoo Finance API, Leaflet.js, Recharts, and Tailwind CSS v4.</p>

  <div class="doc-footer">
    <div>Project Rampart — Official ET Hackathon 26 Submission</div>
    <div>Developed by Team FLIQ ODD</div>
  </div>

  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'Inter'
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'submission.html'), htmlContent);
console.log('Generated scratch/submission.html');

async function renderPDF() {
  const puppeteer = require('puppeteer');
  console.log('Launching Puppeteer via Edge...');
  
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = 'file:///' + path.join(__dirname, 'submission.html').replace(/\\/g, '/');
  
  console.log('Navigating to ' + htmlPath);
  await page.goto(htmlPath, { waitUntil: 'networkidle0' });

  // Wait for Mermaid diagram to render SVG
  console.log('Waiting for Mermaid diagram to render...');
  await page.waitForSelector('.mermaid svg', { timeout: 10000 }).catch(() => console.log('Mermaid wait timeout, continuing...'));
  
  // Extra pause to ensure fonts and charts render
  await new Promise(r => setTimeout(r, 2000));

  const pdfPath = path.join(__dirname, '..', 'Project_Rampart_Submission.pdf');
  const artifactPdfPath = 'C:\\Users\\91931\\.gemini\\antigravity-ide\\brain\\01ddf0bd-5160-48ac-acb0-81b47f6b62d9\\Project_Rampart_Submission.pdf';

  console.log('Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '12mm',
      right: '12mm'
    }
  });

  // Copy to artifacts directory as well
  fs.copyFileSync(pdfPath, artifactPdfPath);

  console.log('PDF generated successfully at: ' + pdfPath);
  console.log('Artifact PDF copied to: ' + artifactPdfPath);

  await browser.close();
}

renderPDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
