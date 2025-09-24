import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function GET(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if(!code) return NextResponse.json({ error: "code required" }, { status: 400 });
  const data = await upstreamJSON("POST", "api/v8/packages/family", { family_code: code, is_enterprise: false, lang: "en" }, idToken);
  return NextResponse.json(data);
}
