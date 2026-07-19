import { PrismaClient } from '@prisma/client'
export type { Supplier, Route, ActiveTanker, GeopoliticalEvent } from '@prisma/client'

// Global binding for Dev Server persistence
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const initialSuppliers = [
  { id: "saudi", name: "Saudi Aramco", region: "Saudi Arabia (Ras Tanura)", crudeGrade: "Arab Light (Medium Sour)", basePrice: 75.5, available: true },
  { id: "adnoc", name: "ADNOC", region: "UAE (Ruwais)", crudeGrade: "Murban (Light Sour)", basePrice: 76.8, available: true },
  { id: "rosneft", name: "Rosneft / Urals", region: "Russia (Novorossiysk)", crudeGrade: "Urals (Medium Sour)", basePrice: 68.2, available: true },
  { id: "iraq", name: "Iraq (SOMO)", region: "Iraq (Basra)", crudeGrade: "Basrah Medium", basePrice: 73.1, available: true },
  { id: "petrobras", name: "Petrobras", region: "Brazil (Santos)", crudeGrade: "Lula (Light Sweet)", basePrice: 79.4, available: true },
  { id: "wti", name: "US Gulf Coast (Chevron)", region: "USA (Houston)", crudeGrade: "WTI (Light Sweet)", basePrice: 81.2, available: true },
  { id: "nnpc", name: "Nigeria (NNPC)", region: "Nigeria (Bonny)", crudeGrade: "Bonny Light (Sweet)", basePrice: 78.0, available: true }
];

const initialRoutes = [
  {
    id: "route-saudi",
    supplierId: "saudi",
    destinationPort: "Mumbai Port",
    transitDays: 6,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: JSON.stringify([
      [26.7, 50.2], [26.56, 56.25], [24.0, 59.0], [21.0, 65.0], [19.0, 72.8]
    ])
  },
  {
    id: "route-adnoc",
    supplierId: "adnoc",
    destinationPort: "Kochi Port",
    transitDays: 5,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: JSON.stringify([
      [24.4, 54.3], [26.56, 56.25], [24.0, 59.0], [16.0, 68.0], [9.97, 76.22]
    ])
  },
  {
    id: "route-rosneft",
    supplierId: "rosneft",
    destinationPort: "Vadinar Port",
    transitDays: 16,
    chokePoints: ["Suez Canal", "Red Sea"],
    geoCoordinates: JSON.stringify([
      [44.7, 37.8], [39.0, 25.0], [32.5, 32.0], [29.9, 32.5], [20.0, 39.0],
      [12.6, 43.3], [11.5, 48.0], [15.0, 60.0], [22.44, 69.72]
    ])
  },
  {
    id: "route-iraq",
    supplierId: "iraq",
    destinationPort: "Paradeep Port",
    transitDays: 11,
    chokePoints: ["Strait of Hormuz"],
    geoCoordinates: JSON.stringify([
      [29.9, 48.6], [26.56, 56.25], [24.0, 59.0], [12.0, 65.0],
      [5.5, 78.0], [12.0, 84.0], [20.26, 86.67]
    ])
  },
  {
    id: "route-rosneft-cape",
    supplierId: "rosneft",
    destinationPort: "Vadinar Port",
    transitDays: 32,
    chokePoints: [],
    geoCoordinates: JSON.stringify([
      [44.7, 37.8], [36.0, 15.0], [35.9, -5.6], [20.0, -20.0], [-5.0, -10.0],
      [-34.35, 18.47], [-25.0, 45.0], [-5.0, 65.0], [12.0, 68.0], [22.44, 69.72]
    ])
  },
  {
    id: "route-petrobras",
    supplierId: "petrobras",
    destinationPort: "Mumbai Port",
    transitDays: 24,
    chokePoints: [],
    geoCoordinates: JSON.stringify([
      [-23.9, -46.3], [-30.0, -20.0], [-34.35, 18.47], [-20.0, 40.0],
      [-5.0, 55.0], [10.0, 68.0], [19.0, 72.8]
    ])
  }
];

const initialTankers = [
  { id: "tanker-hormuz-pioneer", vesselName: "Hormuz Pioneer (VLCC)", currentLat: 25.1, currentLng: 57.8, routeId: "route-saudi", status: "ON_TRACK", cargoVolume: 1500000, progress: 35, speedKnots: 14.5 },
  { id: "tanker-suez-monarch", vesselName: "Suez Monarch (Suezmax)", currentLat: 22.5, currentLng: 38.2, routeId: "route-rosneft", status: "ON_TRACK", cargoVolume: 2000000, progress: 45, speedKnots: 13.0 },
  { id: "tanker-mesopotamia-star", vesselName: "Mesopotamia Star (VLCC)", currentLat: 28.5, currentLng: 50.8, routeId: "route-iraq", status: "ON_TRACK", cargoVolume: 1800000, progress: 5, speedKnots: 15.0 }
];

const initialEvent = {
  id: "event-0",
  headline: "Normal Operations",
  source: "Rampart Intel",
  affectedZone: "None",
  severityScore: 1,
  briefSummary: "All corridors report stable transit times."
};

export async function seedDatabase() {
  const count = await prisma.supplier.count();
  if (count > 0) return; 

  for (const s of initialSuppliers) {
    await prisma.supplier.create({ data: s });
  }

  for (const r of initialRoutes) {
    await prisma.route.create({ 
      data: { ...r, geoCoordinates: JSON.parse(r.geoCoordinates) }
    });
  }

  for (const t of initialTankers) {
    await prisma.activeTanker.create({ data: t });
  }

  // Delete first to avoid constraint conflicts if any rows somehow remained
  await prisma.geopoliticalEvent.deleteMany({ where: { id: "event-0" } });
  await prisma.geopoliticalEvent.create({ data: initialEvent });
}

export function getPositionAlongPath(coords: [number, number][], progressPercent: number): [number, number] {
  if (!coords || !Array.isArray(coords) || coords.length === 0) return [0, 0];
  
  // Safe default for NaN or invalid progress
  let progress = progressPercent;
  if (isNaN(progress) || progress === null || progress === undefined) {
    progress = 0;
  }
  
  if (coords.length === 1) return coords[0];
  if (progress <= 0) return coords[0];
  if (progress >= 100) return coords[coords.length - 1];

  const totalSegments = coords.length - 1;
  const rawProgress = (progress / 100) * totalSegments;
  if (isNaN(rawProgress)) return coords[0];

  const segmentIndex = Math.floor(rawProgress);
  const remainder = rawProgress - segmentIndex;

  const start = coords[segmentIndex];
  const end = coords[segmentIndex + 1];

  if (!start || !end) return coords[0];

  const lat = start[0] + (end[0] - start[0]) * remainder;
  const lng = start[1] + (end[1] - start[1]) * remainder;

  if (isNaN(lat) || isNaN(lng)) return coords[0];

  return [lat, lng];
}

export async function getTankers() {
  const tankers = await prisma.activeTanker.findMany({ include: { route: true } });
  return tankers.map(tanker => {
    const coords = tanker.route.geoCoordinates as any;
    if (Array.isArray(coords)) {
      const [lat, lng] = getPositionAlongPath(coords, tanker.progress);
      return { ...tanker, currentLat: lat, currentLng: lng, route: undefined };
    }
    return tanker;
  });
}

export async function getEvents() {
  return await prisma.geopoliticalEvent.findMany({
    orderBy: { timestamp: 'desc' }
  });
}

export async function getRoutes() {
  const routes = await prisma.route.findMany();
  return routes.map(r => ({ ...r, geoCoordinates: r.geoCoordinates as any }));
}

export async function getSuppliers() {
  return await prisma.supplier.findMany();
}

export async function addEvent(event: any) {
  const newEvent = await prisma.geopoliticalEvent.create({
    data: { ...event, id: `event-${Date.now()}` }
  });
  await updateTankerStatusForZone(event.affectedZone, event.severityScore);
  return newEvent;
}

export async function updateTankerStatusForZone(zone: string, severity: number) {
  if (severity < 5) return;
  const routes = await prisma.route.findMany();
  const affectedRouteIds = routes
    .filter(r => r.chokePoints.some(cp => cp.toLowerCase() === zone.toLowerCase()))
    .map(r => r.id);

  if (affectedRouteIds.length > 0) {
    await prisma.activeTanker.updateMany({
      where: { routeId: { in: affectedRouteIds } },
      data: { status: "AT_RISK" }
    });
  }
}

export async function rerouteTanker(tankerId: string, newRouteId: string) {
  const tanker = await prisma.activeTanker.findUnique({ where: { id: tankerId } });
  if (!tanker) return;

  await prisma.activeTanker.update({
    where: { id: tankerId },
    data: {
      routeId: newRouteId,
      status: "REROUTED",
      progress: Math.max(10, tanker.progress - 5)
    }
  });
}

export async function resetDb() {
  await prisma.geopoliticalEvent.deleteMany({});
  await prisma.activeTanker.deleteMany({});
  await prisma.route.deleteMany({});
  await prisma.supplier.deleteMany({});
  await seedDatabase();
}
