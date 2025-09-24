import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function GET(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const data = await upstreamJSON("POST", "api/v8/packages/balance-and-credit", { is_enterprise: false }, idToken);
  return NextResponse.json(data);
}
