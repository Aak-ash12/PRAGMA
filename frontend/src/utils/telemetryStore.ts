// Shared Dynamic Telemetry Engine for PRAGMA Enterprise
// Synchronizes randomized district crisis telemetry across LiveMap and Resource Allocation Matrix

export interface DistrictTelemetry {
  id: number;
  name: string;
  lat: number;
  lng: number;
  risk: 'High' | 'Medium' | 'Low';
  crisisCategory: 'disease' | 'water' | 'power' | 'oxygen' | 'flood';
  crisisTitle: string;
  telemetryValue: string;
  solutionTitle: string;
  initialColor: string;
  badgeText: string;
  deployedValue: string;
}

const problemCatalog = [
  {
    category: 'disease' as const,
    title: 'ICU Bed Overload (96% Occupancy)',
    badgeText: 'CRITICAL ICU SURGE',
    color: '#EF4444',
    valGen: () => `Critical (${85 + Math.floor(Math.random() * 12)}% ICU Occupancy)`,
    solutionTitle: 'Deployed +250 ICU Beds & Field Wards',
    deployedValue: 'Mitigated: +250 ICU Beds Deployed (Occupancy dropped to 28%)'
  },
  {
    category: 'water' as const,
    title: 'Water Deficit (75% Supply Shortage)',
    badgeText: 'WATER DEFICIT SURGE',
    color: '#F59E0B',
    valGen: () => `High Risk (${65 + Math.floor(Math.random() * 25)}% Supply Deficit)`,
    solutionTitle: 'Emergency Water Reservoir Outflow (+45%)',
    deployedValue: 'Mitigated: Emergency Water Reservoir Outflow Injected (+45%)'
  },
  {
    category: 'power' as const,
    title: 'Power Grid Strain & Voltage Drop',
    badgeText: 'POWER GRID OVERLOAD',
    color: '#EC4899',
    valGen: () => `Peak Load (${8800 + Math.floor(Math.random() * 1000)} MW | 49.2 Hz)`,
    solutionTitle: '500 MW Hydro Peaking Power Dispatch',
    deployedValue: 'Mitigated: 500 MW Hydro Peaking Power Dispatched (Grid Load 30%)'
  },
  {
    category: 'oxygen' as const,
    title: 'Emergency Bed Surge & O2 Shortage',
    badgeText: 'OXYGEN DEFICIT',
    color: '#8B5CF6',
    valGen: () => `Critical Stock (${15 + Math.floor(Math.random() * 20)}% Reserve Left)`,
    solutionTitle: '60 KL Express Liquid Oxygen Tankers',
    deployedValue: 'Mitigated: Liquid Oxygen Express Tankers Dispatched'
  },
  {
    category: 'flood' as const,
    title: 'Submerged Evacuation Route & Flood Surge',
    badgeText: 'FLOOD ROUTE STRAIN',
    color: '#3B82F6',
    valGen: () => `Water Level (+${(1.5 + Math.random() * 1.5).toFixed(1)}m Inundation)`,
    solutionTitle: 'Storm Drain Pumps Active & Traffic Rerouted',
    deployedValue: 'Mitigated: Storm Drain Pumps Active & Traffic Rerouted'
  }
];

const defaultDistrictLocations = [
  { id: 1, name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { id: 2, name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
  { id: 3, name: 'Madurai', lat: 9.9252, lng: 78.1198 },
  { id: 4, name: 'Salem', lat: 11.6643, lng: 78.1460 },
  { id: 5, name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
  { id: 6, name: 'Tirunelveli', lat: 8.7139, lng: 77.7567 },
  { id: 7, name: 'Vellore', lat: 12.9165, lng: 79.1325 },
  { id: 8, name: 'Erode', lat: 11.3410, lng: 77.7172 }
];

export function getOrGenerateTelemetry(forceRefresh = false): DistrictTelemetry[] {
  if (!forceRefresh) {
    const cached = sessionStorage.getItem('pragma_district_telemetry');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Fallback
      }
    }
  }

  const seed = Math.floor(Math.random() * 5);
  
  const generated: DistrictTelemetry[] = defaultDistrictLocations.map((loc, idx) => {
    if (loc.name === 'Tiruchirappalli' || loc.name === 'Erode') {
      return {
        ...loc,
        risk: 'Low',
        crisisCategory: 'disease',
        crisisTitle: 'Hospital & Grid Capacity Normal',
        telemetryValue: 'Stable (32% Capacity Occupancy)',
        solutionTitle: 'Routine Monitoring & Maintenance',
        initialColor: '#10B981',
        badgeText: 'SAFE (LOW RISK)',
        deployedValue: 'Stable (Capacity Normal)'
      };
    }

    const problemIdx = (idx + seed) % problemCatalog.length;
    const p = problemCatalog[problemIdx];
    const riskLevel: 'High' | 'Medium' = idx % 2 === 0 ? 'High' : 'Medium';

    return {
      ...loc,
      risk: riskLevel,
      crisisCategory: p.category,
      crisisTitle: `${riskLevel} Risk: ${p.title}`,
      telemetryValue: p.valGen(),
      solutionTitle: p.solutionTitle,
      initialColor: p.color,
      badgeText: p.badgeText,
      deployedValue: p.deployedValue
    };
  });

  sessionStorage.setItem('pragma_district_telemetry', JSON.stringify(generated));
  return generated;
}

export function shuffleTelemetry(): DistrictTelemetry[] {
  return getOrGenerateTelemetry(true);
}
