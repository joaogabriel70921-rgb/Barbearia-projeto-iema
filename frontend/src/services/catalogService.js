import { http } from "./http.js";

// ── Adaptadores: convertem o shape do backend para o shape que as telas usam ──
export function adaptService(s) {
  return {
    id: s._id,
    name: s.name,
    description: s.description || "",
    duration: s.duration,
    price: s.price,
    iconName: s.iconName || "scissors",
    active: s.active !== false,
  };
}

export function adaptBarber(e) {
  return {
    id: e._id,
    name: e.userId?.name || "Barbeiro",
    specialty: e.position || e.specialties?.[0] || "Barbeiro",
    image: e.photo || "",
    specialties: e.specialties || [],
    instagram: e.socialLinks?.instagram || "",
    youtube: e.socialLinks?.youtube || "",
    availableToday: ["online", "trabalhando"].includes(e.status),
    nextAvailable: "",
  };
}

export const catalogService = {
  listServices: async () => {
    const body = await http.get("/catalog/services");
    return (body.data || []).map(adaptService);
  },
  getService: async (id) => adaptService((await http.get(`/catalog/services/${id}`)).data),
  listBarbers: async () => {
    const body = await http.get("/catalog/employees");
    return (body.data || []).map(adaptBarber);
  },
  getBarber: async (id) => adaptBarber((await http.get(`/catalog/employees/${id}`)).data),
  // slots disponíveis: GET /catalog/availability?employeeId=&date=YYYY-MM-DD -> string[]
  getAvailability: async (employeeId, date) => {
    const body = await http.get("/catalog/availability", { params: { employeeId, date } });
    return body.data || [];
  },
};
