import { NextResponse } from "next/server";
import { ciamSubmitOTP } from "@/lib/server-fetch";

export async function POST(req: Request){
  const { subscriber_id, otp } = await req.json();
  if(!subscriber_id || !otp) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const data = await ciamSubmitOTP(subscriber_id, otp);
  return NextResponse.json(data);
}
