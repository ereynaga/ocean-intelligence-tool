import { useState, useRef, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import svgPaths from "@/imports/CoverArt/svg-ftnfa319gk";

gsap.registerPlugin(ScrollTrigger);

// ─── Types ──────────────────────────────────────────────────────────────────

interface WeatherData {
  tempC: number;
  tempF: number;
  waveHeightM: number;
  windKph: number;
  uvIndex: number;
  visibility: string;
  condition: string;
  humidity: number;
}

interface TurtleData {
  species: string[];
  nestingSeason: string;
  peakMigrationMonths: string;
  beachNestingActive: boolean;
  estimatedNests: number;
  conservationStatus: string;
  watchTips: string[];
  migrationRoute: string;
}

interface WhaleData {
  species: string[];
  season: string;
  peakMonths: string;
  activityLevel: "Low" | "Moderate" | "High" | "Peak";
  bestViewingTime: string;
  tourOperators: number;
  distanceFromShore: string;
  notes: string;
  tips: string[];
}

interface HurricaneData {
  riskLevel: "Low" | "Moderate" | "High" | "Extreme";
  riskScore: number; // 0–100
  season: string;
  peakMonths: string;
  historicalFrequency: string;
  lastMajorEvent: string;
  preparednessRating: string;
  advisoryActive: boolean;
  advisoryNote?: string;
}

interface TravelTip {
  icon: string;
  title: string;
  body: string;
}

interface MoonData {
  phase: string;
  illumination: number;
  tide: string;
  insight: string;
}

interface Location {
  id: string;
  name: string;
  country: string;
  region: string;
  coords: string;
  heroImage: string;
  heroAlt: string;
  description: string;
  weather: WeatherData;
  turtles: TurtleData;
  whales: WhaleData;
  hurricane: HurricaneData;
  moon: MoonData;
  tips: TravelTip[];
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const locations: Location[] = [
  {
    id: "punta-cana",
    name: "Punta Cana",
    country: "Dominican Republic",
    region: "Caribbean",
    coords: "18.5820° N, 68.4063° W",
    heroImage: "/hero-puntacana.png",
    heroAlt: "Aerial view of Punta Cana beach and turquoise Caribbean waters",
    description:
      "Where the Atlantic meets the Caribbean — powder-white palms and some of the richest marine biodiversity in the hemisphere.",
    weather: {
      tempC: 29,
      tempF: 84,
      waveHeightM: 0.8,
      windKph: 18,
      uvIndex: 9,
      visibility: "32 km",
      condition: "Cloudy",
      humidity: 72,
    },
    turtles: {
      species: ["Leatherback", "Loggerhead", "Hawksbill"],
      nestingSeason: "April – October",
      peakMigrationMonths: "June – August",
      beachNestingActive: true,
      estimatedNests: 340,
      conservationStatus: "Protected Zone Active",
      migrationRoute: "North Atlantic → Caribbean Arc",
      watchTips: [
        "Night walks only with licensed naturalist guides",
        "No flash photography near hatchlings",
        "Keep 10m distance from nesting females",
      ],
    },
    whales: {
      species: ["Humpback Whale"],
      season: "January – March",
      peakMonths: "January – February",
      activityLevel: "Peak",
      bestViewingTime: "07:00 – 10:00",
      tourOperators: 14,
      distanceFromShore: "15–40 km (Silver Bank)",
      notes:
        "The Silver Bank, just north of the DR, hosts one of the largest humpback nursing grounds in the Atlantic — up to 3,000 whales annually.",
      tips: [
        "Peak activity is January–February during the breeding/calving window",
        "Morning departures (07:00–10:00) offer the calmest surface conditions",
        "Maintain 100m from mother-calf pairs; approach slowly from the side",
      ],
    },
    hurricane: {
      riskLevel: "High",
      riskScore: 72,
      season: "June – November",
      peakMonths: "August – October",
      historicalFrequency: "~1 direct hit per 10 years",
      lastMajorEvent: "Hurricane Maria, 2017 (Category 4)",
      preparednessRating: "Good",
      advisoryActive: false,
    },
    moon: {
      phase: "Waxing Crescent",
      illumination: 0.18,
      tide: "Neap tide",
      insight: "Darker nights this week are ideal for night snorkeling and turtle patrols; the reef stays calmer during neap tides.",
    },
    tips: [
      {
        icon: "/activity-icons/diving-goggles-icon.png",
        title: "Best Snorkeling Spots",
        body: "Head to Isla Saona or the Catalina Island reef corridor before 9 AM for glassy water and peak fish activity.",
      },
      {
        icon: "/activity-icons/turtle-icon.png",
        title: "Turtle Night Patrol",
        body: "Book a supervised turtle watch at Playa Blanca (June–August). Tour groups are capped at 8 persons.",
      },
      {
        icon: "/activity-icons/sky-icon.png",
        title: "UV & Sun Safety",
        body: "UV Index peaks at 10–11 between 11 AM–2 PM. Reef-safe SPF 50+ is both an ecological and skin requirement.",
      },
      {
        icon: "/activity-icons/taco-icon.png",
        title: "Local Eats",
        body: "Skip resort buffets for roadside longaniza and mangú at Higuey market — the real Dominican breakfast experience.",
      },
      {
        icon: "/activity-icons/tornado-icon.png",
        title: "Storm Season",
        body: "Travel insurance is strongly advised August–October. Monitor the NHC 5-day cone daily if visiting during peak season.",
      },
      {
        icon: "/activity-icons/money-icon.png",
        title: "Currency Tips",
        body: "DOP pesos exchange better at BanReservas ATMs inside the international zone than at hotel desks. Avoid airport kiosks.",
      },
    ],
  },
  {
    id: "cancun",
    name: "Cancún",
    country: "Mexico",
    region: "Caribbean",
    coords: "21.1619° N, 86.8515° W",
    heroImage: "/hero-cancun.png",
    heroAlt: "Aerial view of Cancun beach with turquoise Caribbean water",
    description:
      "Limestone cenotes, coral shelf, and a 1,000 km barrier reef flanking one of the world's most visited coastlines.",
    weather: {
      tempC: 31,
      tempF: 88,
      waveHeightM: 0.6,
      windKph: 14,
      uvIndex: 10,
      visibility: "30 km",
      condition: "Partly Cloudy",
      humidity: 68,
    },
    turtles: {
      species: ["Loggerhead", "Green Turtle", "Hawksbill"],
      nestingSeason: "May – September",
      peakMigrationMonths: "June – July",
      beachNestingActive: true,
      estimatedNests: 520,
      conservationStatus: "CONANP Monitored",
      migrationRoute: "Gulf of Mexico → Yucatán Coast",
      watchTips: [
        "Playa Delfines is a CONANP-protected nesting site",
        "Volunteer programs available through Grupo Tortuguero",
        "No drones over nesting beaches May–September",
      ],
    },
    whales: {
      species: ["Whale Shark (not a whale)"],
      season: "May – September",
      peakMonths: "June – August",
      activityLevel: "High",
      bestViewingTime: "06:30 – 09:00",
      tourOperators: 28,
      distanceFromShore: "10–25 km (Isla Holbox)",
      notes:
        "Holbox and Isla Mujeres host the world's largest whale shark aggregations — sometimes 400+ individuals in a 5 km stretch. Snorkeling only, no scuba.",
      tips: [
        "June–August is the peak aggregation window around Isla Holbox",
        "Early morning trips (06:30–09:00) have the best visibility and fewer boats",
        "Snorkeling only — keep a 3m distance and avoid touching the sharks",
      ],
    },
    hurricane: {
      riskLevel: "High",
      riskScore: 78,
      season: "June – November",
      peakMonths: "September – October",
      historicalFrequency: "~1 major event per 7 years",
      lastMajorEvent: "Hurricane Wilma, 2005 (Category 4)",
      preparednessRating: "Excellent",
      advisoryActive: false,
    },
    moon: {
      phase: "Waning Gibbous",
      illumination: 0.78,
      tide: "Spring tide",
      insight: "Brighter evenings expose more of the reef at night, but spring tides can strengthen drift dives in Cozumel channels.",
    },
    tips: [
      {
        icon: "/activity-icons/cenote-icon.png",
        title: "Cenote Access",
        body: "Cenote Dos Ojos and Cenote Angelita (35 m halocline layer) are a 1.5 hr drive — go early to beat tour buses.",
      },
      {
        icon: "/activity-icons/shark-icon.png",
        title: "Whale Shark Season",
        body: "Book boat permits 2 weeks in advance June–August. Groups are limited to 10 swimmers per shark encounter.",
      },
      {
        icon: "/activity-icons/taco-icon.png",
        title: "Food Scene",
        body: "Mercado 28 for cochinita pibil tacos. Avoid the Hotel Zone's tourist restaurants — local colonia spots are 4× better.",
      },
      {
        icon: "/activity-icons/tornado-icon.png",
        title: "Hurricane Prep",
        body: "Cancún hotels have robust hurricane shelters. Know your hotel's evacuation plan before peak season travel.",
      },
      {
        icon: "/activity-icons/sea-icon.png",
        title: "Mesoamerican Reef",
        body: "Cozumel sits on the world's second-largest barrier reef. The Palancar Caves drift dive is unmissable for advanced divers.",
      },
      {
        icon: "/activity-icons/landscape-icon.png",
        title: "Best Photography",
        body: "Chichén Itzá sunrise photography (6 AM entry) during equinox weeks — March 20 and September 22 — for shadow serpent alignment.",
      },
    ],
  },
  {
    id: "maui",
    name: "Maui",
    country: "United States",
    region: "Pacific",
    coords: "20.7984° N, 156.3319° W",
    heroImage: "/hero-maui.png",
    heroAlt: "Humpback whale breaching in Pacific Ocean near Maui Hawaii",
    description:
      "Valley Isle of volcanic origin — where the North Pacific humpback highway runs directly through Maui Nui Basin.",
    weather: {
      tempC: 27,
      tempF: 81,
      waveHeightM: 1.4,
      windKph: 26,
      uvIndex: 8,
      visibility: "40 km",
      condition: "Heavy Rain",
      humidity: 61,
    },
    turtles: {
      species: ["Green Sea Turtle (Honu)"],
      nestingSeason: "June – August",
      peakMigrationMonths: "May – September",
      beachNestingActive: false,
      estimatedNests: 95,
      conservationStatus: "NOAA NMFS Protected",
      migrationRoute: "French Frigate Shoals → Maui feeding grounds",
      watchTips: [
        "Federal law requires 3m distance from all sea turtles",
        "Honu frequently bask at Hookipa and Turtle Town (Makena)",
        "Never stand between a turtle and the water",
      ],
    },
    whales: {
      species: ["North Pacific Humpback Whale"],
      season: "November – May",
      peakMonths: "January – March",
      activityLevel: "Peak",
      bestViewingTime: "08:00 – 12:00",
      tourOperators: 22,
      distanceFromShore: "1–8 km (Maui Nui Basin)",
      notes:
        "The Hawaiian Islands host the entire North Pacific humpback population (~10,000) from November to May. Maui's Aualoa Channel is one of the densest concentrations on Earth.",
      tips: [
        "January–March is peak humpback season in Maui Nui Basin",
        "Mid-morning (08:00–12:00) is best for breaching displays",
        "Stay 100 yards away; use a 200mm+ lens for close-up photos",
      ],
    },
    hurricane: {
      riskLevel: "Low",
      riskScore: 22,
      season: "June – November",
      peakMonths: "July – September",
      historicalFrequency: "~1 direct hit per 50 years",
      lastMajorEvent: "Hurricane Iniki, Kauai 1992",
      preparednessRating: "Good",
      advisoryActive: false,
    },
    moon: {
      phase: "First Quarter",
      illumination: 0.52,
      tide: "Mid-range",
      insight: "First-quarter skies split the night in half; early evening humpback breaches are easier to spot before moonrise.",
    },
    tips: [
      {
        icon: "/activity-icons/whale-icon.png",
        title: "Whale Watch Hana Side",
        body: "The Hana Highway's Keanae Peninsula offers cliff-top whale watching Dec–April — completely free and often better than boat tours.",
      },
      {
        icon: "/activity-icons/volcano-icon.png",
        title: "Haleakalā Sunrise",
        body: "Reserve NPS permits 60 days in advance. Arrive by 4:30 AM. Temps at 3,055 m summit can drop to 2°C — pack layers.",
      },
      {
        icon: "/activity-icons/turtle-icon.png",
        title: "Turtle Town Snorkel",
        body: "Makena Landing's Turtle Town hosts 30–50 resident green turtles. Morning entry before 8 AM means you'll share the water with very few others.",
      },
      {
        icon: "/activity-icons/surf-icon.png",
        title: "Surf Forecast",
        body: "North Maui swells (Hookipa, Peahi/Jaws) peak December–February. South swells for beginners: Launiupoko and Kihei, May–September.",
      },
      {
        icon: "/activity-icons/cutlery-icon.png",
        title: "Road to Hana Food",
        body: "Pack snacks but stop for Koki Beach banana bread, Wai'anapanapa black sand with lunch, and Grandma's coffee in Kēōkea.",
      },
      {
        icon: "/activity-icons/greeting-icon.png",
        title: "Cultural Respect",
        body: "Many heiau (sacred sites) are closed to visitors. Don't move lava rocks — Hawaiian legend and airport signs both warn against it.",
      },
    ],
  },
  {
    id: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "Indian Ocean",
    coords: "3.2028° N, 73.2207° E",
    heroImage: "/hero-maldives.png",
    heroAlt: "Sea turtle swimming near vibrant coral reef in Maldives",
    description:
      "1,200 islands at sea level — the most threatened archipelago on Earth and the world's most biodiverse reef system.",
    weather: {
      tempC: 30,
      tempF: 86,
      waveHeightM: 0.4,
      windKph: 12,
      uvIndex: 11,
      visibility: "45 km",
      condition: "Clear",
      humidity: 80,
    },
    turtles: {
      species: ["Hawksbill", "Green Turtle"],
      nestingSeason: "March – October",
      peakMigrationMonths: "April – June",
      beachNestingActive: true,
      estimatedNests: 180,
      conservationStatus: "MEPT Monitored",
      migrationRoute: "Lakshadweep Sea → Maldivian Atolls",
      watchTips: [
        "Hawksbill turtles are critically endangered — maintain 5m distance",
        "Night light pollution disrupts nesting — switch off villa beach lighting after 9 PM",
        "Report strandings to the Marine Research Institute: +960 332 3260",
      ],
    },
    whales: {
      species: ["Sperm Whale", "Bryde's Whale", "Blue Whale"],
      season: "January – April",
      peakMonths: "February – March",
      activityLevel: "Moderate",
      bestViewingTime: "06:00 – 09:00",
      tourOperators: 8,
      distanceFromShore: "20–60 km (Equatorial Channel)",
      notes:
        "The Equatorial Channel between North and South Malé Atolls is a deep-water corridor for sperm and blue whales. Sightings are rarer but extraordinary — blue whales are occasionally spotted December–April.",
      tips: [
        "February–March offers the most reliable blue and sperm whale sightings",
        "Sunrise trips (06:00–09:00) are essential before afternoon chop builds",
        "Bring a telephoto lens; these whales surface farther from the boat",
      ],
    },
    hurricane: {
      riskLevel: "Low",
      riskScore: 15,
      season: "May – November (monsoon season)",
      peakMonths: "June – July",
      historicalFrequency: "No recorded direct hurricane hits",
      lastMajorEvent: "2004 Indian Ocean Tsunami (not hurricane-related)",
      preparednessRating: "Moderate",
      advisoryActive: false,
    },
    moon: {
      phase: "New Moon",
      illumination: 0.02,
      tide: "Spring tide",
      insight: "New moon nights are peak time for Vaadhoo's bioluminescence and manta feeding aggregations in Hanifaru Bay.",
    },
    tips: [
      {
        icon: "/activity-icons/diving-goggles-icon.png",
        title: "Reef Snorkeling Windows",
        body: "Calm dry season (Nov–Apr) offers 40–50m visibility. Mask up at local island house reefs at slack tide for least current.",
      },
      {
        icon: "/activity-icons/stars-icon.png",
        title: "Bioluminescence",
        body: "Vaadhoo Island's 'Sea of Stars' bioluminescence (dinoflagellate plankton) is best viewed on moonless nights in summer.",
      },
      {
        icon: "/activity-icons/money-icon.png",
        title: "Budget Reality",
        body: "Overwater bungalows are luxury — stay on a local island (Maafushi, Thulusdhoo) for 1/10th the cost with ferry access to resort atolls.",
      },
      {
        icon: "/activity-icons/sky-icon.png",
        title: "Climate Context",
        body: "The Maldives may be entirely submerged by 2100. Many guests contribute to the Maldives Coral Institute restoration fund during their stay.",
      },
      {
        icon: "/activity-icons/manta-icon.png",
        title: "Manta Ray Season",
        body: "North Malé Atoll's Hanifaru Bay (UNESCO protected) has manta ray feeding aggregations June–November. Access by dhoni with eco-guide.",
      },
      {
        icon: "/activity-icons/together-icon.png",
        title: "Local Island Etiquette",
        body: "Swimwear is restricted to resort islands — carry a sarong for local island visits. Friday prayers pause all ferry services 12–2 PM.",
      },
    ],
  },
  {
    id: "great-barrier",
    name: "Great Barrier Reef",
    country: "Australia",
    region: "Pacific",
    coords: "18.2871° S, 147.6992° E",
    heroImage: "/hero-greatbarrierreef.png",
    heroAlt: "Sea turtle swimming near coral reef in Great Barrier Reef Australia",
    description:
      "3 million km² of living reef — the largest structure built by living organisms and a World Heritage Site under active ecological stress.",
    weather: {
      tempC: 26,
      tempF: 79,
      waveHeightM: 1.1,
      windKph: 22,
      uvIndex: 10,
      visibility: "35 km",
      condition: "Sunny",
      humidity: 74,
    },
    turtles: {
      species: ["Green Turtle", "Loggerhead", "Flatback", "Hawksbill"],
      nestingSeason: "October – February",
      peakMigrationMonths: "November – January",
      beachNestingActive: true,
      estimatedNests: 1200,
      conservationStatus: "GBRMPA Critical Habitat",
      migrationRoute: "Southern Coral Sea → Raine Island rookery",
      watchTips: [
        "Raine Island hosts ~60,000 green turtle nests per season — world's largest",
        "Guided turtle tours depart Mon Repos near Bundaberg Nov–Mar",
        "Flatback turtles are Australian endemic and found nowhere else",
      ],
    },
    whales: {
      species: ["Dwarf Minke Whale", "Humpback Whale"],
      season: "June – September",
      peakMonths: "June – August",
      activityLevel: "High",
      bestViewingTime: "07:00 – 11:00",
      tourOperators: 19,
      distanceFromShore: "5–30 km",
      notes:
        "Dwarf Minke whales (found only on the GBR) are uniquely curious — they approach boats and snorkelers. The Ribbon Reefs are the best encounter zone June–July.",
      tips: [
        "Dwarf Minke encounters peak in June–July along the Ribbon Reefs",
        "Hold the handline and stay still — they often swim within arm's reach",
      ],
    },
    hurricane: {
      riskLevel: "Moderate",
      riskScore: 48,
      season: "November – April (cyclone season)",
      peakMonths: "January – March",
      historicalFrequency: "~2–3 tropical cyclones cross QLD coast per decade",
      lastMajorEvent: "Tropical Cyclone Debbie, 2017 (Category 4)",
      preparednessRating: "Excellent",
      advisoryActive: false,
    },
    moon: {
      phase: "Full Moon",
      illumination: 0.96,
      tide: "Spring tide",
      insight: "Full moon triggers spring tides and is peak green turtle nesting activity; hatchlings often emerge around the new moon for safer passage.",
    },
    tips: [
      {
        icon: "/activity-icons/diving-goggles-icon.png",
        title: "Dive Without a Certification",
        body: "Discover Scuba Dives (1-day intro) from Cairns and Port Douglas take you to 12 m reefs with a master diver — no cert needed.",
      },
      {
        icon: "/activity-icons/coral-icon.png",
        title: "Coral Bleaching Awareness",
        body: "Over 50% of coral has bleached since 2016. Dive operators at the Ribbon Reefs and Osprey Reef offer the healthiest sections.",
      },
      {
        icon: "/activity-icons/jellyfish-icon.png",
        title: "Crocodile & Stinger Season",
        body: "Box jellyfish and Irukandji are deadly Nov–May. Swim only in netted enclosures or in a stinger suit north of Agnes Water.",
      },
      {
        icon: "/activity-icons/airplane-icon.png",
        title: "Gateway Airports",
        body: "Cairns is the main gateway. Fly into Proserpine for Whitsundays. Liveaboard trips from Cairns cover the outer ribbon reefs in 3 days.",
      },
      {
        icon: "/activity-icons/leaves-icon.png",
        title: "Eco-Certification",
        body: "Choose operators with the ECO Certification 'Advanced Eco' logo. Revenue goes directly to GBRMPA reef monitoring programs.",
      },
      {
        icon: "/activity-icons/camera-icon.png",
        title: "Underwater Photography",
        body: "The Cod Hole (Ribbon Reef 10) has resident 1.5 m potato cod that approach divers. GoPro Hero + red filter for sub-15 m shots.",
      },
    ],
  },
];

// ─── Image Loading ────────────────────────────────────────────────────────────

function preloadImage(src: string, timeoutMs = 6000) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const timer = window.setTimeout(resolve, timeoutMs);
    image.onload = () => {
      window.clearTimeout(timer);
      if (typeof image.decode === "function") {
        image.decode().catch(() => undefined).finally(resolve);
      } else {
        resolve();
      }
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      resolve();
    };
    image.src = src;
  });
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

// ─── Imported Weather Icons (CoverArt paths) ─────────────────────────────────

function SunnyIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[6.25%]">
        <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 56.5729 56.5729" preserveAspectRatio="none">
          <path clipRule="evenodd" d={svgPaths.p1b09b00} fill="url(#sun-grad)" fillRule="evenodd" />
          <defs>
            <linearGradient id="sun-grad" x1="28.2864" x2="28.2864" y1="0" y2="56.5729" gradientUnits="userSpaceOnUse">
              <stop stopColor="#EFC977" /><stop offset="1" stopColor="#E07256" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function CloudyIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[6.25%]">
        <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 56.5729 56.5729" preserveAspectRatio="none">
          <path clipRule="evenodd" d={svgPaths.p3c641e00} fill="url(#cloud-grad)" fillRule="evenodd" />
          <defs>
            <linearGradient id="cloud-grad" x1="28.2864" x2="28.2864" y1="0" y2="56.5729" gradientUnits="userSpaceOnUse">
              <stop stopColor="#95B6F6" /><stop offset="1" stopColor="#5193DE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function PartlyCloudyIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[6.25%]">
        <div className="absolute" style={{ left: 0, top: 0, width: "56.573px", height: "44.179px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 56.5729 44.1794" preserveAspectRatio="none">
            <path clipRule="evenodd" d={svgPaths.p5f76c00} fill="url(#pcloud-sun)" fillRule="evenodd" />
            <defs>
              <linearGradient id="pcloud-sun" x1="28.2864" x2="28.2864" y1="0" y2="44.1794" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EFC977" /><stop offset="1" stopColor="#E07256" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute" style={{ left: "4.04px", top: "26.27px", width: "40.409px", height: "30.307px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 40.4092 30.3072" preserveAspectRatio="none">
            <path clipRule="evenodd" d={svgPaths.p9c83100} fill="url(#pcloud-body)" fillRule="evenodd" />
            <defs>
              <linearGradient id="pcloud-body" x1="20.2046" x2="20.2046" y1="0" y2="30.3072" gradientUnits="userSpaceOnUse">
                <stop stopColor="#B2D4F7" /><stop offset="1" stopColor="#D9E2F3" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

function WindIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[21.88%_12.5%_18.75%_12.5%]">
        <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 48.491 38.3889" preserveAspectRatio="none">
          <path clipRule="evenodd" d={svgPaths.p1d163800} fill="url(#wind-grad)" fillRule="evenodd" />
          <defs>
            <linearGradient id="wind-grad" x1="24" x2="24" y1="0" y2="38.3889" gradientUnits="userSpaceOnUse">
              <stop stopColor="#85c8ee" /><stop offset="1" stopColor="#4a9fd4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function WaveIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 3.21772V5.21772H20.5001V3.21772C20.5001 3.21772 20 6.16376 10 1.66376C-1.90735e-05 -2.83624 0 3.21772 0 3.21772Z" fill="url(#paint0_linear_205_583)" />
      <path d="M20.5001 7.21772H0V9.21772H20.5L20.5001 7.21772Z" fill="url(#paint1_linear_205_583)" />
      <path d="M0 11.2177H20.5001V13.2177H0V11.2177Z" fill="url(#paint2_linear_205_583)" />
      <defs>
        <linearGradient id="paint0_linear_205_583" x1="10.25" y1="0" x2="10.25" y2="13.2177" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CED3EA" />
          <stop offset="1" stopColor="#7E83A9" />
        </linearGradient>
        <linearGradient id="paint1_linear_205_583" x1="10.25" y1="0" x2="10.25" y2="13.2177" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CED3EA" />
          <stop offset="1" stopColor="#7E83A9" />
        </linearGradient>
        <linearGradient id="paint2_linear_205_583" x1="10.25" y1="0" x2="10.25" y2="13.2177" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CED3EA" />
          <stop offset="1" stopColor="#7E83A9" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function HumidityIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[12.5%_21.88%]">
        <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 36.3683 48.491" preserveAspectRatio="none">
          <path clipRule="evenodd" d={svgPaths.p35799400} fill="url(#hum-grad)" fillRule="evenodd" />
          <defs>
            <linearGradient id="hum-grad" x1="18" x2="18" y1="0" y2="48.491" gradientUnits="userSpaceOnUse">
              <stop stopColor="#95B6F6" /><stop offset="1" stopColor="#5193DE" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function FogIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[9.38%_6.25%_12.5%_6.25%]">
        <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 56.5727 50.5115" preserveAspectRatio="none">
          <path clipRule="evenodd" d={svgPaths.p16693b00} fill="url(#fog-grad)" fillRule="evenodd" />
          <defs>
            <linearGradient id="fog-grad" x1="28.2864" x2="28.2864" y1="0" y2="50.5115" gradientUnits="userSpaceOnUse">
              <stop stopColor="#85c8ee" /><stop offset="1" stopColor="#4a9fd4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function ThunderstormIcon({ size = 32 }: { size?: number }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <div className="absolute inset-[6.25%_6.25%_9.38%_6.25%]">
        <div className="absolute" style={{ top: "29.19px", left: "20.47px", width: "17.829px", height: "26.549px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 17.8291 26.5492" preserveAspectRatio="none">
            <path clipRule="evenodd" d={svgPaths.p3dca4500} fill="url(#bolt-grad)" fillRule="evenodd" />
            <defs>
              <linearGradient id="bolt-grad" x1="8.91455" x2="8.91455" y1="0" y2="26.5492" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5BD52" /><stop offset="1" stopColor="#F5DA79" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute" style={{ top: 0, left: 0, width: "56.573px", height: "44.45px" }}>
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 56.5729 44.45" preserveAspectRatio="none">
            <path clipRule="evenodd" d={svgPaths.p13e74e80} fill="url(#storm-grad)" fillRule="evenodd" />
            <defs>
              <linearGradient id="storm-grad" x1="28.2864" x2="28.2864" y1="0" y2="44.45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#95B6F6" /><stop offset="1" stopColor="#5193DE" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}

// Render the right weather SVG cover art for a condition string
function ConditionIcon({ condition, className }: { condition: string; className?: string }) {
  const iconMap: Record<string, string> = {
    "partly cloudy": "partly-cloudy",
    sunny: "sunny",
    clear: "clear",
    cloudy: "cloudy",
    "heavy rain": "heavyrain-storm",
    storm: "heavyrain-storm",
  };
  const file = iconMap[condition.toLowerCase()] ?? "partly-cloudy";
  return <img src={`/weather-icons/${file}.svg`} alt={condition} className={className} />;
}

function RiskMeter({ score, level }: { score: number; level: string }) {
  const segments = [
    { label: "Low", color: "#00d4c8", threshold: 25 },
    { label: "Moderate", color: "#f5a623", threshold: 50 },
    { label: "High", color: "#e58a3b", threshold: 75 },
    { label: "Extreme", color: "#e5383b", threshold: 100 },
  ];

  const activeColor =
    score <= 25
      ? "#00d4c8"
      : score <= 50
      ? "#f5a623"
      : score <= 75
      ? "#e58a3b"
      : "#e5383b";

  return (
    <div className="space-y-3">
      <div className="relative h-3 rounded-full overflow-hidden bg-white/5">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, #00d4c8, ${activeColor})`,
          }}
        />
      </div>
      <div className="flex justify-between">
        {segments.map((s) => (
          <span
            key={s.label}
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: s.color, opacity: level === s.label ? 1 : 0.35 }}
          >
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function StormHeatMap({
  season,
  peakMonths,
  score,
}: {
  season: string;
  peakMonths: string;
  score: number;
}) {
  const shortMonths = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
  const fullMonths = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  function parseMonth(s: string) {
    const m = s.match(/[A-Za-z]+/);
    return m ? fullMonths.indexOf(m[0]) : -1;
  }

  function parseRange(range: string) {
    const parts = range.split(/[-–—]/);
    return { start: parseMonth(parts[0] ?? ""), end: parseMonth(parts[1] ?? "") };
  }

  function inRange(i: number, start: number, end: number) {
    if (start === -1 || end === -1) return false;
    if (start <= end) return i >= start && i <= end;
    return i >= start || i <= end;
  }

  function colorFor(value: number) {
    if (value <= 25) return "#00d4c8";
    if (value <= 50) return "#f5a623";
    if (value <= 75) return "#e58a3b";
    return "#e5383b";
  }

  const seasonRange = parseRange(season);
  const peakRange = parseRange(peakMonths);
  const activeColor = colorFor(score);
  const baselineY = 195;
  const left = 8;
  const right = 612;
  const step = (right - left) / 11;
  const points = Array.from({ length: 12 }).map((_, i) => {
    const isPeak = inRange(i, peakRange.start, peakRange.end);
    const isSeason = inRange(i, seasonRange.start, seasonRange.end);
    const value = isPeak ? score : isSeason ? Math.round(score * 0.55) : 0;
    return {
      x: left + i * step,
      y: baselineY - (value / 100) * 190,
      value,
      isPeak,
      isSeason,
    };
  });

  let areaD = `M ${points[0].x} ${points[0].y}`;
  let lineD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    const c = ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
    areaD += c;
    lineD += c;
  }
  const last = points[points.length - 1];
  const first = points[0];
  areaD += ` L ${last.x} ${baselineY} L ${first.x} ${baselineY} Z`;

  return (
    <div className="space-y-2">
      <h3 className="font-mono text-xs uppercase tracking-widest text-ocean-300">
        Monthly Storm Activity
      </h3>
      <svg
        viewBox="0 0 620 250"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="stormAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={activeColor} stopOpacity="0.35" />
            <stop offset="100%" stopColor={activeColor} stopOpacity="0.02" />
          </linearGradient>
          <filter id="stormLineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Baseline axis */}
        <line
          x1={first.x}
          y1={baselineY}
          x2={last.x}
          y2={baselineY}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.5"
        />

        {/* Area fill */}
        <path d={areaD} fill="url(#stormAreaGradient)" stroke="none" />

        {/* Smooth risk curve */}
        <path
          d={lineD}
          fill="none"
          stroke={activeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#stormLineGlow)"
        />

        {/* Monthly markers */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.isPeak ? 4 : 3}
              fill={activeColor}
              stroke={p.isPeak ? "#ffffff" : "none"}
              strokeWidth={1}
            />
            <title>{`${fullMonths[i]}: ${p.isPeak ? "Peak risk" : p.isSeason ? "Active season" : "Typically low"}`}</title>
            <text
              x={p.x}
              y={215}
              fill="#85c8ee"
              fontSize="13"
              fontFamily="monospace"
              textAnchor="middle"
              opacity="0.6"
            >
              {shortMonths[i]}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function MigrationMap({ location }: { location: Location }) {
  const [startName, endName] = location.turtles.migrationRoute
    .split("→")
    .map((s) => s.trim());

  const dotY = 95;
  const labelY = 36;
  const startX = 60;
  const endX = 580;
  const path = `M ${startX} ${dotY} C 200 ${dotY - 45}, 440 ${dotY + 45}, ${endX} ${dotY}`;

  const waypoints = [
    { x: startX, y: dotY, label: startName },
    { x: endX, y: dotY, label: endName },
  ];

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-ocean-800/40 border border-white/5">
      <svg
        viewBox="0 0 640 160"
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="oceanGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#103058" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#030b16" stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a9fd4" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#4a9fd4" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <rect width="640" height="160" fill="url(#oceanGrad)" />

        {/* Ocean wave hints */}
        <path d="M 0 125 Q 40 118 80 125 T 160 125 T 240 125 T 320 125 T 400 125 T 480 125 T 560 125 T 640 125 V 160 H 0 Z" fill="url(#waveGrad)" />
        <path d="M 0 135 Q 40 128 80 135 T 160 135 T 240 135 T 320 135 T 400 135 T 480 135 T 560 135 T 640 135" fill="none" stroke="#4a9fd4" strokeWidth="0.5" opacity="0.12" />
        <path d="M 0 145 Q 50 139 100 145 T 200 145 T 300 145 T 400 145 T 500 145 T 600 145 T 640 145" fill="none" stroke="#4a9fd4" strokeWidth="0.4" opacity="0.08" />

        {/* Grid lines */}
        {[40, 80, 120].map((y) => (
          <line key={y} x1="0" y1={y} x2="640" y2={y} stroke="#4a9fd4" strokeWidth="0.3" opacity="0.06" />
        ))}
        {[80, 160, 240, 320, 400, 480, 560].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="160" stroke="#4a9fd4" strokeWidth="0.3" opacity="0.06" />
        ))}

        {/* Migration route glow and line */}
        <path d={path} fill="none" stroke="#00d4c8" strokeWidth="5" opacity="0.08" filter="url(#glow)" />
        <path d={path} fill="none" stroke="#00d4c8" strokeWidth="1.5" strokeLinecap="round" className="migration-path" />

        {/* Coordinates hint */}
        <text x="320" y="150" fill="#85c8ee" fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.45">
          {location.coords}
        </text>

        {/* Waypoint pins and labels */}
        {waypoints.map((wp, i) => {
          const isStart = i === 0;
          return (
            <g key={i}>
              <circle cx={wp.x} cy={wp.y} r="9" fill="#00d4c8" opacity="0.1" />
              <circle cx={wp.x} cy={wp.y} r="4.5" fill={isStart ? "#00a89e" : "#00d4c8"} opacity="0.9" />
              <line x1={wp.x} y1={wp.y - 6} x2={wp.x} y2={labelY + 12} stroke="#00d4c8" strokeWidth="0.5" opacity="0.4" />
              <rect x={wp.x - 60} y={labelY - 12} width="120" height="16" rx="4" fill="#030b16" opacity="0.65" />
              <text x={wp.x} y={labelY} fill={isStart ? "#c2e5f7" : "#85c8ee"} fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.9">
                {wp.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function ActivityBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Low: "bg-ocean-600 text-ocean-200",
    Moderate: "bg-amber-900/50 text-amber-warn",
    High: "bg-teal-900/40 text-teal-glow",
    Peak: "bg-teal-900/60 text-teal-glow border border-teal-glow/30",
  };
  return (
    <span
      className={`font-mono text-xs px-2.5 py-1 rounded-full uppercase tracking-wider ${colors[level] ?? colors["Moderate"]}`}
    >
      {level}
    </span>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <img
      src="/moon-icon.svg"
      alt="Moon"
      className={`object-contain ${className ?? ""}`}
    />
  );
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────

function LoadingOverlay({ progress, show }: { progress: number; show: boolean }) {
  const percent = Math.round(progress * 100);
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ocean-900 transition-opacity duration-700 ${
        show ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!show}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-teal-glow/20 animate-[ripple_1.8s_ease-out_infinite]" />
          <div className="absolute inset-0 rounded-full border border-teal-glow/30 animate-[ripple_1.8s_ease-out_infinite]" style={{ animationDelay: "0.35s" }} />
          <div className="absolute inset-0 rounded-full border border-teal-glow/40 animate-[ripple_1.8s_ease-out_infinite]" style={{ animationDelay: "0.7s" }} />
          <div className="relative z-10 w-24 h-24 rounded-full glass-nav flex items-center justify-center">
            <img src="/logo.png" alt="Open Ocean" className="h-10 w-auto object-contain" />
          </div>
        </div>
        <div className="mt-8 font-mono text-[10px] uppercase tracking-[0.35em] text-teal-glow">
          Open Ocean
        </div>
        <div className="mt-5 w-48 h-px bg-white/10 overflow-hidden rounded-full">
          <div
            className="h-full bg-teal-glow transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 font-mono text-[10px] text-ocean-300">{percent}%</div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [selectedId, setSelectedId] = useState("great-barrier");
  const [activeTab, setActiveTab] = useState<"turtles" | "whales">("turtles");
  const [tempUnit, setTempUnit] = useState<"C" | "F">("F");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isWhalePlaying, setIsWhalePlaying] = useState(false);
  const [whaleProgress, setWhaleProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");
  const [assetsReady, setAssetsReady] = useState(false);
  const [assetProgress, setAssetProgress] = useState(0);
  const whaleVideoRef = useRef<HTMLVideoElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const scrollRestoreRef = useRef<number | null>(null);
  const location = locations.find((l) => l.id === selectedId)!;

  const handleLocationSelect = (id: string) => {
    scrollRestoreRef.current = window.scrollY;
    setSelectedId(id);
    setDropdownOpen(false);
  };

  const highC = location.weather.tempC + 3;
  const lowC = location.weather.tempC - 4;
  const highF = Math.round(highC * 9 / 5 + 32);
  const lowF = Math.round(lowC * 9 / 5 + 32);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    let raf: number;
    function tick() {
      const v = whaleVideoRef.current;
      if (v && v.duration) setWhaleProgress(v.currentTime / v.duration);
      if (isWhalePlaying) raf = requestAnimationFrame(tick);
    }
    if (isWhalePlaying) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isWhalePlaying]);

  useLayoutEffect(() => {
    const y = scrollRestoreRef.current;
    if (y == null) return;
    scrollRestoreRef.current = null;
    window.scrollTo(0, y);
    requestAnimationFrame(() => window.scrollTo(0, y));
  }, [location.id]);

  useEffect(() => {
    const now = new Date();
    setLastUpdated(
      now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    );
  }, [location.id]);

  useEffect(() => {
    let cancelled = false;
    setAssetProgress(0);

    Promise.all(
      locations.map((item) =>
        preloadImage(item.heroImage).then(() => {
          if (!cancelled) setAssetProgress((value) => value + 1);
        })
      )
    ).then(() => {
      if (!cancelled) setAssetsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (hero) {
        const img = hero.querySelector("img");
        const copy = hero.querySelectorAll("[data-hero-copy] > *");
        gsap.set(img, { opacity: 0, scale: 1.08 });
        gsap.set(copy, { opacity: 0, y: 28 });

        gsap.to(hero.querySelector("[data-hero-parallax]"), {
          yPercent: 15,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
            onRefresh: (self) => self.animation?.progress(self.progress),
          },
        });
        gsap.fromTo(
          hero.querySelector("[data-hero-fade]"),
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "80% top",
              scrub: 0.5,
              onRefresh: (self) => self.animation?.progress(self.progress),
            },
          }
        );
      }

      if (!assetsReady) return;

      if (hero) {
        const img = hero.querySelector("img");
        const copy = hero.querySelectorAll("[data-hero-copy] > *");
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .to(img, { opacity: 1, scale: 1, duration: 1.6, clearProps: "opacity,scale" })
          .to(
            copy,
            { opacity: 1, y: 0, duration: 1, stagger: 0.14, clearProps: "all" },
            0.35
          );
      }

      const sections = gsap.utils.toArray<HTMLElement>(".stagger-item");
      sections.forEach((section) => {
        const dir = section.dataset.dir;
        const items =
          section.dataset.reveal === "children"
            ? (Array.from(section.children) as HTMLElement[])
            : [section];
        const x = dir === "left" ? -40 : dir === "right" ? 40 : 0;
        gsap.set(items, { opacity: 0, x, y: 40, scale: 0.96 });
        gsap.to(items, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
          stagger: { each: 0.09, from: dir === "right" ? "end" : "start" },
          clearProps: "all",
          scrollTrigger: { trigger: section, start: "top 88%", once: true },
        });
      });
    });
    if (assetsReady) ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [location.id, assetsReady]);

  const riskColor =
    location.hurricane.riskLevel === "Low"
      ? "text-teal-glow"
      : location.hurricane.riskLevel === "Moderate"
      ? "text-amber-warn"
      : location.hurricane.riskLevel === "High"
      ? "text-orange-400"
      : "text-red-storm";

  return (
    <div className="min-h-full bg-ocean-900 text-ocean-100">
      <LoadingOverlay progress={assetProgress / locations.length} show={!assetsReady} />

      {/* ── Nav ── */}
      <header className="fixed top-6 inset-x-0 z-50 mx-auto w-[calc(100%-2rem)] max-w-7xl rounded-2xl glass-nav">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="Open Ocean"
              className="h-6 sm:h-8 w-auto object-contain"
            />
            <div>
              <span className="font-display text-base sm:text-lg font-semibold text-ocean-100 tracking-tight">
                Open Ocean
              </span>
            </div>
          </div>

          {/* Location Selector */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 glass-card rounded-lg px-3 sm:px-4 py-2 hover:border-teal-dim/40 transition-colors cursor-pointer group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-ocean-100"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-xs sm:text-sm font-medium text-ocean-100">{location.name}</span>
              <span className="hidden sm:inline text-ocean-300 text-xs">,&nbsp;{location.country}</span>
              <svg
                className={`w-4 h-4 text-ocean-300 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 glass-card rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 z-50">
                {locations.slice().reverse().map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleLocationSelect(loc.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors cursor-pointer ${
                      loc.id === selectedId ? "bg-teal-glow/10 border-l-2 border-teal-glow" : ""
                    }`}
                  >
                    <span className="font-mono text-xs text-teal-dim w-16 flex-shrink-0">{loc.region}</span>
                    <div>
                      <div className="text-sm font-medium text-ocean-100">{loc.name}</div>
                      <div className="text-xs text-ocean-300">{loc.country}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[340px] overflow-hidden bg-ocean-900" aria-busy={!assetsReady}>
        <div className="absolute inset-x-0 top-0 h-[115%]" data-hero-parallax>
          <img
            key={location.id}
            src={location.heroImage}
            alt={location.heroAlt}
            loading="eager"
            decoding="async"
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/30 via-ocean-900/20 to-ocean-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-900/60 via-transparent to-transparent" />
        <div
          className="absolute inset-0 bg-ocean-900 pointer-events-none opacity-0"
          data-hero-fade
        />
        <div className="relative h-full flex flex-col justify-end max-w-7xl mx-auto px-6 pb-2">
          <div className="max-w-xl" data-hero-copy>
            <span className="font-mono text-xs text-teal-glow uppercase tracking-widest mb-2 block">
              {location.region} · {location.coords}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-light text-white leading-tight mb-2 glow-teal">
              {location.name}
            </h1>
            <p className="text-ocean-200 text-sm leading-relaxed max-w-md">
              {location.description}
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8 overflow-x-clip">

        {/* ── Weather Strip ── */}
        <div className="stagger-item flex items-center justify-between mb-2" data-dir="left">
          <div className="font-mono text-[10px] sm:text-xs text-teal-glow uppercase tracking-widest">Current Conditions</div>
          {lastUpdated && (
            <div className="font-mono text-[10px] sm:text-xs text-ocean-300">
              Updated {lastUpdated}
            </div>
          )}
        </div>
        <div className="stagger-item grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" data-reveal="children">
          {/* Temperature & Condition */}
          <div className="glass-card rounded-xl p-4 col-span-2 overflow-hidden relative">
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-28 h-[calc(var(--spacing)*21)] shrink-0 -ml-4">
                <ConditionIcon condition={location.weather.condition} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-[8rem]">
                <div className="font-mono text-sm font-medium text-white">
                  {location.weather.condition}
                </div>
                <div className="font-mono text-2xl font-medium text-white">
                  {tempUnit === "C" ? `${location.weather.tempC}°C` : `${location.weather.tempF}°F`}
                </div>
                <div className="flex items-center gap-3 font-mono text-xs text-ocean-300 mt-1">
                  <span>H {tempUnit === "C" ? `${highC}°C` : `${highF}°F`}</span>
                  <span>·</span>
                  <span>L {tempUnit === "C" ? `${lowC}°C` : `${lowF}°F`}</span>
                </div>
              </div>
              <button
                onClick={() => setTempUnit(tempUnit === "C" ? "F" : "C")}
                className="absolute top-4 right-4 sm:static sm:self-center text-teal-dim hover:text-teal-glow transition-colors cursor-pointer text-xs shrink-0"
              >
                <span className="hidden sm:inline">Switch to </span>°{tempUnit === "C" ? "F" : "C"}
              </button>
            </div>
          </div>

          {/* Wave Height */}
          <div className="glass-card rounded-xl p-4">
            <WaveIcon size={32} />
            <div className="font-mono text-xl font-medium text-white mt-2">
              {location.weather.waveHeightM} m
            </div>
            <div className="text-ocean-300 text-xs mt-0.5">Wave Height</div>
          </div>

          {/* Wind */}
          <div className="glass-card rounded-xl p-4">
            <WindIcon size={32} />
            <div className="font-mono text-xl font-medium text-white mt-2">
              {location.weather.windKph} km/h
            </div>
            <div className="text-ocean-300 text-xs mt-0.5">Wind</div>
          </div>

          {/* UV Index */}
          <div className="glass-card rounded-xl p-4">
            <SunnyIcon size={32} />
            <div className="font-mono text-xl font-medium text-white mt-2">
              {location.weather.uvIndex}
            </div>
            <div className="text-ocean-300 text-xs mt-0.5">UV Index</div>
          </div>

          {/* Humidity */}
          <div className="glass-card rounded-xl p-4">
            <HumidityIcon size={32} />
            <div className="font-mono text-xl font-medium text-white mt-2">
              {location.weather.humidity}%
            </div>
            <div className="text-ocean-300 text-xs mt-0.5">Humidity</div>
          </div>
        </div>

        {/* ── Moon & Tide ── */}
        <div className="stagger-item glass-card rounded-2xl p-6 !mt-3" data-dir="bottom">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-ocean-800/60 flex items-center justify-center text-amber-warn shrink-0">
                <MoonIcon className="w-14 h-14" />
              </div>
              <div>
                <div className="font-display text-lg text-white leading-tight">{location.moon.phase}</div>
                <div className="font-mono text-xs text-ocean-300">
                  {Math.round(location.moon.illumination * 100)}% illuminated
                </div>
              </div>
            </div>
            <div className="md:border-l md:border-white/10 md:pl-6">
              <div className="font-mono text-xs text-teal-glow uppercase tracking-widest mb-1">Why it matters</div>
              <p className="text-ocean-200 text-sm leading-relaxed" style={{ textWrap: "pretty" }}>{location.moon.insight}</p>
            </div>
          </div>
        </div>

        {/* ── Marine Life & Hurricane Grid ── */}
        <div className="stagger-item grid grid-cols-1 lg:grid-cols-3 gap-3" data-reveal="children" data-dir="left">

          {/* Marine Life Panel — takes 2 cols */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/5">
              {(["turtles", "whales"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-4 font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "text-teal-glow border-b-2 border-teal-glow bg-teal-glow/5"
                      : "text-ocean-300 hover:text-ocean-200"
                  }`}
                >
                  {tab === "turtles" ? "Sea Turtle Migration" : "Whale Watching"}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">
              {activeTab === "turtles" ? (
                <>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                      <h2 className="font-display text-2xl text-white font-light">
                        Sea Turtle Migration
                      </h2>
                    </div>
                    {location.turtles.beachNestingActive && (
                      <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-teal-glow/15 text-teal-glow border border-teal-glow/25 pulse-slow">
                        ● Nesting Active
                      </span>
                    )}
                  </div>

                  <MigrationMap location={location} />

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Nesting Season", value: location.turtles.nestingSeason },
                      { label: "Peak Migration", value: location.turtles.peakMigrationMonths },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-ocean-800/40 rounded-xl p-3">
                        <div className="font-mono text-lg font-medium text-teal-glow">{stat.value}</div>
                        <div className="text-ocean-300 text-xs">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-ocean-300 mb-3">
                      Species
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {location.turtles.species.map((s) => (
                        <span
                          key={s}
                          className="bg-ocean-700/60 border border-ocean-600/50 rounded-full px-3 py-1 text-xs text-ocean-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-ocean-300 mb-3">
                      Field Notes
                    </h3>
                    <ul className="space-y-2">
                      {location.turtles.watchTips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm text-ocean-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-teal-glow mt-1 flex-shrink-0"
                          >
                            <path d="M12 5v14" />
                            <path d="m18.065 8.496-12.125 7" />
                            <path d="m5.94 8.504 12.125 7" />
                          </svg>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h2 className="font-display text-2xl text-white font-light">
                      Whale Watching
                    </h2>
                    <p className="font-mono text-xs text-teal-dim mt-1">
                      {location.whales.distanceFromShore} from shore
                    </p>
                  </div>

                  <div className="relative rounded-xl overflow-hidden h-80 bg-ocean-800/40 group cursor-pointer">
                    <video
                      ref={whaleVideoRef}
                      src="/whale-watching-video.mp4"
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      playsInline
                      onPlay={() => setIsWhalePlaying(true)}
                      onPause={() => setIsWhalePlaying(false)}
                      onEnded={() => {
                        const v = whaleVideoRef.current;
                        if (v) {
                          v.currentTime = 0;
                          setWhaleProgress(0);
                        }
                        setIsWhalePlaying(false);
                      }}
                      onClick={() => {
                        const v = whaleVideoRef.current;
                        if (!v) return;
                        if (v.paused) v.play();
                        else v.pause();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const v = whaleVideoRef.current;
                        if (!v) return;
                        if (v.paused) v.play();
                        else v.pause();
                      }}
                      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${
                        isWhalePlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
                      }`}
                      aria-label={isWhalePlaying ? "Pause whale watching video" : "Play whale watching video"}
                    >
                      <div className="w-14 h-14 rounded-full bg-ocean-900/70 border border-white/15 flex items-center justify-center backdrop-blur-sm shadow-lg shadow-black/40 transition-transform group-hover:scale-105">
                        {isWhalePlaying ? (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-white">
                            <rect x="3" y="2" width="4" height="12" rx="1" />
                            <rect x="9" y="2" width="4" height="12" rx="1" />
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-white pl-0.5">
                            <path d="M4 2.5L13 8L4 13.5V2.5Z" />
                          </svg>
                        )}
                      </div>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                      <div
                        className="h-full bg-teal-glow"
                        style={{ width: `${whaleProgress * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Peak Season", value: location.whales.peakMonths },
                      { label: "Best Time", value: location.whales.bestViewingTime },
                      { label: "Activity", value: `${location.whales.activityLevel} Level` },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-ocean-800/40 rounded-xl p-3">
                        <div className="font-mono text-base font-medium text-teal-glow">{stat.value}</div>
                        <div className="text-ocean-300 text-xs">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-ocean-300 mb-3">Species</h3>
                    <div className="flex flex-wrap gap-2">
                      {location.whales.species.map((s) => (
                        <span
                          key={s}
                          className="bg-ocean-700/60 border border-ocean-600/50 rounded-full px-3 py-1 text-xs text-ocean-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-ocean-300 mb-3">Field Notes</h3>
                    <ul className="space-y-2">
                      {location.whales.tips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm text-ocean-200">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-teal-glow mt-1 flex-shrink-0"
                          >
                            <path d="M12 5v14" />
                            <path d="m18.065 8.496-12.125 7" />
                            <path d="m5.94 8.504 12.125 7" />
                          </svg>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Hurricane Risk Panel */}
          <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
            <h2 className="font-display text-xl text-white font-light">Storm Risk</h2>

            <div className="text-center py-4">
              <div className={`font-mono text-6xl font-light ${riskColor}`}>
                {location.hurricane.riskScore}
              </div>
              <div className="font-mono text-xs text-ocean-300 mt-1">Risk Index / 100</div>
            </div>

            <RiskMeter score={location.hurricane.riskScore} level={location.hurricane.riskLevel} />

            <StormHeatMap
              season={location.hurricane.season}
              peakMonths={location.hurricane.peakMonths}
              score={location.hurricane.riskScore}
            />

            {location.hurricane.advisoryActive && (
              <div className="bg-red-storm/15 border border-red-storm/30 rounded-xl px-4 py-3 text-red-storm text-xs font-mono pulse-slow">
                ⚠ ADVISORY ACTIVE
                {location.hurricane.advisoryNote && (
                  <p className="text-red-400 mt-1 normal-case">{location.hurricane.advisoryNote}</p>
                )}
              </div>
            )}

            <div className="space-y-3 text-sm">
              {[
                { label: "Active Season", value: location.hurricane.season },
                { label: "Peak Months", value: location.hurricane.peakMonths },
                { label: "Frequency", value: location.hurricane.historicalFrequency },
                { label: "Last Major Event", value: location.hurricane.lastMajorEvent },
                { label: "Preparedness", value: location.hurricane.preparednessRating },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start gap-2">
                  <span className="text-ocean-300 text-xs flex-shrink-0">{row.label}</span>
                  <span className="text-ocean-200 text-xs text-right">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
              <a
                href="https://www.nhc.noaa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-teal-dim hover:text-teal-glow transition-colors"
              >
                NHC Live Tracking
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* ── Travel Tips ── */}
        <div>
          <div className="stagger-item mb-5" data-dir="left">
            <h2 className="font-display text-2xl text-white font-light">
              Travel Intelligence
            </h2>
          </div>
          <div className="stagger-item grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" data-reveal="children">
            {location.tips.map((tip) => (
              <div
                key={tip.title}
                className="tip-card glass-card rounded-xl p-5"
              >
                {tip.icon.startsWith("/") ? (
                  <span
                    role="img"
                    aria-label={tip.title}
                    className="block w-12 h-12 mb-3 activity-icon activity-icon-teal"
                    style={{ maskImage: `url(${tip.icon})`, WebkitMaskImage: `url(${tip.icon})` }}
                  />
                ) : (
                  <div className="text-2xl mb-3">{tip.icon}</div>
                )}
                <h3 className="font-medium text-white text-sm mb-2">{tip.title}</h3>
                <p className="text-ocean-300 text-sm leading-relaxed" style={{ textWrap: "pretty" }}>{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Seasonal Overview Strip ── */}
        <div className="stagger-item glass-card rounded-2xl p-6" data-dir="right">
          <h2 className="font-display text-xl text-white font-light mb-5">
            Annual Marine Calendar
          </h2>
          <div className="overflow-x-auto pb-1">
            <div className="grid grid-cols-12 gap-1 mb-3 min-w-[360px]">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(
              (month, i) => {
                const isTurtleSeason = (() => {
                  const nestMonths = location.turtles.nestingSeason;
                  const turtleMap: Record<string, number[]> = {
                    "punta-cana": [4, 5, 6, 7, 8, 9, 10],
                    cancun: [5, 6, 7, 8, 9],
                    maui: [6, 7, 8, 9, 10, 11],
                    maldives: [3, 4, 5, 6, 7, 8, 9, 10],
                    "great-barrier": [10, 11, 12, 1, 2],
                  };
                  return (turtleMap[location.id] ?? []).includes(i + 1);
                })();
                const isWhaleSeason = (() => {
                  const whaleMap: Record<string, number[]> = {
                    "punta-cana": [1, 2, 3],
                    cancun: [5, 6, 7, 8, 9],
                    maui: [11, 12, 1, 2, 3, 4, 5],
                    maldives: [1, 2, 3, 4],
                    "great-barrier": [6, 7, 8, 9],
                  };
                  return (whaleMap[location.id] ?? []).includes(i + 1);
                })();
                const isHurricane = (() => {
                  const hurrMap: Record<string, number[]> = {
                    "punta-cana": [6, 7, 8, 9, 10, 11],
                    cancun: [6, 7, 8, 9, 10, 11],
                    maui: [6, 7, 8, 9, 10, 11],
                    maldives: [5, 6, 7, 8, 9, 10, 11],
                    "great-barrier": [11, 12, 1, 2, 3, 4],
                  };
                  return (hurrMap[location.id] ?? []).includes(i + 1);
                })();
                const isCurrentMonth = i + 1 === 9;

                return (
                  <div key={month} className="text-center">
                    <div
                      className={`font-mono text-[10px] sm:text-xs mb-1 uppercase tracking-wider ${
                        isCurrentMonth ? "text-teal-glow font-medium" : "text-ocean-400"
                      }`}
                    >
                      {month}
                    </div>
                    <div className="space-y-0.5">
                      <div
                        className="h-3 rounded-sm"
                        style={{ background: isTurtleSeason ? "rgba(0,212,200,0.7)" : "rgba(255,255,255,0.05)" }}
                        title={isTurtleSeason ? "Turtle Season" : ""}
                      />
                      <div
                        className="h-3 rounded-sm"
                        style={{ background: isWhaleSeason ? "rgba(74,159,212,0.7)" : "rgba(255,255,255,0.05)" }}
                        title={isWhaleSeason ? "Whale Season" : ""}
                      />
                      <div
                        className="h-3 rounded-sm"
                        style={{ background: isHurricane ? "rgba(229,56,59,0.5)" : "rgba(255,255,255,0.05)" }}
                        title={isHurricane ? "Storm Season" : ""}
                      />
                    </div>
                    {isCurrentMonth && (
                      <div className="w-1 h-1 rounded-full bg-teal-glow mx-auto mt-1" />
                    )}
                  </div>
                );
              }
            )}
          </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-2">
            {[
              { color: "bg-teal-glow/70", label: "Turtle Nesting" },
              { color: "bg-ocean-300/70", label: "Whale Season" },
              { color: "bg-red-storm/50", label: "Storm Season" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                <span className="font-mono text-[10px] sm:text-xs text-ocean-300">{item.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-teal-glow" />
              <span className="font-mono text-[10px] sm:text-xs text-ocean-300">Current Month</span>
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-5 px-4 text-center">
        <span
          className="text-xs text-ocean-300"
          style={{ fontFamily: "'Jura', sans-serif", lineHeight: "22px", letterSpacing: "0.4px" }}
        >
          Open Ocean, 2026 · Designed & built by{" "}
          <a
            href="https://www.edgarreynaga.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 whitespace-nowrap"
          >
            Edgar Reynaga
          </a>
        </span>
      </footer>
    </div>
  );
}
