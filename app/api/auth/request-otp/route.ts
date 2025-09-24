import { NextResponse } from "next/server";
import { ciamRequestOTP } from "@/lib/server-fetch";

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const msisdn = searchParams.get("msisdn");
  if(!msisdn) return NextResponse.json({ error: "msisdn required" }, { status: 400 });
  const data = await ciamRequestOTP(msisdn);
  return NextResponse.json(data);
}
