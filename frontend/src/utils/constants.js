// ==========================================
// APP NAME
// ==========================================
export const APP_NAME =
  "Scrapify";


// ==========================================
// API BASE URL
// ==========================================
export const API_BASE_URL =
  "http://localhost:5000/api";


// ==========================================
// USER ROLES
// ==========================================
export const USER_ROLES = {
  USER: "user",

  COLLECTOR: "collector",

  ADMIN: "admin",
};


// ==========================================
// PICKUP STATUS
// ==========================================
export const PICKUP_STATUS = {
  PENDING: "Pending",

  IN_PROGRESS: "In Progress",

  COMPLETED: "Completed",

  CANCELLED: "Cancelled",
};


// ==========================================
// REWARD TYPES
// ==========================================
export const REWARD_TYPES = [
  "Cashback",

  "Coupon",

  "Gift Card",

  "Eco Badge",

  "Discount",
];


// ==========================================
// SCRAP MATERIALS
// ==========================================
export const SCRAP_MATERIALS = [
  "Plastic",

  "Paper",

  "Iron",

  "Glass",

  "E-Waste",
];


// ==========================================
// SCRAP RATES (PER KG)
// ==========================================
export const SCRAP_RATES = {
  Plastic: 28,

  Paper: 12,

  Iron: 45,

  Glass: 10,

  "E-Waste": 85,
};


// ==========================================
// REWARD POINTS
// ==========================================
export const REWARD_POINTS = {
  Plastic: 10,

  Paper: 5,

  Iron: 15,

  Glass: 8,

  "E-Waste": 25,
};


// ==========================================
// LOCAL STORAGE KEYS
// ==========================================
export const STORAGE_KEYS = {
  TOKEN: "token",

  USER: "user",
};


// ==========================================
// ROUTES
// ==========================================
export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",

  REGISTER: "/register",

  DASHBOARD: "/dashboard",

  PICKUP: "/schedule-pickup",

  TRACK: "/track-pickup",

  HISTORY: "/pickup-history",

  REWARDS: "/green-points",
};