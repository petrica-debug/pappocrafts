import { createHash, randomBytes } from "crypto";

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
export type AdminRole = "superadmin" | "admin";

export interface StoredOrder {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    notes: string;
  };
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    artisan: string;
    country: string;
  }[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "online" | "later";
  paymentStatus: "pending" | "paid" | "refunded";
  status: OrderStatus;
  region: string;
  shippingZone: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminUser {
  email: string;
  passwordHash: string;
  role: AdminRole;
  name: string;
}

interface Session {
  token: string;
  email: string;
  role: AdminRole;
  name: string;
  createdAt: number;
}

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

const ADMIN_USERS: AdminUser[] = [
  {
    email: "petrica@redi-ngo.eu",
    passwordHash: sha256("Ppapadie83*"),
    role: "superadmin",
    name: "Petrica",
  },
  {
    email: "richard@redi-ngo.eu",
    passwordHash: sha256("Welcome2REDI*"),
    role: "admin",
    name: "Richard",
  },
];

const orders: Map<string, StoredOrder> = new Map();
const sessions: Map<string, Session> = new Map();

export function authenticate(email: string, password: string): Session | null {
  const user = ADMIN_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === sha256(password)
  );
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  const session: Session = {
    token,
    email: user.email,
    role: user.role,
    name: user.name,
    createdAt: Date.now(),
  };
  sessions.set(token, session);
  return session;
}

export function validateSession(token: string): Session | null {
  const session = sessions.get(token);
  if (!session) return null;
  const maxAge = 24 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > maxAge) {
    sessions.delete(token);
    return null;
  }
  return session;
}

export function logout(token: string): void {
  sessions.delete(token);
}

export function addOrder(order: StoredOrder): void {
  orders.set(order.id, order);
}

export function getOrder(id: string): StoredOrder | undefined {
  return orders.get(id);
}

export function getAllOrders(): StoredOrder[] {
  return Array.from(orders.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function updateOrderStatus(id: string, status: OrderStatus): StoredOrder | null {
  const order = orders.get(id);
  if (!order) return null;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  if (status === "cancelled") order.paymentStatus = "refunded";
  return order;
}

export function updatePaymentStatus(
  id: string,
  paymentStatus: "pending" | "paid" | "refunded"
): StoredOrder | null {
  const order = orders.get(id);
  if (!order) return null;
  order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();
  return order;
}

export function deleteOrder(id: string): boolean {
  return orders.delete(id);
}

export function getStats() {
  const all = getAllOrders();
  const now = new Date();
  const thisMonth = all.filter((o) => {
    const d = new Date(o.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const today = all.filter(
    (o) => new Date(o.createdAt).toDateString() === now.toDateString()
  );

  const totalRevenue = all
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const monthlyRevenue = thisMonth
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total, 0);
  const paidOrders = all.filter((o) => o.paymentStatus === "paid");
  const pendingPayments = all.filter(
    (o) => o.paymentStatus === "pending" && o.status !== "cancelled"
  );

  const statusCounts: Record<string, number> = {};
  for (const o of all) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  }

  const countryCounts: Record<string, number> = {};
  for (const o of all) {
    const c = o.customer.country || "Unknown";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  }

  const avgOrderValue = all.length > 0 ? totalRevenue / all.filter((o) => o.status !== "cancelled").length : 0;

  return {
    totalOrders: all.length,
    todayOrders: today.length,
    monthlyOrders: thisMonth.length,
    totalRevenue,
    monthlyRevenue,
    avgOrderValue: avgOrderValue || 0,
    paidCount: paidOrders.length,
    pendingPaymentCount: pendingPayments.length,
    statusCounts,
    countryCounts,
    payOnlineCount: all.filter((o) => o.paymentMethod === "online").length,
    payLaterCount: all.filter((o) => o.paymentMethod === "later").length,
  };
}
