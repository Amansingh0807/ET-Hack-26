// In-memory Database for Project RamPart.
// Persists state across Next.js dev server hot-reloads using global binding.

export interface Supplier {
  id: string;
  name: string;
  region: string;
  crudeGrade: string;
  basePrice: number; // USD per barrel
  available: boolean;
}

export interface Route {
  id: string;
  supplierId: string;
  destinationPort: string;
  transitDays: number;
  chokePoints: string[]; // e.g., ["Hormuz", "Red Sea"]
  geoCoordinates: [number, number][]; // Array of [lat, lng] for drawing path
}

export interface ActiveTanker {
  id: string;
  vesselName: string;
  currentLat: number;
  currentLng: number;
  routeId: string;
  status: "ON_TRACK" | "AT_RISK" | "REROUTED";
  cargoVolume: number; // Barrels of crude
  progress: number; // 0 to 100 percentage along the route
  speedKnots: number;
}

export interface GeopoliticalEvent {
  id: string;
  headline: string;
  source: string;
  affectedZone: "Strait of Hormuz" | "Suez Canal" | "Red Sea" | "None";
  severityScore: number; // 1 to 10
  timestamp: string;
  briefSummary: string;
}

// Initial Mock Seed Data
const initialSuppliers: Supplier[] = [
  { id: "saudi", name: "Saudi Aramco", region: "Saudi Arabia (Ras Tanura)", crudeGrade: "Arab Light (Medium Sour)", basePrice: 75.5, available: true },
  { id: "adnoc", name: "ADNOC", region: "UAE (Ruwais)", crudeGrade: "Murban (Light Sour)", basePrice: 76.8, available: true },
  { id: "rosneft", name: "Rosneft / Urals", region: "Russia (Novorossiysk)", crudeGrade: "Urals (Medium Sour)", basePrice: 68.2, available: true },
  { id: "iraq", name: "Iraq (SOMO)", region: "Iraq (Basra)", crudeGrade: "Basrah Medium", basePrice: 73.1, available: true },
  { id: "petrobras", name: "Petrobras", region: "Brazil (Santos)", crudeGrade: "Lula (Light Sweet)", basePrice: 79.4, available: true },
  { id: "wti", name: "US Gulf Coast (Chevron)", region: "USA (Houston)", crudeGrade: "WTI (Light Sweet)", basePrice: 81.2, available: true },
  { id: "nnpc", name: "Nigeria (NNPC)", region: "Nigeria (Bonny)", crudeGrade: "Bonny Light (Sweet)", basePrice: 78.0, available: true }
];

const initialRoutes: Route[] = [
  {
    id: "route-saudi",
    supplierId: "saudi",
    destinationPort: "Mumbai Port",
    transitDays: 6,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: [
      [26.7, 50.2], // Ras Tanura
      [26.56, 56.25], // Strait of Hormuz
      [24.0, 59.0], // Gulf of Oman
      [21.0, 65.0], // Arabian Sea
      [19.0, 72.8] // Mumbai
    ]
  },
  {
    id: "route-adnoc",
    supplierId: "adnoc",
    destinationPort: "Kochi Port",
    transitDays: 5,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: [
      [24.4, 54.3], // Ruwais/Abu Dhabi
      [26.56, 56.25], // Strait of Hormuz
      [24.0, 59.0], // Gulf of Oman
      [16.0, 68.0], // Arabian Sea
      [9.97, 76.22] // Kochi
    ]
  },
  {
    id: "route-rosneft",
    supplierId: "rosneft",
    destinationPort: "Vadinar Port",
    transitDays: 16,
    chokePoints: ["Suez Canal", "Red Sea"],
    geoCoordinates: [
      [44.7, 37.8], // Novorossiysk (Black Sea)
      [39.0, 25.0], // Aegean Sea
      [32.5, 32.0], // Mediterranean Sea
      [29.9, 32.5], // Suez Canal
      [20.0, 39.0], // Red Sea
      [12.6, 43.3], // Bab-el-Mandeb
      [11.5, 48.0], // Gulf of Aden
      [15.0, 60.0], // Arabian Sea
      [22.44, 69.72] // Vadinar (Gujarat)
    ]
  },
  {
    id: "route-iraq",
    supplierId: "iraq",
    destinationPort: "Paradeep Port",
    transitDays: 11,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: [
      [29.9, 48.6], // Basra Oil Terminal
      [26.56, 56.25], // Strait of Hormuz
      [24.0, 59.0], // Gulf of Oman
      [12.0, 65.0], // Arabian Sea
      [5.5, 78.0], // Southern tip of India
      [12.0, 84.0], // Bay of Bengal
      [20.26, 86.67] // Paradeep
    ]
  },
  // Alternative routes bypassing chokepoints
  {
    id: "route-rosneft-cape",
    supplierId: "rosneft",
    destinationPort: "Vadinar Port",
    transitDays: 32, // Bypasses Suez/Red Sea (+16 days)
    chokePoints: [],
    geoCoordinates: [
      [44.7, 37.8], // Novorossiysk
      [36.0, 15.0], // Mediterranean
      [35.9, -5.6], // Strait of Gibraltar
      [20.0, -20.0], // Mid-Atlantic
      [-5.0, -10.0], // South Atlantic
      [-34.35, 18.47], // Cape of Good Hope
      [-25.0, 45.0], // Southern Indian Ocean
      [-5.0, 65.0], // Equator
      [12.0, 68.0], // Arabian Sea
      [22.44, 69.72] // Vadinar
    ]
  },
  {
    id: "route-petrobras",
    supplierId: "petrobras",
    destinationPort: "Mumbai Port",
    transitDays: 24,
    chokePoints: [],
    geoCoordinates: [
      [-23.9, -46.3], // Santos Port (Brazil)
      [-30.0, -20.0], // South Atlantic
      [-34.35, 18.47], // Cape of Good Hope
      [-20.0, 40.0], // Mozambique Channel
      [-5.0, 55.0], // Indian Ocean
      [10.0, 68.0], // Arabian Sea
      [19.0, 72.8] // Mumbai
    ]
  },
  {
    id: "route-wti",
    supplierId: "wti",
    destinationPort: "Kochi Port",
    transitDays: 28,
    chokePoints: [],
    geoCoordinates: [
      [29.7, -95.3], // Houston (USA)
      [25.0, -50.0], // North Atlantic
      [-10.0, -25.0], // South Atlantic
      [-34.35, 18.47], // Cape of Good Hope
      [-15.0, 50.0], // Indian Ocean
      [5.0, 68.0], // Arabian Sea
      [9.97, 76.22] // Kochi
    ]
  },
  {
    id: "route-nnpc",
    supplierId: "nnpc",
    destinationPort: "Kochi Port",
    transitDays: 18,
    chokePoints: [],
    geoCoordinates: [
      [4.4, 7.2], // Bonny (Nigeria)
      [-1.0, 5.0], // Gulf of Guinea
      [-20.0, 10.0], // Atlantic
      [-34.35, 18.47], // Cape of Good Hope
      [-20.0, 45.0], // Indian Ocean
      [9.97, 76.22] // Kochi
    ]
  }
];

const initialTankers: ActiveTanker[] = [
  {
    id: "tanker-hormuz-pioneer",
    vesselName: "Hormuz Pioneer (VLCC)",
    currentLat: 25.1,
    currentLng: 57.8,
    routeId: "route-saudi",
    status: "ON_TRACK",
    cargoVolume: 1500000,
    progress: 35,
    speedKnots: 14.5
  },
  {
    id: "tanker-suez-monarch",
    vesselName: "Suez Monarch (Suezmax)",
    currentLat: 22.5,
    currentLng: 38.2,
    routeId: "route-rosneft",
    status: "ON_TRACK",
    cargoVolume: 2000000,
    progress: 45,
    speedKnots: 13.0
  },
  {
    id: "tanker-mesopotamia-star",
    vesselName: "Mesopotamia Star (VLCC)",
    currentLat: 28.5,
    currentLng: 50.8,
    routeId: "route-iraq",
    status: "ON_TRACK",
    cargoVolume: 1800000,
    progress: 5,
    speedKnots: 15.0
  },
  {
    id: "tanker-atlantic-endeavour",
    vesselName: "Atlantic Endeavour (Suezmax)",
    currentLat: -32.5,
    currentLng: 14.2,
    routeId: "route-petrobras",
    status: "ON_TRACK",
    cargoVolume: 1200000,
    progress: 30,
    speedKnots: 13.8
  }
];

const initialEvents: GeopoliticalEvent[] = [
  {
    id: "event-0",
    headline: "Normal Operations",
    source: "Rampart Intel",
    affectedZone: "None",
    severityScore: 1,
    timestamp: new Date().toISOString(),
    briefSummary: "All corridors report stable transit times. Insurance premiums are at baseline levels."
  }
];

// Helper to interpolate tanker positions on Leaflet Map based on route coordinates and progress %
export function getPositionAlongPath(coords: [number, number][], progressPercent: number): [number, number] {
  if (coords.length === 0) return [0, 0];
  if (coords.length === 1) return coords[0];
  if (progressPercent <= 0) return coords[0];
  if (progressPercent >= 100) return coords[coords.length - 1];

  const totalSegments = coords.length - 1;
  const rawProgress = (progressPercent / 100) * totalSegments;
  const segmentIndex = Math.floor(rawProgress);
  const remainder = rawProgress - segmentIndex;

  const start = coords[segmentIndex];
  const end = coords[segmentIndex + 1];

  const lat = start[0] + (end[0] - start[0]) * remainder;
  const lng = start[1] + (end[1] - start[1]) * remainder;

  return [lat, lng];
}

class InMemoryDb {
  private state = {
    suppliers: JSON.parse(JSON.stringify(initialSuppliers)) as Supplier[],
    routes: JSON.parse(JSON.stringify(initialRoutes)) as Route[],
    tankers: JSON.parse(JSON.stringify(initialTankers)) as ActiveTanker[],
    events: JSON.parse(JSON.stringify(initialEvents)) as GeopoliticalEvent[]
  };

  getSuppliers() {
    return this.state.suppliers;
  }

  getRoutes() {
    return this.state.routes;
  }

  getTankers() {
    // Dynamically update coordinate based on progress
    return this.state.tankers.map(tanker => {
      const route = this.state.routes.find(r => r.id === tanker.routeId);
      if (route) {
        const [lat, lng] = getPositionAlongPath(route.geoCoordinates, tanker.progress);
        return {
          ...tanker,
          currentLat: lat,
          currentLng: lng
        };
      }
      return tanker;
    });
  }

  getEvents() {
    return this.state.events;
  }

  addEvent(event: Omit<GeopoliticalEvent, "id" | "timestamp">) {
    const newEvent: GeopoliticalEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    this.state.events.unshift(newEvent); // Add to beginning

    // Automatically trigger updates on tankers
    this.updateTankerStatusForZone(event.affectedZone, event.severityScore);

    return newEvent;
  }

  updateTankerStatusForZone(zone: string, severity: number) {
    this.state.tankers = this.state.tankers.map(tanker => {
      const route = this.state.routes.find(r => r.id === tanker.routeId);
      if (!route) return tanker;

      // If the route passes through the affected zone
      const matchesZone = route.chokePoints.some(cp => cp.toLowerCase() === zone.toLowerCase());

      if (matchesZone) {
        if (severity >= 5) {
          return { ...tanker, status: "AT_RISK" };
        }
      }
      return tanker;
    });
  }

  rerouteTanker(tankerId: string, newRouteId: string) {
    this.state.tankers = this.state.tankers.map(tanker => {
      if (tanker.id === tankerId) {
        return {
          ...tanker,
          routeId: newRouteId,
          status: "REROUTED",
          // Reset progress slightly to account for turnaround detour
          progress: Math.max(10, tanker.progress - 5)
        };
      }
      return tanker;
    });
  }

  reset() {
    this.state = {
      suppliers: JSON.parse(JSON.stringify(initialSuppliers)) as Supplier[],
      routes: JSON.parse(JSON.stringify(initialRoutes)) as Route[],
      tankers: JSON.parse(JSON.stringify(initialTankers)) as ActiveTanker[],
      events: JSON.parse(JSON.stringify(initialEvents)) as GeopoliticalEvent[]
    };
  }
}

// Global binding for Dev Server persistence
const globalForDb = global as unknown as {
  dbInstance: InMemoryDb;
};

export const dbInstance = globalForDb.dbInstance || new InMemoryDb();

if (process.env.NODE_ENV !== "production") {
  globalForDb.dbInstance = dbInstance;
}
