import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import reactLogo from './assets/react.svg';

const MOCK_MARKETS = [
  { name: "Agro Market A", distance: "5 km", category: "Vegetables", link: "#" },
  { name: "Green Valley Market", distance: "12 km", category: "Grains", link: "#" },
  { name: "Farmers' Hub", distance: "20 km", category: "Fruits", link: "#" },
  { name: "City Mandi", distance: "8 km", category: "Vegetables", link: "#" },
  { name: "Village Bazaar", distance: "15 km", category: "Grains", link: "#" },
];
const MOCK_PRICES: { [key: string]: { min: number; max: number; period: string } } = {
  wheat: { min: 1800, max: 2200, period: "March - April" },
  rice: { min: 1500, max: 2000, period: "October - November" },
  maize: { min: 1200, max: 1700, period: "September - October" },
};

// All States and Union Territories of India
const INDIAN_STATES = [
  { id: "AP", name: "Andhra Pradesh" },
  { id: "AR", name: "Arunachal Pradesh" },
  { id: "AS", name: "Assam" },
  { id: "BR", name: "Bihar" },
  { id: "CT", name: "Chhattisgarh" },
  { id: "GA", name: "Goa" },
  { id: "GJ", name: "Gujarat" },
  { id: "HR", name: "Haryana" },
  { id: "HP", name: "Himachal Pradesh" },
  { id: "JH", name: "Jharkhand" },
  { id: "KA", name: "Karnataka" },
  { id: "KL", name: "Kerala" },
  { id: "MP", name: "Madhya Pradesh" },
  { id: "MH", name: "Maharashtra" },
  { id: "MN", name: "Manipur" },
  { id: "ML", name: "Meghalaya" },
  { id: "MZ", name: "Mizoram" },
  { id: "NL", name: "Nagaland" },
  { id: "OR", name: "Odisha" },
  { id: "PB", name: "Punjab" },
  { id: "RJ", name: "Rajasthan" },
  { id: "SK", name: "Sikkim" },
  { id: "TN", name: "Tamil Nadu" },
  { id: "TG", name: "Telangana" },
  { id: "TR", name: "Tripura" },
  { id: "UP", name: "Uttar Pradesh" },
  { id: "UT", name: "Uttarakhand" },
  { id: "WB", name: "West Bengal" },
  // Union Territories
  { id: "AN", name: "Andaman and Nicobar Islands" },
  { id: "CH", name: "Chandigarh" },
  { id: "DN", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { id: "DL", name: "Delhi" },
  { id: "JK", name: "Jammu and Kashmir" },
  { id: "LA", name: "Ladakh" },
  { id: "LD", name: "Lakshadweep" },
  { id: "PY", name: "Puducherry" }
];

// Equipment Data
const equipmentList = [
  {
    name: "Tractor",
    icon: "🚜",
    category: "Machinery",
    priceRange: "₹3,00,000 - ₹10,00,000",
    features: [
      "20-60 HP engine options",
      "4WD/2WD variants",
      "Hydraulic lift, PTO, and drawbar",
      "Fuel efficient, easy maintenance"
    ],
    suitableFor: ["Land preparation", "Sowing", "Transport"],
    maintenance: "Regular oil changes, filter cleaning, and timely servicing."
  },
  {
    name: "Rotavator",
    icon: "🪓",
    category: "Implement",
    priceRange: "₹60,000 - ₹1,50,000",
    features: [
      "Efficient soil pulverization",
      "Reduces weed growth",
      "Saves time and labor"
    ],
    suitableFor: ["Seedbed preparation", "Weed control"],
    maintenance: "Check blades for wear, lubricate moving parts."
  },
  {
    name: "Seed Drill",
    icon: "🌱",
    category: "Implement",
    priceRange: "₹40,000 - ₹1,20,000",
    features: [
      "Uniform seed placement",
      "Reduces seed wastage",
      "Improves germination rates"
    ],
    suitableFor: ["Sowing wheat, rice, pulses, oilseeds"],
    maintenance: "Clean after use, check for blockages."
  },
  {
    name: "Sprinkler Irrigation System",
    icon: "💧",
    category: "Irrigation",
    priceRange: "₹25,000 - ₹1,00,000 per acre",
    features: [
      "Uniform water distribution",
      "Reduces water usage",
      "Suitable for most crops"
    ],
    suitableFor: ["Vegetables", "Cereals", "Pulses"],
    maintenance: "Check for leaks, clean nozzles regularly."
  },
  {
    name: "Drip Irrigation System",
    icon: "💦",
    category: "Irrigation",
    priceRange: "₹35,000 - ₹1,20,000 per acre",
    features: [
      "Targeted water delivery",
      "Reduces evaporation loss",
      "Ideal for row crops, fruits"
    ],
    suitableFor: ["Fruits", "Vegetables", "Flowers"],
    maintenance: "Flush lines, check emitters for clogging."
  },
  {
    name: "Combine Harvester",
    icon: "🚜",
    category: "Machinery",
    priceRange: "₹15,00,000 - ₹30,00,000",
    features: [
      "Harvests, threshes, and cleans in one pass",
      "Saves labor and time",
      "Reduces grain loss"
    ],
    suitableFor: ["Wheat", "Rice", "Maize"],
    maintenance: "Clean after use, check belts and blades."
  },
  {
    name: "Cold Storage Unit",
    icon: "❄️",
    category: "Storage",
    priceRange: "₹2,00,000 - ₹10,00,000",
    features: [
      "Preserves produce freshness",
      "Reduces post-harvest losses",
      "Essential for perishable crops"
    ],
    suitableFor: ["Fruits", "Vegetables", "Flowers"],
    maintenance: "Monitor temperature, regular servicing."
  },
  {
    name: "Power Tiller",
    icon: "🛠️",
    category: "Machinery",
    priceRange: "₹1,00,000 - ₹2,50,000",
    features: [
      "Compact and versatile",
      "Ideal for small farms",
      "Multiple attachments available"
    ],
    suitableFor: ["Land preparation", "Inter-cultivation"],
    maintenance: "Check oil, tighten bolts, clean after use."
  }
];

// Irrigation Types Data
const irrigationTypes = [
  {
    name: "Drip Irrigation",
    icon: "💧",
    cost: "₹35,000 - ₹1,20,000 per acre",
    advantages: [
      "Highly water-efficient (saves 30-60%)",
      "Reduces weed growth",
      "Minimizes evaporation loss",
      "Improves yield and quality"
    ],
    disadvantages: [
      "High initial investment",
      "Requires regular maintenance (clogging risk)",
      "Not ideal for all soil types"
    ],
    suitableCrops: ["Fruits", "Vegetables", "Flowers", "Sugarcane"],
    notes: "Best for row crops and orchards. Government subsidies often available."
  },
  {
    name: "Sprinkler Irrigation",
    icon: "🌦️",
    cost: "₹25,000 - ₹1,00,000 per acre",
    advantages: [
      "Uniform water distribution",
      "Suitable for undulating land",
      "Reduces labor requirement",
      "Can be automated"
    ],
    disadvantages: [
      "Water loss due to wind/evaporation",
      "Not ideal for all crops (e.g., some cereals)",
      "Nozzle clogging risk"
    ],
    suitableCrops: ["Wheat", "Pulses", "Vegetables", "Fodder"],
    notes: "Works well for most field crops and lawns."
  },
  {
    name: "Surface/Furrow Irrigation",
    icon: "🌊",
    cost: "₹5,000 - ₹15,000 per acre",
    advantages: [
      "Low initial cost",
      "Simple to operate",
      "No special equipment needed"
    ],
    disadvantages: [
      "High water loss (runoff, evaporation)",
      "Uneven distribution possible",
      "Labor intensive"
    ],
    suitableCrops: ["Rice", "Wheat", "Maize", "Sugarcane"],
    notes: "Traditional method, best for heavy soils and leveled fields."
  },
  {
    name: "Subsurface Irrigation",
    icon: "🕳️",
    cost: "₹60,000 - ₹2,00,000 per acre",
    advantages: [
      "Very efficient water use",
      "Reduces disease risk",
      "No surface evaporation"
    ],
    disadvantages: [
      "Very high installation cost",
      "Difficult to monitor and repair",
      "Not suitable for all soils"
    ],
    suitableCrops: ["Vegetables", "Fruits", "Flowers"],
    notes: "Used in high-value horticulture and research."
  }
];

// Government Schemes Data
const governmentSchemes = [
  {
    name: "PM-KISAN",
    icon: "💰",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    description: "Direct income support of ₹6,000 per year to eligible farmer families",
    benefits: [
      "₹6,000 per year in 3 equal installments",
      "Direct bank transfer",
      "No middlemen involved",
      "Covers all farming families"
    ],
    eligibility: [
      "Small and marginal farmers",
      "Landholding up to 2 hectares",
      "Valid bank account",
      "Aadhaar linked"
    ],
    applicationProcess: "Apply through Common Service Centers (CSC) or online portal",
    website: "pmkisan.gov.in",
    status: "Active"
  },
  {
    name: "PMFBY",
    icon: "🛡️",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    description: "Comprehensive crop insurance scheme to protect farmers against natural calamities",
    benefits: [
      "Covers yield losses due to natural calamities",
      "Affordable premium rates",
      "Quick claim settlement",
      "Covers all food and oilseed crops"
    ],
    eligibility: [
      "All farmers growing notified crops",
      "Compulsory for loanee farmers",
      "Voluntary for non-loanee farmers",
      "Valid land records required"
    ],
    applicationProcess: "Apply through banks, insurance companies, or online portal",
    website: "pmfby.gov.in",
    status: "Active"
  },
  {
    name: "Soil Health Card",
    icon: "📋",
    fullName: "Soil Health Card Scheme",
    description: "Free soil testing and recommendations for balanced fertilizer use",
    benefits: [
      "Free soil testing every 3 years",
      "Personalized fertilizer recommendations",
      "Reduces input costs",
      "Improves soil fertility"
    ],
    eligibility: [
      "All farmers",
      "Valid land records",
      "Aadhaar linked",
      "No income limit"
    ],
    applicationProcess: "Apply at nearest soil testing laboratory or online",
    website: "soilhealth.dac.gov.in",
    status: "Active"
  },
  {
    name: "PMKSY",
    icon: "💧",
    fullName: "Pradhan Mantri Krishi Sinchayee Yojana",
    description: "Comprehensive irrigation scheme to ensure water to every field",
    benefits: [
      "50% subsidy on micro-irrigation",
      "90% subsidy for small/marginal farmers",
      "Water conservation",
      "Increased crop productivity"
    ],
    eligibility: [
      "All farmers",
      "Valid land records",
      "Water source available",
      "Technical feasibility"
    ],
    applicationProcess: "Apply through state agriculture department",
    website: "pmksy.gov.in",
    status: "Active"
  },
  {
    name: "PMFME",
    icon: "🏭",
    fullName: "Pradhan Mantri Formalisation of Micro Food Processing Enterprises",
    description: "Support for food processing units and value addition",
    benefits: [
      "35% subsidy on project cost",
      "Credit linked assistance",
      "Skill development training",
      "Market linkage support"
    ],
    eligibility: [
      "Micro food processing units",
      "Individual entrepreneurs",
      "Self-help groups",
      "Producer organizations"
    ],
    applicationProcess: "Apply through state nodal agencies",
    website: "pmfme.mofpi.gov.in",
    status: "Active"
  },
  {
    name: "PMKSY-PDMC",
    icon: "🏗️",
    fullName: "PMKSY - Per Drop More Crop",
    description: "Micro-irrigation scheme for water use efficiency",
    benefits: [
      "55% subsidy for small/marginal farmers",
      "45% subsidy for other farmers",
      "Drip and sprinkler systems",
      "Water saving up to 50%"
    ],
    eligibility: [
      "All farmers",
      "Suitable crops",
      "Water availability",
      "Technical feasibility"
    ],
    applicationProcess: "Apply through agriculture department or online",
    website: "pmksy.gov.in",
    status: "Active"
  },
  {
    name: "PMKSY-AIBP",
    icon: "🌊",
    fullName: "PMKSY - Accelerated Irrigation Benefits Programme",
    description: "Financial assistance for major and medium irrigation projects",
    benefits: [
      "Central assistance for irrigation projects",
      "Faster project completion",
      "Increased irrigation potential",
      "Better water management"
    ],
    eligibility: [
      "State governments",
      "Irrigation projects",
      "Technical approval",
      "Environmental clearance"
    ],
    applicationProcess: "State governments apply to central ministry",
    website: "pmksy.gov.in",
    status: "Active"
  },
  {
    name: "PMKSY-HKKP",
    icon: "🏞️",
    fullName: "PMKSY - Har Khet Ko Pani",
    description: "Assistance for creation of new water sources and restoration",
    benefits: [
      "New water source creation",
      "Restoration of water bodies",
      "Groundwater development",
      "Water harvesting structures"
    ],
    eligibility: [
      "All farmers",
      "Water scarce areas",
      "Technical feasibility",
      "Community participation"
    ],
    applicationProcess: "Apply through state agriculture department",
    website: "pmksy.gov.in",
    status: "Active"
  }
];

// Harvest Planning Data
const harvestPlanningData = {
  crops: [
    {
      name: "Wheat",
      icon: "🌾",
      harvestTiming: {
        optimal: "March-April (Rabi)",
        indicators: ["Golden yellow color", "Hard grains", "Moisture content 14-16%"],
        duration: "7-10 days window"
      },
      storage: {
        conditions: "Cool, dry place (15-20°C)",
        moisture: "Below 12%",
        containers: "Gunny bags, metal bins",
        duration: "6-12 months"
      },
      marketAnalysis: {
        peakPrices: "October-December",
        demand: "High throughout year",
        storageValue: "Good for long-term storage"
      },
      postHarvest: [
        "Clean and grade grains",
        "Treat with approved pesticides",
        "Monitor for pests regularly",
        "Maintain proper ventilation"
      ]
    },
    {
      name: "Rice",
      icon: "🍚",
      harvestTiming: {
        optimal: "September-October (Kharif)",
        indicators: ["80-85% grains matured", "Yellowing of leaves", "Moisture 20-25%"],
        duration: "5-7 days window"
      },
      storage: {
        conditions: "Cool, dry place (10-15°C)",
        moisture: "Below 13%",
        containers: "Hermetic bags, silos",
        duration: "8-12 months"
      },
      marketAnalysis: {
        peakPrices: "January-March",
        demand: "Consistent high demand",
        storageValue: "Excellent for storage"
      },
      postHarvest: [
        "Dry to 12-13% moisture",
        "Remove broken grains",
        "Store in airtight containers",
        "Regular quality checks"
      ]
    },
    {
      name: "Corn/Maize",
      icon: "🌽",
      harvestTiming: {
        optimal: "September-October",
        indicators: ["Kernels hard and dented", "Brown silks", "Moisture 25-30%"],
        duration: "10-14 days window"
      },
      storage: {
        conditions: "Well-ventilated area",
        moisture: "Below 14%",
        containers: "Cribs, silos, bags",
        duration: "6-8 months"
      },
      marketAnalysis: {
        peakPrices: "November-December",
        demand: "High for feed industry",
        storageValue: "Moderate storage value"
      },
      postHarvest: [
        "Dry to 13-14% moisture",
        "Remove damaged cobs",
        "Control temperature",
        "Monitor for aflatoxin"
      ]
    },
    {
      name: "Soybeans",
      icon: "🫘",
      harvestTiming: {
        optimal: "October-November",
        indicators: ["Pods brown and dry", "Seeds rattle in pods", "Moisture 13-15%"],
        duration: "7-10 days window"
      },
      storage: {
        conditions: "Cool, dry storage",
        moisture: "Below 12%",
        containers: "Bulk storage, bags",
        duration: "12-18 months"
      },
      marketAnalysis: {
        peakPrices: "February-April",
        demand: "High for oil extraction",
        storageValue: "Excellent storage value"
      },
      postHarvest: [
        "Clean and grade beans",
        "Maintain low moisture",
        "Regular aeration",
        "Monitor for mold"
      ]
    },
    {
      name: "Cotton",
      icon: "🧶",
      harvestTiming: {
        optimal: "October-December",
        indicators: ["Bolls fully opened", "White fluffy fibers", "Dry weather"],
        duration: "Multiple pickings over 2-3 months"
      },
      storage: {
        conditions: "Dry, well-ventilated",
        moisture: "Below 8%",
        containers: "Compressed bales",
        duration: "12-24 months"
      },
      marketAnalysis: {
        peakPrices: "March-May",
        demand: "High for textile industry",
        storageValue: "Good storage value"
      },
      postHarvest: [
        "Grade by fiber length",
        "Remove impurities",
        "Compress into bales",
        "Store in dry conditions"
      ]
    },
    {
      name: "Sugarcane",
      icon: "🎋",
      harvestTiming: {
        optimal: "November-March",
        indicators: ["12-18 months growth", "High sucrose content", "Dry weather"],
        duration: "3-4 months harvesting season"
      },
      storage: {
        conditions: "Cannot be stored long",
        moisture: "Process within 24-48 hours",
        containers: "Transport to mill immediately",
        duration: "1-2 days maximum"
      },
      marketAnalysis: {
        peakPrices: "December-February",
        demand: "High for sugar mills",
        storageValue: "No storage value"
      },
      postHarvest: [
        "Transport immediately",
        "Avoid bruising",
        "Maintain freshness",
        "Process quickly"
      ]
    }
  ],
  generalTips: {
    timing: [
      "Monitor weather forecasts for dry harvesting conditions",
      "Check crop maturity indicators regularly",
      "Plan harvest during optimal moisture content",
      "Avoid harvesting during rain or high humidity"
    ],
    equipment: [
      "Ensure harvesters are properly maintained",
      "Calibrate equipment for optimal performance",
      "Have backup equipment ready",
      "Train operators on proper techniques"
    ],
    labor: [
      "Arrange labor well in advance",
      "Provide proper training and safety equipment",
      "Plan for peak labor requirements",
      "Consider mechanization for efficiency"
    ]
  }
};

// Weather Updates Data
const weatherData = {
  currentWeather: {
    temperature: "28°C",
    humidity: "65%",
    windSpeed: "12 km/h",
    precipitation: "0%",
    uvIndex: "High",
    visibility: "10 km"
  },
  forecast: [
    {
      day: "Today",
      date: "2024-01-15",
      high: "32°C",
      low: "22°C",
      condition: "Sunny",
      icon: "☀️",
      precipitation: "0%",
      windSpeed: "10 km/h"
    },
    {
      day: "Tomorrow",
      date: "2024-01-16",
      high: "30°C",
      low: "20°C",
      condition: "Partly Cloudy",
      icon: "⛅",
      precipitation: "20%",
      windSpeed: "15 km/h"
    },
    {
      day: "Wednesday",
      date: "2024-01-17",
      high: "28°C",
      low: "18°C",
      condition: "Light Rain",
      icon: "🌦️",
      precipitation: "60%",
      windSpeed: "20 km/h"
    },
    {
      day: "Thursday",
      date: "2024-01-18",
      high: "26°C",
      low: "16°C",
      condition: "Rainy",
      icon: "🌧️",
      precipitation: "80%",
      windSpeed: "25 km/h"
    },
    {
      day: "Friday",
      date: "2024-01-19",
      high: "29°C",
      low: "19°C",
      condition: "Cloudy",
      icon: "☁️",
      precipitation: "30%",
      windSpeed: "12 km/h"
    }
  ],
  farmingAlerts: [
    {
      type: "Harvest Alert",
      severity: "High",
      message: "Optimal harvesting conditions expected for wheat in the next 3 days",
      icon: "🌾",
      color: "#16a34a"
    },
    {
      type: "Irrigation Alert",
      severity: "Medium",
      message: "Low rainfall expected - consider irrigation for moisture-sensitive crops",
      icon: "💧",
      color: "#f59e0b"
    },
    {
      type: "Pest Alert",
      severity: "Low",
      message: "High humidity may increase pest activity - monitor crops closely",
      icon: "🦗",
      color: "#dc2626"
    }
  ],
  cropSpecificWeather: [
    {
      crop: "Wheat",
      icon: "🌾",
      optimalConditions: {
        temperature: "20-25°C",
        humidity: "60-70%",
        rainfall: "Moderate",
        windSpeed: "5-15 km/h"
      },
      currentStatus: "Optimal",
      recommendations: [
        "Continue with planned harvest activities",
        "Monitor for any sudden weather changes",
        "Ensure proper storage conditions"
      ]
    },
    {
      crop: "Rice",
      icon: "🍚",
      optimalConditions: {
        temperature: "25-35°C",
        humidity: "70-80%",
        rainfall: "High",
        windSpeed: "5-10 km/h"
      },
      currentStatus: "Good",
      recommendations: [
        "Maintain water levels in paddy fields",
        "Watch for heavy rainfall that may cause flooding",
        "Prepare for potential pest outbreaks"
      ]
    },
    {
      crop: "Corn/Maize",
      icon: "🌽",
      optimalConditions: {
        temperature: "25-30°C",
        humidity: "65-75%",
        rainfall: "Moderate",
        windSpeed: "10-20 km/h"
      },
      currentStatus: "Caution",
      recommendations: [
        "Monitor for drought conditions",
        "Consider additional irrigation if needed",
        "Watch for wind damage to tall plants"
      ]
    },
    {
      crop: "Soybeans",
      icon: "🫘",
      optimalConditions: {
        temperature: "20-30°C",
        humidity: "60-70%",
        rainfall: "Moderate",
        windSpeed: "5-15 km/h"
      },
      currentStatus: "Optimal",
      recommendations: [
        "Ideal conditions for growth and development",
        "Continue with regular maintenance",
        "Monitor soil moisture levels"
      ]
    }
  ],
  weatherTips: {
    general: [
      "Check weather forecasts daily before planning farm activities",
      "Adjust irrigation schedules based on rainfall predictions",
      "Protect crops from extreme weather events",
      "Monitor soil moisture levels regularly"
    ],
    seasonal: [
      "Summer: Focus on irrigation and heat stress management",
      "Monsoon: Prepare for heavy rainfall and flooding",
      "Winter: Protect crops from frost and cold damage",
      "Spring: Monitor for pest outbreaks and disease"
    ],
    emergency: [
      "Have emergency contact numbers ready",
      "Keep backup power sources for critical equipment",
      "Store essential supplies for extreme weather",
      "Develop evacuation plans for severe storms"
    ]
  }
};

const MonkeyEyeToggle: React.FC<{
  visible: boolean;
  onClick: () => void;
}> = ({ visible, onClick }) => (
  <button
    type="button"
    aria-label={visible ? "Hide password" : "Show password"}
    onClick={onClick}
    style={{
      background: "none",
      border: "none",
      cursor: "pointer",
      position: "absolute",
      right: 16,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 28,
      outline: "none",
      zIndex: 2,
      padding: 0,
      display: "flex",
      alignItems: "center"
    }}
    title={visible ? "Hide? 🙉" : "Peek? 🙈"}
  >
    {visible ? (
      // Monkey with hands off eyes (password visible)
      <span role="img" aria-label="Monkey see">🙉</span>
    ) : (
      // Monkey covering eyes (password hidden)
      <span role="img" aria-label="Monkey no see">🙈</span>
    )}
  </button>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [stats, setStats] = useState({
    today: 16,
    week: 16,
    month: 16,
    year: 16,
    users: 120,
    schemes: 8,
    crops: 24,
    uptime: '24 hours',
    activities: [
      { text: 'User registered', time: '21/6/2025, 6:11:17 pm' },
      { text: 'Scheme added', time: '21/6/2025, 4:11:17 pm' },
      { text: 'Crop data updated', time: '21/6/2025, 1:11:17 pm' },
    ],
    usage: 72, // percent for circular indicator
    visitorsGraph: [4, 8, 6, 12, 10, 16, 14], // mock data for 7 days
    analytics: [
      { label: 'Active Users', value: 98, icon: '🟢', color: '#22d3ee' },
      { label: 'Engagement Rate', value: '87%', icon: '📈', color: '#fbbf24' },
      { label: 'Error Rate', value: '1.2%', icon: '❌', color: '#ef4444' },
      { label: 'Revenue', value: '₹12,000', icon: '💸', color: '#a3e635' },
    ],
  });
  const barColors = ['#16a34a', '#22d3ee', '#fbbf24', '#ef4444', '#a3e635', '#6366f1', '#f472b6'];
  const handleRefresh = () => {
    setStats(s => ({ ...s, today: s.today + 1, usage: Math.min(100, s.usage + 2) }));
  };
  const handleLogout = () => {
    navigate('/');
  };
  // Admins state (mock data)
  const [admins, setAdmins] = useState([
    { username: 'arnavgarhwal', email: 'arnav@example.com' },
    { username: 'admin2', email: 'admin2@example.com' },
  ]);
  const [newAdmin, setNewAdmin] = useState({ username: '', email: '', password: '' });
  const [addStatus, setAddStatus] = useState('idle');
  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.email || !newAdmin.password) return;
    setAdmins(prev => [...prev, { username: newAdmin.username, email: newAdmin.email }]);
    setNewAdmin({ username: '', email: '', password: '' });
    setAddStatus('success');
    setTimeout(() => setAddStatus('idle'), 1500);
  };
  return (
    <div style={{ minHeight: '100vh', background: '#f6fbff', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 40px 16px 32px', background: '#fff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(34,197,94,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={reactLogo} alt="Intellifarm Systems Logo" style={{ height: 40, width: 40, borderRadius: 8, background: '#e0f2fe', padding: 4 }} />
          <span style={{ fontWeight: 600, fontSize: 20, color: '#222', letterSpacing: '-0.02em' }}>Intellifarm Systems</span>
        </div>
        <h1 style={{ color: '#16a34a', fontWeight: 800, fontSize: 28, margin: 0, flex: 1, textAlign: 'center', letterSpacing: '-0.01em' }}>Admin Dashboard</h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <button onClick={handleRefresh} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(34,197,94,0.08)' }}>Refresh</button>
          <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(239,68,68,0.08)' }}>Logout</button>
        </div>
      </header>
      {/* Tabs */}
      <nav style={{ display: 'flex', gap: 24, background: 'transparent', padding: '24px 0 0 0', justifyContent: 'center' }}>
        {['Overview', 'Visitors', 'Analytics', 'Settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              background: activeTab === tab ? '#16a34a' : '#fff',
              color: activeTab === tab ? '#fff' : '#16a34a',
              border: 'none',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 18,
              padding: '12px 36px',
              boxShadow: activeTab === tab ? '0 2px 8px rgba(34,197,94,0.10)' : '0 1px 4px rgba(34,197,94,0.04)',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
          >{tab}</button>
        ))}
      </nav>
      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '32px auto', padding: '0 24px', display: activeTab === 'Overview' ? 'block' : 'none' }}>
        {/* Stat Cards */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          {[
            { label: "Today's Visitors", value: stats.today, icon: '👥', bg: '#e0f2fe' },
            { label: 'This Week', value: stats.week, icon: '📅', bg: '#e0e7ff' },
            { label: 'This Month', value: stats.month, icon: '📊', bg: '#fef9c3' },
            { label: 'This Year', value: stats.year, icon: '🎯', bg: '#fce7f3' },
          ].map((card, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,197,94,0.07)', padding: 28, minWidth: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ background: card.bg, borderRadius: 12, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>{card.icon}</div>
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: 16 }}>{card.label}</div>
              <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 32 }}>{card.value}</div>
            </div>
          ))}
        </div>
        {/* Analytics Cards */}
        <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
          {stats.analytics.map((a, i) => (
            <div key={i} style={{ background: a.color, borderRadius: 18, boxShadow: '0 2px 12px rgba(34,197,94,0.07)', padding: 24, minWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ fontSize: 28 }}>{a.icon}</div>
              <div style={{ color: '#222', fontWeight: 700, fontSize: 18 }}>{a.label}</div>
              <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 28 }}>{a.value}</div>
            </div>
          ))}
        </div>
        {/* Visitors Bar Graph */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,197,94,0.07)', padding: 32, margin: '0 auto 32px auto', maxWidth: 700 }}>
          <h3 style={{ color: '#16a34a', fontWeight: 700, fontSize: 20, marginBottom: 18 }}>Visitors (Last 7 Days)</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 140, justifyContent: 'center' }}>
            {stats.visitorsGraph.map((val, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: `${val * 7}px`, width: 32, background: barColors[i % barColors.length], borderRadius: 8, marginBottom: 6, transition: 'height 0.3s' }}></div>
                <span style={{ color: '#64748b', fontSize: 14 }}>Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Activities & Stats */}
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Recent Activities */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,197,94,0.07)', flex: 2, minWidth: 340, padding: 32, marginBottom: 24 }}>
            <h2 style={{ color: '#16a34a', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Recent Activities</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 18 }}>
              {stats.activities.map((a, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f6fbff', borderRadius: 8, padding: '12px 18px', fontSize: 16 }}>
                  <span style={{ color: '#16a34a', fontWeight: 600 }}>{a.text}</span>
                  <span style={{ color: '#64748b', fontSize: 14 }}>{a.time}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* System Stats */}
          <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,197,94,0.07)', flex: 1, minWidth: 260, padding: 32, marginBottom: 24, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: '#16a34a', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>System Stats</h2>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Total Users</div>
            <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 28, marginBottom: 18 }}>{stats.users}</div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Total Schemes</div>
            <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 28, marginBottom: 18 }}>{stats.schemes}</div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Total Crops</div>
            <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 28, marginBottom: 18 }}>{stats.crops}</div>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: 16, marginBottom: 10 }}>System Uptime</div>
            <div style={{ color: '#16a34a', fontWeight: 800, fontSize: 22, marginBottom: 18 }}>{stats.uptime}</div>
            {/* Circular Progress */}
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ color: '#64748b', fontWeight: 600, fontSize: 16, marginBottom: 6 }}>System Usage</span>
              <svg width="90" height="90" viewBox="0 0 90 90">
                <circle cx="45" cy="45" r="38" stroke="#e0e7ef" strokeWidth="10" fill="none" />
                <circle cx="45" cy="45" r="38" stroke="#16a34a" strokeWidth="10" fill="none" strokeDasharray={2 * Math.PI * 38} strokeDashoffset={(1 - stats.usage / 100) * 2 * Math.PI * 38} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />
                <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="22" fontWeight="bold" fill="#16a34a">{stats.usage}%</text>
              </svg>
            </div>
          </div>
        </div>
        {/* Admin Details Section */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,197,94,0.07)', padding: 32, margin: '32px auto', maxWidth: 700 }}>
          <h2 style={{ color: '#16a34a', fontWeight: 700, fontSize: 22, marginBottom: 18 }}>Admin Details</h2>
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ color: '#64748b', fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Current Admins</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {admins.map((admin, i) => (
                <li key={i} style={{ background: '#f6fbff', borderRadius: 8, padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 18 }}>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>{admin.username}</span>
                  <span style={{ color: '#64748b', fontSize: 15 }}>{admin.email}</span>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={handleAddAdmin} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
            <input
              type="text"
              placeholder="Username"
              value={newAdmin.username}
              onChange={e => setNewAdmin(a => ({ ...a, username: e.target.value }))}
              style={{ flex: 1, minWidth: 120, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #16a34a55', fontSize: 16 }}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newAdmin.email}
              onChange={e => setNewAdmin(a => ({ ...a, email: e.target.value }))}
              style={{ flex: 2, minWidth: 180, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #16a34a55', fontSize: 16 }}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newAdmin.password}
              onChange={e => setNewAdmin(a => ({ ...a, password: e.target.value }))}
              style={{ flex: 1, minWidth: 120, padding: '10px 12px', borderRadius: 8, border: '1.5px solid #16a34a55', fontSize: 16 }}
              required
            />
            <button type="submit" style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, cursor: 'pointer', minWidth: 120 }}>
              Add Admin
            </button>
            {addStatus === 'success' && <span style={{ color: '#16a34a', fontWeight: 600, marginLeft: 10 }}>Added!</span>}
          </form>
        </div>
      </main>
      {/* Placeholder for other tabs */}
      {activeTab !== 'Overview' && (
        <div style={{ maxWidth: 900, margin: '48px auto', padding: '40px 24px', background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px rgba(34,197,94,0.07)', textAlign: 'center', color: '#64748b', fontSize: 22, fontWeight: 600 }}>
          {activeTab} section coming soon...
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [crop, setCrop] = useState("");
  const [harvestingDate, setHarvestingDate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showCropSuggestions, setShowCropSuggestions] = useState(false);
  const [showCostAnalysis, setShowCostAnalysis] = useState(false);
  const [showEquipmentGuide, setShowEquipmentGuide] = useState(false);
  const [showIrrigationAdvice, setShowIrrigationAdvice] = useState(false);
  const [showYieldPrediction, setShowYieldPrediction] = useState(false);
  const [showGovernmentSchemes, setShowGovernmentSchemes] = useState(false);
  const [showHarvestPlanning, setShowHarvestPlanning] = useState(false);
  const [showWeatherUpdates, setShowWeatherUpdates] = useState(false);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginStatus, setAdminLoginStatus] = useState('idle');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showNearbyMarketplace, setShowNearbyMarketplace] = useState(false);
  const [marketSearch, setMarketSearch] = useState("");
  const [marketCategory, setMarketCategory] = useState("All");

  const MOCK_MARKETS = [
    { name: "Agro Market A", distance: "5 km", category: "Vegetables", link: "#" },
    { name: "Green Valley Market", distance: "12 km", category: "Grains", link: "#" },
    { name: "Farmers' Hub", distance: "20 km", category: "Fruits", link: "#" },
    { name: "City Mandi", distance: "8 km", category: "Vegetables", link: "#" },
    { name: "Village Bazaar", distance: "15 km", category: "Grains", link: "#" },
  ];
  const marketCategories = ["All", ...Array.from(new Set(MOCK_MARKETS.map(m => m.category)))];
  const filteredMarkets = MOCK_MARKETS.filter(m =>
    (marketCategory === "All" || m.category === marketCategory) &&
    m.name.toLowerCase().includes(marketSearch.toLowerCase())
  );

  // Debug state changes
  useEffect(() => {
    console.log("showCropSuggestions:", showCropSuggestions);
  }, [showCropSuggestions]);

  useEffect(() => {
    console.log("showCostAnalysis:", showCostAnalysis);
  }, [showCostAnalysis]);

  // Keyboard accessibility for modal
  useEffect(() => {
    if (!showAdminLogin) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowAdminLogin(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showAdminLogin]);

  // Cost Analysis Data

  // Comprehensive Crop Suggestions Data
  const cropSuggestions = [
    {
      name: "Rice",
      icon: "🌾",
      season: "Kharif (June-October)",
      duration: "120-150 days",
      water: "High",
      soil: "Clay loam",
      states: ["WB", "UP", "PB", "TN", "AP", "TG", "BR", "OR"],
      description: "Staple food crop, suitable for monsoon season",
      marketPotential: "High",
      investment: "Medium",
      costBreakdown: {
        seeds: 1200,
        fertilizers: 3000,
        pesticides: 1500,
        irrigation: 2000,
        labor: 8000,
        machinery: 3000,
        transportation: 1500,
        miscellaneous: 1000
      },
      yieldPerAcre: 25, // quintals
      marketPrice: 1800, // per quintal
      totalCost: 0, // will be calculated
      totalRevenue: 0, // will be calculated
      profit: 0 // will be calculated
    },
    {
      name: "Wheat",
      icon: "🌾",
      season: "Rabi (November-March)",
      duration: "110-130 days",
      water: "Medium",
      soil: "Loamy",
      states: ["UP", "PB", "HR", "MP", "RJ", "MH", "BR"],
      description: "Winter crop, major food grain",
      marketPotential: "High",
      investment: "Medium",
      costBreakdown: {
        seeds: 1000,
        fertilizers: 2500,
        pesticides: 1200,
        irrigation: 1500,
        labor: 6000,
        machinery: 2500,
        transportation: 1200,
        miscellaneous: 800
      },
      yieldPerAcre: 20, // quintals
      marketPrice: 2000, // per quintal
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    },
    {
      name: "Maize",
      icon: "🌽",
      season: "Kharif & Rabi",
      duration: "90-120 days",
      water: "Medium",
      soil: "Well-drained loam",
      states: ["MP", "KA", "AP", "TG", "BR", "JH", "MH"],
      description: "Versatile crop for food and fodder",
      marketPotential: "Medium",
      investment: "Low",
      costBreakdown: {
        seeds: 800,
        fertilizers: 2000,
        pesticides: 1000,
        irrigation: 1200,
        labor: 5000,
        machinery: 2000,
        transportation: 1000,
        miscellaneous: 600
      },
      yieldPerAcre: 18, // quintals
      marketPrice: 1500, // per quintal
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    },
    {
      name: "Sugarcane",
      icon: "🎋",
      season: "Year-round",
      duration: "12-18 months",
      water: "Very High",
      soil: "Deep loam",
      states: ["UP", "MH", "KA", "TN", "AP", "TG", "GJ"],
      description: "Cash crop, requires long growing period",
      marketPotential: "High",
      investment: "High",
      costBreakdown: {
        seeds: 3000,
        fertilizers: 5000,
        pesticides: 2000,
        irrigation: 8000,
        labor: 15000,
        machinery: 5000,
        transportation: 3000,
        miscellaneous: 2000
      },
      yieldPerAcre: 400, // quintals
      marketPrice: 300, // per quintal
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    },
    {
      name: "Cotton",
      icon: "🧶",
      season: "Kharif",
      duration: "150-180 days",
      water: "Medium",
      soil: "Black soil",
      states: ["MH", "GJ", "MP", "AP", "TG", "RJ", "KA"],
      description: "Fiber crop, drought resistant",
      marketPotential: "Medium",
      investment: "Medium",
      costBreakdown: {
        seeds: 1500,
        fertilizers: 3000,
        pesticides: 2500,
        irrigation: 2000,
        labor: 10000,
        machinery: 3000,
        transportation: 2000,
        miscellaneous: 1500
      },
      yieldPerAcre: 8, // quintals
      marketPrice: 6000, // per quintal
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    },
    {
      name: "Pulses",
      icon: "🫘",
      season: "Rabi & Kharif",
      duration: "60-120 days",
      water: "Low",
      soil: "Sandy loam",
      states: ["MP", "MH", "UP", "RJ", "KA", "AP", "TG"],
      description: "Protein-rich, nitrogen fixing",
      marketPotential: "Medium",
      investment: "Low",
      costBreakdown: {
        seeds: 600,
        fertilizers: 1500,
        pesticides: 800,
        irrigation: 800,
        labor: 4000,
        machinery: 1500,
        transportation: 800,
        miscellaneous: 500
      },
      yieldPerAcre: 6, // quintals
      marketPrice: 4000, // per quintal
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    },
    {
      name: "Oilseeds",
      icon: "🫒",
      season: "Rabi & Kharif",
      duration: "90-150 days",
      water: "Low-Medium",
      soil: "Sandy loam",
      states: ["MP", "RJ", "MH", "UP", "AP", "TG", "KA"],
      description: "Edible oils and industrial use",
      marketPotential: "Medium",
      investment: "Low",
      costBreakdown: {
        seeds: 800,
        fertilizers: 1800,
        pesticides: 1000,
        irrigation: 1000,
        labor: 5000,
        machinery: 1800,
        transportation: 1000,
        miscellaneous: 600
      },
      yieldPerAcre: 8, // quintals
      marketPrice: 3500, // per quintal
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    },
    {
      name: "Vegetables",
      icon: "🥬",
      season: "Year-round",
      duration: "30-120 days",
      water: "High",
      soil: "Rich loam",
      states: ["All States"],
      description: "Short duration, high value crops",
      marketPotential: "High",
      investment: "Medium",
      costBreakdown: {
        seeds: 500,
        fertilizers: 2000,
        pesticides: 1200,
        irrigation: 1500,
        labor: 8000,
        machinery: 1000,
        transportation: 1000,
        miscellaneous: 800
      },
      yieldPerAcre: 15, // tons
      marketPrice: 2000, // per ton
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    },
    {
      name: "Fruits",
      icon: "🍎",
      season: "Year-round",
      duration: "3-8 years",
      water: "Medium",
      soil: "Well-drained",
      states: ["All States"],
      description: "Perennial crops, long-term investment",
      marketPotential: "High",
      investment: "High",
      costBreakdown: {
        seeds: 2000,
        fertilizers: 3000,
        pesticides: 2000,
        irrigation: 3000,
        labor: 12000,
        machinery: 2000,
        transportation: 1500,
        miscellaneous: 1500
      },
      yieldPerAcre: 10, // tons
      marketPrice: 5000, // per ton
      totalCost: 0,
      totalRevenue: 0,
      profit: 0
    }
  ];

  // Calculate costs and profits for each crop
  const calculateCropEconomics = (crop: any) => {
    const totalCost = Object.values(crop.costBreakdown).reduce((sum: number, cost: any) => sum + (cost as number), 0);
    const totalRevenue = crop.yieldPerAcre * crop.marketPrice;
    const profit = totalRevenue - totalCost;
    
    return {
      ...crop,
      totalCost,
      totalRevenue,
      profit
    };
  };

  const cropsWithEconomics = cropSuggestions.map(calculateCropEconomics);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      // Simulate AI analysis with mock data
      const cropKey = crop.trim().toLowerCase();
      const priceInfo = MOCK_PRICES[cropKey] || {
        min: 1000,
        max: 2000,
        period: "Varies by crop"
      };
      setResult({
        markets: MOCK_MARKETS,
        price: priceInfo,
        harvestingDate // include in result if needed
      });
      setLoading(false);
    }, 1200);
  };

  const handleReset = () => {
    setState("");
    setDistrict("");
    setCrop("");
    setHarvestingDate("");
    setResult(null);
  };

  const features = [
    { name: "Crop Suggestions", icon: "🌾", description: "Get AI-powered crop recommendations based on soil, climate, and market conditions" },
    { name: "Yield Prediction", icon: "📊", description: "Predict crop yields using advanced AI algorithms and historical data" },
    { name: "Irrigation Advice", icon: "💧", description: "Smart irrigation recommendations for optimal water usage and crop health" },
    { name: "Equipment Guide", icon: "🚜", description: "Comprehensive guide to farming equipment, prices, and maintenance" },
    { name: "Cost Analysis", icon: "💰", description: "Detailed cost breakdown and financial analysis for different crops" },
    { name: "Nearby Marketplace / Mandi", icon: "🛒", description: "Find the nearest markets and mandis for your crops, including distance and details." },
    { name: "Government Schemes", icon: "🏛️", description: "Information about government subsidies and support programs" },
    { name: "Harvest Planning", icon: "🌾", description: "Optimal harvest timing, storage, and post-harvest management strategies" },
    { name: "Weather Updates", icon: "🌤️", description: "Real-time weather data, forecasts, and farming-specific weather alerts" }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(34, 197, 94, 0.1)",
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}>
        {/* Logo (Top Left) */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 20,
            boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
          }}>
            🌾
          </div>
          <span style={{
            color: "#16a34a",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "-0.025em"
          }}>
            AI Farmer
          </span>
        </div>

        {/* App Name (Top Center) */}
        <div style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#16a34a",
          fontWeight: 700,
          fontSize: 24,
          letterSpacing: "-0.025em"
        }}>
          Crop Market Analyzer
        </div>

        {/* Menu Icon (Top Right) */}
        <button
          onClick={() => setShowFeatures(v => !v)}
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            borderRadius: 10,
            width: 48,
            height: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            gap: 4
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(34, 197, 94, 0.15)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(34, 197, 94, 0.1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
          aria-label="More features"
        >
          <span style={{
            width: 20, height: 2, background: "#16a34a", borderRadius: 1, transition: "all 0.2s ease"
          }} />
          <span style={{
            width: 20, height: 2, background: "#16a34a", borderRadius: 1, transition: "all 0.2s ease"
          }} />
          <span style={{
            width: 20, height: 2, background: "#16a34a", borderRadius: 1, transition: "all 0.2s ease"
          }} />
        </button>
      </header>

      {/* Features Drawer/Modal */}
      {showFeatures && (
        <div
          style={{
            position: "fixed",
            top: 0, right: 0, bottom: 0,
            width: 320,
            background: "rgba(255, 255, 255, 0.98)",
            backdropFilter: "blur(20px)",
            borderLeft: "1px solid rgba(34, 197, 94, 0.1)",
            boxShadow: "-4px 0 24px rgba(34, 197, 94, 0.1)",
            zIndex: 100,
            padding: 32,
            display: "flex",
            flexDirection: "column",
            animation: "slideIn 0.3s ease-out"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ color: "#8B4513", fontWeight: 700, fontSize: 20, margin: 0 }}>Features</h2>
            <button
              onClick={() => setShowFeatures(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: 24,
                color: "#8B4513",
                cursor: "pointer",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 6,
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(139, 69, 19, 0.1)";
                e.currentTarget.style.color = "#8B4513";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#8B4513";
              }}
              aria-label="Close"
            >×</button>
          </div>
          <div style={{ 
            flex: 1, 
            overflowY: "auto", 
            paddingRight: 8,
            marginRight: -8
          }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
              {features.map((feature, idx) => (
                <li key={idx} style={{
                  padding: "16px",
                  background: "rgba(139, 69, 19, 0.05)",
                  borderRadius: 12,
                  border: "1px solid rgba(139, 69, 19, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
                onClick={() => {
                  switch (feature.name) {
                    case "Crop Suggestions":
                      setShowCropSuggestions(true);
                      break;
                    case "Yield Prediction":
                      setShowYieldPrediction(true);
                      break;
                    case "Irrigation Advice":
                      setShowIrrigationAdvice(true);
                      break;
                    case "Equipment Guide":
                      setShowEquipmentGuide(true);
                      break;
                    case "Cost Analysis":
                      setShowCostAnalysis(true);
                      break;
                    case "Nearby Marketplace / Mandi":
                      setShowNearbyMarketplace(true);
                      break;
                    case "Government Schemes":
                      setShowGovernmentSchemes(true);
                      break;
                    case "Harvest Planning":
                      setShowHarvestPlanning(true);
                      break;
                    case "Weather Updates":
                      setShowWeatherUpdates(true);
                      break;
                  }
                  setShowFeatures(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139, 69, 19, 0.1)";
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139, 69, 19, 0.05)";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{feature.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: "#8B4513", fontSize: 15 }}>{feature.name}</div>
                      <div style={{ color: "#6B7280", fontSize: 13, marginTop: 2 }}>{feature.description}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        maxWidth: 1200,
        margin: "0 auto"
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: "center",
          marginBottom: 48,
          maxWidth: 600
        }}>
          <h1 style={{
            color: "#16a34a",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.2,
            marginBottom: 16,
            letterSpacing: "-0.025em"
          }}>
            Welcome to AI Farmer
          </h1>
          <p style={{
            color: "#6B7280",
            fontSize: 18,
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 400
          }}>
            Your one-stop platform for smart, sustainable, and profitable farming. Explore features using the menu above.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "1px solid rgba(34, 197, 94, 0.1)",
            boxShadow: "0 8px 32px rgba(34, 197, 94, 0.08)",
            padding: "48px 40px",
            minWidth: 400,
            maxWidth: 500,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 28
          }}
        >
          <div>
            <label htmlFor="state" style={{ 
              color: "#16a34a", 
              fontWeight: 600, 
              fontSize: 14, 
              marginBottom: 8, 
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Select Your State
            </label>
            <select
              id="state"
              value={state}
              onChange={e => setState(e.target.value)}
              style={{
                width: "100%",
                height: 52,
                border: "2px solid rgba(34, 197, 94, 0.2)",
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 12,
                padding: "0 16px",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#16a34a",
                outline: "none",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(34, 197, 94, 0.2)";
                e.target.style.boxShadow = "none";
              }}
              required
            >
              <option value="">Select your state</option>
              {INDIAN_STATES.map((stateOption) => (
                <option key={stateOption.id} value={stateOption.id}>
                  {stateOption.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="district" style={{ 
              color: "#16a34a", 
              fontWeight: 600, 
              fontSize: 14, 
              marginBottom: 8, 
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Enter your district
            </label>
            <input
              id="district"
              type="text"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              placeholder="Enter your district"
              style={{
                width: "100%",
                height: 52,
                border: "2px solid rgba(34, 197, 94, 0.2)",
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 12,
                padding: "0 16px",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#16a34a",
                outline: "none",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(34, 197, 94, 0.2)";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="crop" style={{ 
              color: "#16a34a", 
              fontWeight: 600, 
              fontSize: 14, 
              marginBottom: 8, 
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Crop Name
            </label>
            <input
              id="crop"
              type="text"
              value={crop}
              onChange={e => setCrop(e.target.value)}
              placeholder="Enter crop name (e.g., wheat, rice, maize)"
              style={{
                width: "100%",
                height: 52,
                border: "2px solid rgba(34, 197, 94, 0.2)",
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 12,
                padding: "0 16px",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#16a34a",
                outline: "none",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(34, 197, 94, 0.2)";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>
          <div>
            <label htmlFor="harvestingDate" style={{ 
              color: "#16a34a", 
              fontWeight: 600, 
              fontSize: 14, 
              marginBottom: 8, 
              display: "block",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              Harvesting Date
            </label>
            <input
              id="harvestingDate"
              type="date"
              value={harvestingDate}
              onChange={e => setHarvestingDate(e.target.value)}
              style={{
                width: "100%",
                height: 52,
                border: "2px solid rgba(34, 197, 94, 0.2)",
                fontSize: 16,
                fontWeight: 500,
                borderRadius: 12,
                padding: "0 16px",
                background: "rgba(255, 255, 255, 0.9)",
                color: "#16a34a",
                outline: "none",
                transition: "all 0.2s ease"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#16a34a";
                e.target.style.boxShadow = "0 0 0 3px rgba(34, 197, 94, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(34, 197, 94, 0.2)";
                e.target.style.boxShadow = "none";
              }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              height: 56,
              background: loading ? "rgba(34, 197, 94, 0.3)" : "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: loading ? "none" : "0 4px 12px rgba(34, 197, 94, 0.3)"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(34, 197, 94, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.3)";
              }
            }}
          >
            {loading ? "Analyzing..." : "Get Market Analysis"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              height: 48,
              background: "transparent",
              color: "#16a34a",
              border: "2px solid rgba(34, 197, 94, 0.2)",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(34, 197, 94, 0.05)";
              e.currentTarget.style.borderColor = "#16a34a";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(139, 69, 19, 0.2)";
            }}
          >
            Reset Form
          </button>
        </form>

        {/* Results Section */}
        {result && (
          <div style={{
            marginTop: 48,
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            border: "1px solid rgba(34, 197, 94, 0.1)",
            boxShadow: "0 8px 32px rgba(34, 197, 94, 0.08)",
            padding: "40px 36px",
            minWidth: 400,
            maxWidth: 500,
            width: "100%",
            color: "#16a34a"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 24
              }}>
                📊
              </div>
              <h2 style={{ color: "#16a34a", fontWeight: 700, fontSize: 24, margin: 0 }}>Market Analysis</h2>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div>
                <h3 style={{ color: "#16a34a", fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Nearby Marketplaces</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.markets.map((m: any, idx: number) => (
                    <div key={idx} style={{
                      padding: "12px 16px",
                      background: "rgba(34, 197, 94, 0.05)",
                      borderRadius: 8,
                      border: "1px solid rgba(34, 197, 94, 0.1)"
                    }}>
                      <div style={{ fontWeight: 500, color: "#16a34a" }}>{m.name}</div>
                      <div style={{ color: "#6B7280", fontSize: 14, marginTop: 2 }}>Distance: {m.distance}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{
                padding: "20px",
                background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%)",
                borderRadius: 12,
                border: "1px solid rgba(34, 197, 94, 0.2)"
              }}>
                <h3 style={{ color: "#16a34a", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Expected Price Range</h3>
                <div style={{ color: "#16a34a", fontWeight: 700, fontSize: 20 }}>
                  ₹{result.price.min.toLocaleString()} - ₹{result.price.max.toLocaleString()} per quintal
                </div>
              </div>
              
              <div style={{
                padding: "20px",
                background: "linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(34, 197, 94, 0.1) 100%)",
                borderRadius: 12,
                border: "1px solid rgba(22, 163, 74, 0.2)"
              }}>
                <h3 style={{ color: "#16a34a", fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Optimal Harvest Period</h3>
                <div style={{ color: "#22c55e", fontWeight: 600, fontSize: 18 }}>{result.price.period}</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Crop Suggestions Modal */}
      {showCropSuggestions && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 1200,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>🌱 Crop Suggestions</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>AI-powered crop recommendations based on your location and requirements</p>
              </div>
              <button
                onClick={() => setShowCropSuggestions(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>

            <div style={{ padding: 32 }}>
              {/* Introduction Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Smart Crop Recommendations</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Our AI analyzes your location, soil type, water availability, and market conditions to suggest the most profitable crops. 
                  Each recommendation includes detailed cost analysis, expected yields, and market potential.
                </p>
              </div>

              {/* Crop Cards Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: 24
              }}>
                {cropsWithEconomics.map((crop, index) => (
                  <div key={index} style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                  >
                    {/* Crop Header */}
                    <div style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      padding: "20px 24px",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <h4 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                            {crop.icon} {crop.name}
                          </h4>
                          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{crop.description}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <span style={{
                            background: crop.marketPotential === "High" ? "rgba(16, 185, 129, 0.1)" : 
                                       crop.marketPotential === "Medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: crop.marketPotential === "High" ? "#059669" : 
                                   crop.marketPotential === "Medium" ? "#d97706" : "#dc2626",
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 500
                          }}>
                            {crop.marketPotential} Market
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Crop Details */}
                    <div style={{ padding: "24px" }}>
                      {/* Growing Requirements */}
                      <div style={{ marginBottom: 20 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Growing Requirements</h5>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                          <div>
                            <span style={{ color: "#64748b", fontSize: 13 }}>Season:</span>
                            <div style={{ color: "#1e293b", fontWeight: 500 }}>{crop.season}</div>
                          </div>
                          <div>
                            <span style={{ color: "#64748b", fontSize: 13 }}>Duration:</span>
                            <div style={{ color: "#1e293b", fontWeight: 500 }}>{crop.duration}</div>
                          </div>
                          <div>
                            <span style={{ color: "#64748b", fontSize: 13 }}>Water Need:</span>
                            <div style={{ color: "#1e293b", fontWeight: 500 }}>{crop.water}</div>
                          </div>
                          <div>
                            <span style={{ color: "#64748b", fontSize: 13 }}>Soil Type:</span>
                            <div style={{ color: "#1e293b", fontWeight: 500 }}>{crop.soil}</div>
                          </div>
                        </div>
                      </div>

                      {/* Economics Section */}
                      <div style={{ marginBottom: 20 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Economics (per acre)</h5>
                        <div style={{
                          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%)",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid rgba(59, 130, 246, 0.1)"
                        }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                            <div>
                              <span style={{ color: "#64748b", fontSize: 13 }}>Total Cost:</span>
                              <div style={{ color: "#dc2626", fontWeight: 600 }}>₹{crop.totalCost.toLocaleString()}</div>
                            </div>
                            <div>
                              <span style={{ color: "#64748b", fontSize: 13 }}>Expected Revenue:</span>
                              <div style={{ color: "#059669", fontWeight: 600 }}>₹{crop.totalRevenue.toLocaleString()}</div>
                            </div>
                            <div>
                              <span style={{ color: "#64748b", fontSize: 13 }}>Net Profit:</span>
                              <div style={{ 
                                color: crop.profit >= 0 ? "#059669" : "#dc2626", 
                                fontWeight: 600 
                              }}>
                                ₹{crop.profit.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div style={{ marginBottom: 20 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Cost Breakdown</h5>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          {Object.entries(crop.costBreakdown).map(([key, value]) => (
                            <div key={key} style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ color: "#64748b", fontSize: 13, textTransform: "capitalize" }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </span>
                              <span style={{ color: "#1e293b", fontWeight: 500, fontSize: 13 }}>
                                ₹{(value as number).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Investment Level */}
                      <div style={{
                        background: crop.investment === "Low" ? "rgba(16, 185, 129, 0.1)" : 
                                   crop.investment === "Medium" ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
                        borderRadius: 8,
                        padding: "12px 16px",
                        border: "1px solid",
                        borderColor: crop.investment === "Low" ? "rgba(16, 185, 129, 0.2)" : 
                                     crop.investment === "Medium" ? "rgba(245, 158, 11, 0.2)" : "rgba(239, 68, 68, 0.2)"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ color: "#64748b", fontSize: 14 }}>Investment Level:</span>
                          <span style={{
                            color: crop.investment === "Low" ? "#059669" : 
                                   crop.investment === "Medium" ? "#d97706" : "#dc2626",
                            fontWeight: 600,
                            fontSize: 14
                          }}>
                            {crop.investment}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: "rgba(59, 130, 246, 0.05)",
                borderRadius: 12,
                border: "1px solid rgba(59, 130, 246, 0.1)",
                textAlign: "center"
              }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
                  💡 <strong>Tip:</strong> Consider your local climate, soil conditions, and market demand when choosing crops. 
                  These recommendations are based on general conditions and may vary by specific location.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Analysis Modal */}
      {showCostAnalysis && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 1200,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>💰 Cost Analysis</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Comprehensive cost analysis and financial planning tools</p>
              </div>
              <button
                onClick={() => setShowCostAnalysis(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>

            <div style={{ padding: 32 }}>
              {/* Introduction Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(245, 158, 11, 0.2)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Crop-Specific Cost Analysis</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Detailed cost breakdown for each crop including seeds, fertilizers, labor, transportation, and other expenses. 
                  Compare costs across different crops to make informed decisions.
                </p>
              </div>

              {/* Crop Cost Breakdown Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: 24
              }}>
                {cropsWithEconomics.map((crop, index) => (
                  <div key={index} style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                  >
                    {/* Crop Header */}
                    <div style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      padding: "20px 24px",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <h4 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                            {crop.icon} {crop.name}
                          </h4>
                          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{crop.description}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            background: "rgba(245, 158, 11, 0.1)",
                            color: "#d97706",
                            padding: "6px 12px",
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 4
                          }}>
                            Total Cost: ₹{crop.totalCost.toLocaleString()}
                          </div>
                          <div style={{
                            background: crop.profit >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: crop.profit >= 0 ? "#059669" : "#dc2626",
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            Profit: ₹{crop.profit.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div style={{ padding: "24px" }}>
                      <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>Cost Breakdown (per acre)</h5>
                      
                      {/* Cost Categories */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {/* Seeds */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(16, 185, 129, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(16, 185, 129, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>🌱</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Seeds</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>High-quality certified seeds</div>
                            </div>
                          </div>
                          <div style={{ color: "#059669", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.seeds.toLocaleString()}
                          </div>
                        </div>

                        {/* Fertilizers */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(59, 130, 246, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(59, 130, 246, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>🌿</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Fertilizers</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>NPK and organic fertilizers</div>
                            </div>
                          </div>
                          <div style={{ color: "#1d4ed8", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.fertilizers.toLocaleString()}
                          </div>
                        </div>

                        {/* Pesticides */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(239, 68, 68, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(239, 68, 68, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>🛡️</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Pesticides</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Crop protection chemicals</div>
                            </div>
                          </div>
                          <div style={{ color: "#dc2626", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.pesticides.toLocaleString()}
                          </div>
                        </div>

                        {/* Irrigation */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(6, 182, 212, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(6, 182, 212, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>💧</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Irrigation</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Water management systems</div>
                            </div>
                          </div>
                          <div style={{ color: "#0891b2", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.irrigation.toLocaleString()}
                          </div>
                        </div>

                        {/* Labor */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(245, 158, 11, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(245, 158, 11, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>👨‍🌾</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Labor</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Manual and skilled labor</div>
                            </div>
                          </div>
                          <div style={{ color: "#d97706", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.labor.toLocaleString()}
                          </div>
                        </div>

                        {/* Machinery */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(107, 114, 128, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(107, 114, 128, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>🚜</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Machinery</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Equipment and implements</div>
                            </div>
                          </div>
                          <div style={{ color: "#6b7280", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.machinery.toLocaleString()}
                          </div>
                        </div>

                        {/* Transportation */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(168, 85, 247, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(168, 85, 247, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>🚚</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Transportation</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Input delivery and output transport</div>
                            </div>
                          </div>
                          <div style={{ color: "#9333ea", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.transportation.toLocaleString()}
                          </div>
                        </div>

                        {/* Miscellaneous */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "rgba(156, 163, 175, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(156, 163, 175, 0.1)"
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 20 }}>📋</span>
                            <div>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14 }}>Miscellaneous</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Other expenses and contingencies</div>
                            </div>
                          </div>
                          <div style={{ color: "#9ca3af", fontWeight: 600, fontSize: 14 }}>
                            ₹{crop.costBreakdown.miscellaneous.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Summary Section */}
                      <div style={{
                        marginTop: 20,
                        padding: "16px",
                        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                        borderRadius: 12,
                        border: "1px solid rgba(245, 158, 11, 0.2)"
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                          <div>
                            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>Total Cost</div>
                            <div style={{ color: "#dc2626", fontSize: 18, fontWeight: 700 }}>
                              ₹{crop.totalCost.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>Expected Revenue</div>
                            <div style={{ color: "#059669", fontSize: 18, fontWeight: 700 }}>
                              ₹{crop.totalRevenue.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>Net Profit</div>
                            <div style={{ 
                              color: crop.profit >= 0 ? "#059669" : "#dc2626", 
                              fontSize: 18, 
                              fontWeight: 700 
                            }}>
                              ₹{crop.profit.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: "rgba(245, 158, 11, 0.05)",
                borderRadius: 12,
                border: "1px solid rgba(245, 158, 11, 0.1)",
                textAlign: "center"
              }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
                  💡 <strong>Tip:</strong> Compare costs across different crops to identify the most profitable options for your farm. 
                  Consider local market conditions and your available resources when making decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equipment Guide Modal */}
      {showEquipmentGuide && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 1200,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>🚜 Equipment Guide</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Farming equipment recommendations based on your crop and location</p>
              </div>
              <button
                onClick={() => setShowEquipmentGuide(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>

            <div style={{ padding: 32 }}>
              {/* Introduction Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(245, 158, 11, 0.2)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Equipment Recommendations</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Our AI recommends the best equipment for your specific crop and farming conditions. 
                  This includes machinery, implements, and other tools tailored to your needs.
                </p>
              </div>

              {/* Equipment Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 24
              }}>
                {equipmentList.map((eq, idx) => (
                  <div key={idx} style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease"
                  }}>
                    <div style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      padding: "20px 24px",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <span style={{ fontSize: 32 }}>{eq.icon}</span>
                        <div>
                          <h4 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", margin: 0 }}>{eq.name}</h4>
                          <div style={{ color: "#64748b", fontSize: 14 }}>{eq.category}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: 24 }}>
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ color: "#64748b", fontSize: 13 }}>Price Range:</span>
                        <div style={{ color: "#1e293b", fontWeight: 500 }}>{eq.priceRange}</div>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ color: "#64748b", fontSize: 13 }}>Features:</span>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {eq.features.map((f, i) => (
                            <li key={i} style={{ color: "#64748b", fontSize: 14 }}>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ color: "#64748b", fontSize: 13 }}>Suitable For:</span>
                        <div style={{ color: "#059669", fontWeight: 500 }}>{eq.suitableFor.join(", ")}</div>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", fontSize: 13 }}>Maintenance:</span>
                        <div style={{ color: "#d97706", fontWeight: 500 }}>{eq.maintenance}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: "rgba(245, 158, 11, 0.05)",
                borderRadius: 12,
                border: "1px solid rgba(245, 158, 11, 0.1)",
                textAlign: "center"
              }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
                  💡 <strong>Tip:</strong> Consider your local climate, soil conditions, and market demand when choosing equipment. 
                  These recommendations are based on general conditions and may vary by specific location.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Irrigation Advice Modal */}
      {showIrrigationAdvice && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 900,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>💧 Irrigation Advice</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Smart, crop-specific water management recommendations</p>
              </div>
              <button
                onClick={() => setShowIrrigationAdvice(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>
            <div style={{ padding: 32 }}>
              {/* Types of Irrigation Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(56, 189, 248, 0.08) 0%, rgba(14, 165, 233, 0.08) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(56, 189, 248, 0.15)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Types of Irrigation</h3>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: 20
                }}>
                  {irrigationTypes.map((type, idx) => (
                    <div key={idx} style={{
                      background: "#fff",
                      borderRadius: 14,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(56, 189, 248, 0.07)",
                      padding: 20,
                      display: "flex",
                      flexDirection: "column",
                      gap: 10
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                        <span style={{ fontSize: 28 }}>{type.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 18, color: "#0ea5e9" }}>{type.name}</span>
                      </div>
                      <div style={{ color: "#64748b", fontSize: 14, marginBottom: 4 }}><b>Cost:</b> {type.cost}</div>
                      <div style={{ color: "#059669", fontSize: 14, marginBottom: 4 }}><b>Best for:</b> {type.suitableCrops.join(", ")}</div>
                      <div style={{ color: "#1e293b", fontSize: 14, marginBottom: 4 }}><b>Advantages:</b>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {type.advantages.map((adv, i) => <li key={i} style={{ color: "#059669" }}>{adv}</li>)}
                        </ul>
                      </div>
                      <div style={{ color: "#dc2626", fontSize: 14, marginBottom: 4 }}><b>Disadvantages:</b>
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {type.disadvantages.map((dis, i) => <li key={i} style={{ color: "#dc2626" }}>{dis}</li>)}
                        </ul>
                      </div>
                      <div style={{ color: "#64748b", fontSize: 13 }}><b>Notes:</b> {type.notes}</div>
                    </div>
                  ))}
                </div>
              </div>
              {/* More detailed, crop/region-specific advice will be added next */}
            </div>
          </div>
        </div>
      )}

      {/* Yield Prediction Modal */}
      {showYieldPrediction && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 1200,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>📈 Yield Prediction</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>AI-powered yield forecasting based on crop, weather, and management factors</p>
              </div>
              <button
                onClick={() => setShowYieldPrediction(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>

            <div style={{ padding: 32 }}>
              {/* Introduction Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(16, 185, 129, 0.2)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Smart Yield Forecasting</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Our AI analyzes multiple factors including weather patterns, soil conditions, crop variety, and management practices 
                  to provide accurate yield predictions. These predictions help in planning harvest, storage, and marketing strategies.
                </p>
              </div>

              {/* Yield Predictions Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: 24
              }}>
                {cropsWithEconomics.map((crop, index) => {
                  // Calculate predicted yield based on various factors
                  const baseYield = crop.yieldPerAcre;
                  const weatherFactor = 0.95; // Simulated weather impact
                  const soilFactor = 1.02; // Simulated soil quality impact
                  const managementFactor = 1.05; // Simulated management practices impact
                  const predictedYield = Math.round(baseYield * weatherFactor * soilFactor * managementFactor);
                  const confidence = Math.floor(Math.random() * 20) + 80; // 80-100% confidence
                  
                  return (
                    <div key={index} style={{
                      background: "#fff",
                      borderRadius: 16,
                      border: "1px solid #e2e8f0",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                    }}
                    >
                      {/* Crop Header */}
                      <div style={{
                        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                        padding: "20px 24px",
                        borderBottom: "1px solid #e2e8f0"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                          <div>
                            <h4 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                              {crop.icon} {crop.name}
                            </h4>
                            <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{crop.description}</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{
                              background: confidence >= 90 ? "rgba(16, 185, 129, 0.1)" : 
                                         confidence >= 80 ? "rgba(245, 158, 11, 0.1)" : "rgba(239, 68, 68, 0.1)",
                              color: confidence >= 90 ? "#059669" : 
                                     confidence >= 80 ? "#d97706" : "#dc2626",
                              padding: "4px 12px",
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: 600
                            }}>
                              {confidence}% Confidence
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Yield Prediction Details */}
                      <div style={{ padding: "24px" }}>
                        {/* Prediction Summary */}
                        <div style={{ marginBottom: 20 }}>
                          <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Yield Prediction (per acre)</h5>
                          <div style={{
                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)",
                            borderRadius: 12,
                            padding: 16,
                            border: "1px solid rgba(16, 185, 129, 0.2)"
                          }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                              <div>
                                <span style={{ color: "#64748b", fontSize: 13 }}>Historical Average:</span>
                                <div style={{ color: "#1e293b", fontWeight: 600 }}>{baseYield} {crop.name === "Vegetables" || crop.name === "Fruits" ? "tons" : "quintals"}</div>
                              </div>
                              <div>
                                <span style={{ color: "#64748b", fontSize: 13 }}>Predicted Yield:</span>
                                <div style={{ color: "#059669", fontWeight: 600, fontSize: 18 }}>
                                  {predictedYield} {crop.name === "Vegetables" || crop.name === "Fruits" ? "tons" : "quintals"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Factors Affecting Yield */}
                        <div style={{ marginBottom: 20 }}>
                          <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Factors Affecting Yield</h5>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div style={{
                              padding: "12px",
                              background: "rgba(59, 130, 246, 0.05)",
                              borderRadius: 8,
                              border: "1px solid rgba(59, 130, 246, 0.1)"
                            }}>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Weather Conditions</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Optimal rainfall and temperature patterns</div>
                            </div>
                            <div style={{
                              padding: "12px",
                              background: "rgba(245, 158, 11, 0.05)",
                              borderRadius: 8,
                              border: "1px solid rgba(245, 158, 11, 0.1)"
                            }}>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Soil Quality</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Good soil fertility and structure</div>
                            </div>
                            <div style={{
                              padding: "12px",
                              background: "rgba(16, 185, 129, 0.05)",
                              borderRadius: 8,
                              border: "1px solid rgba(16, 185, 129, 0.1)"
                            }}>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Management Practices</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Timely operations and proper care</div>
                            </div>
                            <div style={{
                              padding: "12px",
                              background: "rgba(168, 85, 247, 0.05)",
                              borderRadius: 8,
                              border: "1px solid rgba(168, 85, 247, 0.1)"
                            }}>
                              <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Pest & Disease Control</div>
                              <div style={{ color: "#64748b", fontSize: 12 }}>Effective protection measures</div>
                            </div>
                          </div>
                        </div>

                        {/* Optimization Tips */}
                        <div style={{
                          background: "rgba(245, 158, 11, 0.05)",
                          borderRadius: 12,
                          padding: 16,
                          border: "1px solid rgba(245, 158, 11, 0.1)"
                        }}>
                          <h6 style={{ color: "#1e293b", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>💡 Yield Optimization Tips</h6>
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Use high-quality seeds and optimal spacing</li>
                            <li style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Apply balanced fertilizers based on soil testing</li>
                            <li style={{ color: "#64748b", fontSize: 13, marginBottom: 4 }}>Implement proper irrigation scheduling</li>
                            <li style={{ color: "#64748b", fontSize: 13 }}>Monitor and control pests/diseases early</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: "rgba(16, 185, 129, 0.05)",
                borderRadius: 12,
                border: "1px solid rgba(16, 185, 129, 0.1)",
                textAlign: "center"
              }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
                  💡 <strong>Note:</strong> Yield predictions are based on historical data and current conditions. 
                  Actual yields may vary due to unforeseen weather events or management changes. 
                  Regular monitoring and adaptive management are recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Government Schemes Modal */}
      {showGovernmentSchemes && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 1200,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>🏛️ Government Schemes</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Subsidies and support programs for farmers</p>
              </div>
              <button
                onClick={() => setShowGovernmentSchemes(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>

            <div style={{ padding: 32 }}>
              {/* Introduction Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(245, 158, 11, 0.2)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Government Support for Farmers</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  The Government of India offers various schemes and subsidies to support farmers and improve agricultural productivity. 
                  These programs provide financial assistance, technical support, and infrastructure development.
                </p>
              </div>

              {/* Schemes Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                gap: 24
              }}>
                {governmentSchemes.map((scheme, index) => (
                  <div key={index} style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                  >
                    {/* Scheme Header */}
                    <div style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      padding: "20px 24px",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <h4 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                            {scheme.icon} {scheme.name}
                          </h4>
                          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>{scheme.fullName}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            background: scheme.status === "Active" ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                            color: scheme.status === "Active" ? "#059669" : "#dc2626",
                            padding: "4px 12px",
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600
                          }}>
                            {scheme.status}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scheme Details */}
                    <div style={{ padding: "24px" }}>
                      <div style={{ marginBottom: 20 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Description</h5>
                        <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.5, margin: 0 }}>{scheme.description}</p>
                      </div>

                      {/* Benefits */}
                      <div style={{ marginBottom: 20 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Key Benefits</h5>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {scheme.benefits.map((benefit, idx) => (
                            <li key={idx} style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Eligibility */}
                      <div style={{ marginBottom: 20 }}>
                        <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Eligibility Criteria</h5>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {scheme.eligibility.map((criteria, idx) => (
                            <li key={idx} style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Application Info */}
                      <div style={{
                        background: "rgba(245, 158, 11, 0.05)",
                        borderRadius: 12,
                        padding: 16,
                        border: "1px solid rgba(245, 158, 11, 0.1)"
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                          <div>
                            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>Application Process</div>
                            <div style={{ color: "#1e293b", fontSize: 14, fontWeight: 500 }}>{scheme.applicationProcess}</div>
                          </div>
                          <div>
                            <div style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>Official Website</div>
                            <div style={{ color: "#16a34a", fontSize: 14, fontWeight: 500 }}>{scheme.website}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: "rgba(245, 158, 11, 0.05)",
                borderRadius: 12,
                border: "1px solid rgba(245, 158, 11, 0.1)",
                textAlign: "center"
              }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
                  💡 <strong>Important:</strong> Always verify scheme details from official government websites before applying. 
                  Scheme benefits and eligibility criteria may vary by state and are subject to change.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Harvest Planning Modal */}
      {showHarvestPlanning && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 1200,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>🌾 Harvest Planning</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Optimal harvest timing, storage, and post-harvest management strategies</p>
              </div>
              <button
                onClick={() => setShowHarvestPlanning(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>

            <div style={{ padding: 32 }}>
              {/* Introduction Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(245, 158, 11, 0.2)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Harvest Planning Tips</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Our AI provides insights into optimal harvest timing, storage conditions, and post-harvest management strategies for your crops.
                </p>
              </div>

              {/* Tips Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: 24
              }}>
                {harvestPlanningData.crops.map((crop, index) => (
                  <div key={index} style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                  >
                    {/* Crop Header */}
                    <div style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      padding: "20px 24px",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <h4 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                            {crop.icon} {crop.name}
                          </h4>
                          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Harvest Planning Guide</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            background: "rgba(245, 158, 11, 0.1)",
                            color: "#d97706",
                            padding: "6px 12px",
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 4
                          }}>
                            Optimal Harvest Period: {crop.harvestTiming.optimal}
                          </div>
                          <div style={{
                            background: "rgba(16, 185, 129, 0.1)",
                            color: "#059669",
                            padding: "6px 12px",
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 4
                          }}>
                            Storage Conditions: {crop.storage.conditions}
                          </div>
                          <div style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#dc2626",
                            padding: "6px 12px",
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 4
                          }}>
                            Market Analysis: {crop.marketAnalysis.peakPrices}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tips Section */}
                    <div style={{ padding: "24px" }}>
                      <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>General Tips</h5>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {harvestPlanningData.generalTips.timing.map((tip, index) => (
                          <li key={index} style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>{tip}</li>
                        ))}
                      </ul>
                      <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12, marginTop: 20 }}>Equipment Tips</h5>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {harvestPlanningData.generalTips.equipment.map((tip, index) => (
                          <li key={index} style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>{tip}</li>
                        ))}
                      </ul>
                      <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12, marginTop: 20 }}>Labor Tips</h5>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {harvestPlanningData.generalTips.labor.map((tip, index) => (
                          <li key={index} style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: "rgba(245, 158, 11, 0.05)",
                borderRadius: 12,
                border: "1px solid rgba(245, 158, 11, 0.1)",
                textAlign: "center"
              }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
                  💡 <strong>Tip:</strong> Consider your local climate, soil conditions, and market demand when planning your harvest. 
                  These strategies are based on general conditions and may need adjustments for specific locations.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weather Updates Modal */}
      {showWeatherUpdates && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            maxWidth: 1200,
            width: "100%",
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              color: "#fff",
              padding: "24px 32px",
              borderRadius: "24px 24px 0 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h2 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>🌤️ Weather Updates</h2>
                <p style={{ margin: "8px 0 0 0", opacity: 0.9 }}>Real-time weather data, forecasts, and farming-specific weather alerts</p>
              </div>
              <button
                onClick={() => setShowWeatherUpdates(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: 8,
                  width: 40,
                  height: 40,
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >×</button>
            </div>

            <div style={{ padding: 32 }}>
              {/* Weather Data Section */}
              <div style={{
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)",
                borderRadius: 16,
                padding: 24,
                marginBottom: 32,
                border: "1px solid rgba(245, 158, 11, 0.2)"
              }}>
                <h3 style={{ color: "#1e293b", fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Weather Information</h3>
                <p style={{ color: "#64748b", lineHeight: 1.6, margin: 0 }}>
                  Our AI provides real-time weather data, forecasts, and alerts tailored to your specific crop and farming conditions.
                </p>
              </div>

              {/* Weather Data Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: 24
              }}>
                {weatherData.cropSpecificWeather.map((crop, index) => (
                  <div key={index} style={{
                    background: "#fff",
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.05)";
                  }}
                  >
                    {/* Crop Header */}
                    <div style={{
                      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
                      padding: "20px 24px",
                      borderBottom: "1px solid #e2e8f0"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <h4 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>
                            {crop.icon} {crop.crop}
                          </h4>
                          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>Harvest Planning Guide</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{
                            background: crop.currentStatus === "Optimal" ? "rgba(16, 185, 129, 0.1)" : 
                                        crop.currentStatus === "Good" ? "rgba(59, 130, 246, 0.1)" : "rgba(245, 158, 11, 0.1)",
                            color: crop.currentStatus === "Optimal" ? "#059669" : 
                                   crop.currentStatus === "Good" ? "#2563eb" : "#d97706",
                            padding: "6px 12px",
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 600,
                            marginBottom: 4
                          }}>
                            Status: {crop.currentStatus}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weather Data Details */}
                    <div style={{ padding: "24px" }}>
                      <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12 }}>Optimal Conditions</h5>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div style={{
                          padding: "12px",
                          background: "rgba(59, 130, 246, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(59, 130, 246, 0.1)"
                        }}>
                          <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Temperature</div>
                          <div style={{ color: "#64748b", fontSize: 12 }}>{crop.optimalConditions.temperature}</div>
                        </div>
                        <div style={{
                          padding: "12px",
                          background: "rgba(245, 158, 11, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(245, 158, 11, 0.1)"
                        }}>
                          <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Humidity</div>
                          <div style={{ color: "#64748b", fontSize: 12 }}>{crop.optimalConditions.humidity}</div>
                        </div>
                        <div style={{
                          padding: "12px",
                          background: "rgba(16, 185, 129, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(16, 185, 129, 0.1)"
                        }}>
                          <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Rainfall</div>
                          <div style={{ color: "#64748b", fontSize: 12 }}>{crop.optimalConditions.rainfall}</div>
                        </div>
                        <div style={{
                          padding: "12px",
                          background: "rgba(168, 85, 247, 0.05)",
                          borderRadius: 8,
                          border: "1px solid rgba(168, 85, 247, 0.1)"
                        }}>
                          <div style={{ color: "#1e293b", fontWeight: 500, fontSize: 14, marginBottom: 4 }}>Wind Speed</div>
                          <div style={{ color: "#64748b", fontSize: 12 }}>{crop.optimalConditions.windSpeed}</div>
                        </div>
                      </div>
                      
                      <h5 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 12, marginTop: 20 }}>Recommendations</h5>
                      <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {crop.recommendations.map((rec, idx) => (
                          <li key={idx} style={{ color: "#64748b", fontSize: 14, marginBottom: 6 }}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div style={{
                marginTop: 32,
                padding: 20,
                background: "rgba(245, 158, 11, 0.05)",
                borderRadius: 12,
                border: "1px solid rgba(245, 158, 11, 0.1)",
                textAlign: "center"
              }}>
                <p style={{ color: "#64748b", margin: 0, fontSize: 14 }}>
                  💡 <strong>Tip:</strong> Stay informed about weather conditions and adjust your farming strategies accordingly. 
                  These insights help in planning harvest, storage, and marketing strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Button (above Support) */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '48px 0 0 0' }}>
        <button
          style={{
            minWidth: 180,
            padding: '16px 32px',
            background: 'transparent',
            color: '#16a34a',
            border: '2px solid #16a34a',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 22,
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(34,197,94,0.08)';
            e.currentTarget.style.borderColor = '#22c55e';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#16a34a';
          }}
          onClick={() => setShowAdminLogin(true)}
        >
          Admin Login
        </button>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            animation: "fadeIn 0.2s"
          }}
          onClick={e => {
            if (e.target === e.currentTarget) setShowAdminLogin(false);
          }}
        >
          <form
            onSubmit={e => {
              e.preventDefault();
              setAdminLoginStatus("loading");
              setTimeout(() => {
                if (adminUsername === "arnavgarhwal" && adminPassword === "@Ag12345") {
                  setAdminLoginStatus("success");
                  setTimeout(() => {
                    setShowAdminLogin(false);
                    navigate('/admin-dashboard');
                  }, 1000);
                } else {
                  setAdminLoginStatus("error");
                }
              }, 1200);
            }}
            style={{
              background: "rgba(255,255,255,0.95)",
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(34,197,94,0.18)",
              minWidth: 350,
              maxWidth: 400,
              width: "100%",
              padding: "40px 32px 32px 32px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 28,
              animation: "slideIn 0.3s"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setShowAdminLogin(false)}
              style={{
                position: "absolute",
                top: 18,
                right: 18,
                background: "rgba(34,197,94,0.08)",
                border: "none",
                borderRadius: 8,
                width: 32,
                height: 32,
                color: "#16a34a",
                fontSize: 22,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >×</button>
            {/* Monkey Icon */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 48, display: "inline-block" }}>🐵</span>
            </div>
            <h2 style={{ color: "#16a34a", fontWeight: 700, fontSize: 26, textAlign: "center", margin: 0 }}>Admin Login</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <input
                type="text"
                placeholder="Username or Email"
                value={adminUsername}
                onChange={e => {
                  setAdminUsername(e.target.value);
                  setAdminLoginStatus("idle");
                }}
                style={{
                  width: "100%",
                  height: 48,
                  border: "2px solid #16a34a22",
                  fontSize: 16,
                  fontWeight: 500,
                  borderRadius: 12,
                  padding: "0 16px",
                  background: "rgba(255,255,255,0.9)",
                  color: "#16a34a",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                required
                autoFocus
              />
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={adminPassword}
                  onChange={e => {
                    setAdminPassword(e.target.value);
                    setAdminLoginStatus("idle");
                  }}
                  style={{
                    width: "100%",
                    height: 48,
                    border: "2px solid #16a34a22",
                    fontSize: 16,
                    fontWeight: 500,
                    borderRadius: 12,
                    padding: "0 44px 0 16px",
                    background: "rgba(255,255,255,0.9)",
                    color: "#16a34a",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }}
                  required
                />
                <MonkeyEyeToggle visible={showPassword} onClick={() => setShowPassword(v => !v)} />
              </div>
            </div>
            {adminLoginStatus === "error" && (
              <div style={{ color: "#ef4444", fontWeight: 600, textAlign: "center", marginTop: -10 }}>
                Invalid credentials. Try again!
              </div>
            )}
            <button
              type="submit"
              disabled={adminLoginStatus === "loading"}
              style={{
                height: 48,
                background: adminLoginStatus === "loading"
                  ? "rgba(34,197,94,0.3)"
                  : "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 700,
                cursor: adminLoginStatus === "loading" ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                boxShadow: adminLoginStatus === "loading" ? "none" : "0 4px 12px rgba(34,197,94,0.3)"
              }}
            >
              {adminLoginStatus === "loading"
                ? "Logging in..."
                : adminLoginStatus === "success"
                ? "Success!"
                : "Login"}
            </button>
          </form>
        </div>
      )}

      {/* Support Section */}
      <div style={{
        margin: '64px auto 0',
        maxWidth: 700,
        padding: '32px 16px 0 16px',
        textAlign: 'center',
      }}>
        <h2 style={{ color: '#22c55e', fontWeight: 700, fontSize: 32, marginBottom: 16 }}>Support</h2>
        <p style={{ color: '#64748b', fontSize: 20, marginBottom: 32 }}>
          Have questions or need help? Our support team is here for you.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 48, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 20, marginBottom: 8 }}>Email Us</div>
            <div style={{ color: '#16a34a', fontSize: 18, fontWeight: 500 }}>support@intellifarmsystems.com</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1e293b', fontSize: 20, marginBottom: 8 }}>Call Us</div>
            <div style={{ color: '#64748b', fontSize: 18, fontWeight: 500 }}>+91-123-456-7890</div>
          </div>
        </div>
      </div>

      {showNearbyMarketplace && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 24,
            width: "90vw",
            maxWidth: 900,
            maxHeight: "90vh",
            overflow: "auto",
            padding: 32,
            position: "relative",
            display: "flex",
            flexDirection: "column"
          }}>
            <button onClick={() => setShowNearbyMarketplace(false)} style={{ position: "absolute", top: 16, right: 16, background: "#eee", border: "none", borderRadius: 8, width: 36, height: 36, fontSize: 22, cursor: "pointer" }}>×</button>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Nearby Marketplace / Mandi</h2>
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Search markets..."
                value={marketSearch}
                onChange={e => setMarketSearch(e.target.value)}
                style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
              />
              <select
                value={marketCategory}
                onChange={e => setMarketCategory(e.target.value)}
                style={{ padding: 10, borderRadius: 8, border: "1px solid #ccc", fontSize: 16 }}
              >
                {marketCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              {filteredMarkets.map((market, idx) => (
                <div key={idx} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 20, background: "#f9fafb", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 20 }}>{market.name}</div>
                  <div style={{ color: "#16a34a", fontWeight: 600 }}>{market.distance}</div>
                  <div style={{ color: "#64748b" }}>Category: {market.category}</div>
                  <a href={market.link} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", marginTop: 8, textDecoration: "underline", fontWeight: 500 }}>View Details</a>
                </div>
              ))}
              {filteredMarkets.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#64748b" }}>No markets found.</div>}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

const RootApp = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  </Router>
);

export default RootApp;
