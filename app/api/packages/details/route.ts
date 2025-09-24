import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function GET(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const optionCode = searchParams.get("option_code");
  if(!optionCode) return NextResponse.json({ error: "option_code required" }, { status: 400 });
  const data = await upstreamJSON("POST", "api/v8/packages/details", { package_option_code: optionCode, lang: "en", is_enterprise: false }, idToken);
  return NextResponse.json(data);
}
