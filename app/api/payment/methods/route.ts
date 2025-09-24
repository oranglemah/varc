import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function POST(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const body = await req.json();
  const data = await upstreamJSON("POST", "payments/api/v8/payment-methods-option", body, idToken);
  return NextResponse.json(data);
}
