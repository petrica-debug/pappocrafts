import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  artisan: string;
  country: string;
}

interface OrderPayload {
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
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "online" | "later";
  region: string;
  shippingZone: string;
  currency: string;
}

function generateOrderId(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, "0");
  const d = now.getDate().toString().padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `PC-${y}${m}${d}-${rand}`;
}

function buildEmailHtml(order: OrderPayload, orderId: string): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${item.artisan} (${item.country})</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:right;">€${(item.price * item.quantity).toFixed(2)}</td>
      </tr>`
    )
    .join("");

  const paymentLabel =
    order.paymentMethod === "online"
      ? '<span style="color:#4A9B3F;font-weight:600;">Online (Stripe)</span>'
      : '<span style="color:#E67E22;font-weight:600;">Pay Later (Cash / Bank Transfer)</span>';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2D2D2D;max-width:640px;margin:0 auto;padding:20px;">
  <div style="text-align:center;padding:24px 0;border-bottom:2px solid #4A9B3F;">
    <h1 style="margin:0;color:#4A9B3F;font-size:24px;">PappoCrafts</h1>
    <p style="margin:4px 0 0;color:#888;font-size:13px;">New Order Received</p>
  </div>

  <div style="background:#f9faf9;border-radius:8px;padding:16px;margin:20px 0;">
    <table style="width:100%;font-size:14px;">
      <tr><td style="padding:4px 0;color:#888;">Order ID</td><td style="padding:4px 0;font-weight:600;">${orderId}</td></tr>
      <tr><td style="padding:4px 0;color:#888;">Date</td><td style="padding:4px 0;">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td></tr>
      <tr><td style="padding:4px 0;color:#888;">Payment</td><td style="padding:4px 0;">${paymentLabel}</td></tr>
      <tr><td style="padding:4px 0;color:#888;">Region / Zone</td><td style="padding:4px 0;">${order.region} / ${order.shippingZone}</td></tr>
    </table>
  </div>

  <h2 style="font-size:16px;margin:24px 0 8px;color:#2D2D2D;">Customer Details</h2>
  <table style="width:100%;font-size:14px;">
    <tr><td style="padding:4px 0;color:#888;width:120px;">Name</td><td style="padding:4px 0;font-weight:600;">${order.customer.name}</td></tr>
    <tr><td style="padding:4px 0;color:#888;">Email</td><td style="padding:4px 0;"><a href="mailto:${order.customer.email}" style="color:#4A9B3F;">${order.customer.email}</a></td></tr>
    <tr><td style="padding:4px 0;color:#888;">Phone</td><td style="padding:4px 0;"><a href="tel:${order.customer.phone}" style="color:#4A9B3F;">${order.customer.phone}</a></td></tr>
    <tr><td style="padding:4px 0;color:#888;">Address</td><td style="padding:4px 0;">${order.customer.address}</td></tr>
    <tr><td style="padding:4px 0;color:#888;">City</td><td style="padding:4px 0;">${order.customer.city} ${order.customer.postalCode}</td></tr>
    <tr><td style="padding:4px 0;color:#888;">Country</td><td style="padding:4px 0;">${order.customer.country}</td></tr>
    ${order.customer.notes ? `<tr><td style="padding:4px 0;color:#888;">Notes</td><td style="padding:4px 0;"><em>${order.customer.notes}</em></td></tr>` : ""}
  </table>

  <h2 style="font-size:16px;margin:24px 0 8px;color:#2D2D2D;">Order Items</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <thead>
      <tr style="background:#f0f0f0;">
        <th style="padding:8px 12px;text-align:left;">Product</th>
        <th style="padding:8px 12px;text-align:center;">Qty</th>
        <th style="padding:8px 12px;text-align:left;">Artisan</th>
        <th style="padding:8px 12px;text-align:right;">Price</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <div style="margin-top:16px;padding:16px;background:#f9faf9;border-radius:8px;font-size:14px;">
    <table style="width:100%;">
      <tr><td style="padding:4px 0;color:#888;">Subtotal</td><td style="padding:4px 0;text-align:right;">€${order.subtotal.toFixed(2)}</td></tr>
      <tr><td style="padding:4px 0;color:#888;">Shipping</td><td style="padding:4px 0;text-align:right;">${order.shippingCost === 0 ? '<span style="color:#4A9B3F;">FREE</span>' : `€${order.shippingCost.toFixed(2)}`}</td></tr>
      <tr><td style="padding:8px 0 4px;font-weight:700;font-size:16px;border-top:2px solid #4A9B3F;">TOTAL</td><td style="padding:8px 0 4px;text-align:right;font-weight:700;font-size:16px;border-top:2px solid #4A9B3F;">€${order.total.toFixed(2)}</td></tr>
    </table>
  </div>

  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #eee;text-align:center;color:#aaa;font-size:12px;">
    <p>This email was sent automatically by PappoCrafts.</p>
  </div>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const order = (await request.json()) as OrderPayload;

    if (!order.customer?.name || !order.customer?.email || !order.customer?.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone number are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(order.customer.email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const phoneDigits = order.customer.phone.replace(/[\s\-\(\)\.]/g, "");
    if (phoneDigits.length < 8) {
      return NextResponse.json(
        { error: "Please enter a valid phone number (at least 8 digits)." },
        { status: 400 }
      );
    }

    if (!order.items || order.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    const orderId = generateOrderId();
    const resend = getResend();

    if (resend) {
      await resend.emails.send({
        from: "PappoCrafts Orders <onboarding@resend.dev>",
        to: ["petrica@redi-ngo.eu"],
        replyTo: order.customer.email,
        subject: `New Order ${orderId} — ${order.customer.name} (${order.paymentMethod === "online" ? "Paid Online" : "Pay Later"})`,
        html: buildEmailHtml(order, orderId),
      });
    }

    return NextResponse.json({
      success: true,
      orderId,
      message: resend
        ? "Order placed and notification sent."
        : "Order placed. (Email not configured — add RESEND_API_KEY)",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Order submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
