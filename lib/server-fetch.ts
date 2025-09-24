function baseHeaders() {
  return {
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": process.env.UA || "MEWeb/1.0",
    "Ax-Device-Id": process.env.AX_DEVICE_ID || "",
    "Ax-Fingerprint": process.env.AX_FP || "",
  } as Record<string,string>;
}

export async function upstreamJSON(
  method: "GET"|"POST",
  path: string,
  body?: any,
  idToken?: string
){
  const base = (process.env.BASE_API_URL||"").replace(/\/$/, "");
  const url = `${base}/${path.replace(/^\//, "")}`;
  const h: Record<string,string> = {
    ...baseHeaders(),
    "content-type": "application/json",
  };
  if(idToken){ h["Authorization"] = `Bearer ${idToken}`; }
  const resp = await fetch(url, { method, headers: h, body: body? JSON.stringify(body): undefined, cache: "no-store" });
  const text = await resp.text();
  try{ return JSON.parse(text); } catch{ return { raw: text, status: resp.status }; }
}

export async function ciamRequestOTP(msisdn: string){
  const base = (process.env.BASE_CIAM_URL||"").replace(/\/$/, "");
  const url = `${base}/realms/xl-ciam/auth/otp?msisdn=${encodeURIComponent(msisdn)}`;
  const h: Record<string,string> = {
    ...baseHeaders(),
    "Authorization": process.env.BASIC_AUTH || "",
  };
  const r = await fetch(url, { method: "GET", headers: h, cache: "no-store" });
  return r.json();
}

export async function ciamSubmitOTP(subscriber_id: string, otp: string){
  const base = (process.env.BASE_CIAM_URL||"").replace(/\/$/, "");
  const url = `${base}/realms/xl-ciam/protocol/openid-connect/token`;
  const form = new URLSearchParams({ grant_type: "password", subscriber_id, otp });
  const h: Record<string,string> = {
    ...baseHeaders(),
    "Authorization": process.env.BASIC_AUTH || "",
    "content-type": "application/x-www-form-urlencoded"
  };
  const r = await fetch(url, { method: "POST", headers: h, body: form, cache: "no-store" });
  return r.json();
}
