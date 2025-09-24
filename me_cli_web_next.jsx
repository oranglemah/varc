# Project: me-cli-web (Next.js 14 App Router)

> A web UI that mirrors the CLI flows (login OTP, profile/balance, list packages, bookmark, checkout via Multipayment/QRIS) using server-side Route Handlers that proxy to the underlying APIs. Secrets remain server-only and configurable via environment variables.

---

## File tree

```
me-cli-web/
  .env.example
  next.config.mjs
  package.json
  README.md
  tsconfig.json
  app/
    layout.tsx
    page.tsx
    globals.css
    (auth)/login/page.tsx
    dashboard/page.tsx
    bookmarks/page.tsx
    api/
      auth/request-otp/route.ts
      auth/submit-otp/route.ts
      auth/refresh/route.ts
      profile/route.ts
      balance/route.ts
      packages/family/route.ts
      packages/details/route.ts
      payment/initiate/route.ts
      payment/methods/route.ts
      payment/settlement/multipayment/route.ts
      payment/settlement/qris/route.ts
  components/
    Navbar.tsx
    LoginForm.tsx
    RequireAuth.tsx
    NumberBadge.tsx
    PackagesTable.tsx
    PackageDetails.tsx
    PaymentSheet.tsx
    QRPreview.tsx
  lib/
    types.ts
    auth.ts
    server-fetch.ts
    storage.ts
    utils.ts
```

---

## .env.example

```
# Base upstreams (mirror CLI .env.template)
BASE_API_URL=https://<your-base-api>
BASE_CIAM_URL=https://<your-ciam-base>
BASIC_AUTH=Basic xxx:yyy  # or just the base64, e.g. Zm9vOmJhcg==
UA=okhttp/4.10.0 (samsung SM-N935F; Android 13)
AX_DEVICE_ID=<device-id>
AX_FP=<fingerprint>

# External crypto/sign service used by the original CLI
CRYPTO_BASE=https://crypto.mashu.lol/api/870
API_KEY=<api-key-for-crypto-service>
AES_KEY_ASCII=<aes-16-or-32-chars>

# App session/crypto
NEXTAUTH_SECRET=this-is-not-nextauth-but-used-for-cookies
SESSION_JWT_SECRET=replace-with-strong-random

# App URL
NEXT_PUBLIC_APP_NAME=MYnyak Engsel Web
NEXT_PUBLIC_DEFAULT_LANG=en
```

> On Vercel, add these in **Project Settings → Environment Variables**. Never expose `BASIC_AUTH`, `API_KEY`, `AES_KEY_ASCII`, or CIAM secrets to the browser.

---

## package.json

```json
{
  "name": "me-cli-web",
  "private": true,
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "zod": "3.23.8",
    "jsonwebtoken": "9.0.2",
    "jose": "5.9.3",
    "qrcode": "1.5.4",
    "@types/jsonwebtoken": "9.0.6",
    "@types/node": "20.12.13",
    "@types/react": "18.3.6",
    "@types/react-dom": "18.3.0"
  },
  "devDependencies": {
    "typescript": "5.5.4",
    "eslint": "9.12.0",
    "eslint-config-next": "14.2.5"
  }
}
```

---

## next.config.mjs

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: { allowedOrigins: ["*"] }
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
};
export default nextConfig;
```

---

## tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["@types/node", "@types/react", "@types/react-dom"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

---

## app/globals.css

```css
:root{ --bg:#0b1220; --fg:#f1f5f9; --muted:#94a3b8; --card:#0f172a; --accent:#22d3ee; }
*{ box-sizing:border-box }
html,body{ padding:0; margin:0; background:var(--bg); color:var(--fg); font-family:system-ui,Segoe UI,Roboto,Inter,sans-serif }
main{ max-width:1100px; margin:0 auto; padding:24px }
.card{ background:var(--card); border:1px solid #1f2937; border-radius:16px; padding:16px; box-shadow:0 4px 24px rgba(0,0,0,.25) }
.row{ display:flex; gap:12px; align-items:center; flex-wrap:wrap }
.btn{ background:var(--accent); color:#003; border:none; padding:10px 16px; border-radius:10px; font-weight:700; cursor:pointer }
.input{ background:#0b1020; color:var(--fg); border:1px solid #334155; border-radius:10px; padding:10px 12px; width:100% }
.table{ width:100%; border-collapse:collapse }
.table th,.table td{ border-bottom:1px solid #233047; padding:10px; text-align:left }
.badge{ background:#1e293b; padding:4px 8px; border-radius:999px; font-size:12px }
.small{ color:var(--muted); font-size:12px }
.nav{ display:flex; gap:12px; align-items:center; justify-content:space-between; padding:12px 0 }
.link{ color:var(--fg); text-decoration:none; opacity:.9 }
.link:hover{ opacity:1 }
```

---

## app/layout.tsx

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "MYnyak Engsel Web",
  description: "Web UI for OTP login, balance, packages, and payment checkout",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>
          <nav className="nav">
            <a className="link" href="/">{process.env.NEXT_PUBLIC_APP_NAME || "ME Web"}</a>
            <div className="row">
              <a className="link" href="/bookmarks">Bookmarks</a>
              <a className="link" href="/dashboard">Dashboard</a>
              <a className="link" href="/login">Login</a>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
```

---

## app/page.tsx

```tsx
export default function Home() {
  return (
    <div className="card">
      <h1>Welcome</h1>
      <p>Use this web to login via OTP, view balance & packages, and test checkout flows (Multipayment/QRIS).</p>
      <ul>
        <li>Go to <a className="link" href="/login">Login</a> to start.</li>
        <li>After login, open <a className="link" href="/dashboard">Dashboard</a>.</li>
        <li>Try saving packages in <a className="link" href="/bookmarks">Bookmarks</a>.</li>
      </ul>
    </div>
  );
}
```

---

## components/RequireAuth.tsx

```tsx
"use client";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const has = localStorage.getItem("id_token");
    setOk(!!has);
  }, []);
  if (!ok) {
    return <div className="card">Please <a className="link" href="/login">login</a> first.</div>;
  }
  return <>{children}</>;
}
```

---

## components/LoginForm.tsx

```tsx
"use client";
import { useState } from "react";

export default function LoginForm(){
  const [msisdn, setMsisdn] = useState("");
  const [subscriberId, setSubscriberId] = useState<string|undefined>();
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestOTP(){
    setBusy(true);
    try{
      const r = await fetch("/api/auth/request-otp?msisdn="+encodeURIComponent(msisdn));
      const j = await r.json();
      if(!r.ok) throw new Error(j.error||"Failed");
      setSubscriberId(j.subscriber_id);
    }finally{ setBusy(false); }
  }

  async function submitOTP(){
    setBusy(true);
    try{
      const r = await fetch("/api/auth/submit-otp",{method:"POST", headers:{"content-type":"application/json"}, body: JSON.stringify({ subscriber_id: subscriberId, otp })});
      const j = await r.json();
      if(!r.ok) throw new Error(j.error||"Failed");
      // Store tokens client-side for demo; in production you may set HttpOnly cookies via Route Handler
      localStorage.setItem("access_token", j.access_token);
      localStorage.setItem("id_token", j.id_token);
      localStorage.setItem("refresh_token", j.refresh_token);
      window.location.href = "/dashboard";
    }finally{ setBusy(false); }
  }

  return (
    <div className="card">
      <h2>Login via OTP</h2>
      <div className="row">
        <input className="input" placeholder="628xxxx" value={msisdn} onChange={e=>setMsisdn(e.target.value)} />
        <button className="btn" onClick={requestOTP} disabled={busy || !msisdn}>Request OTP</button>
      </div>
      {subscriberId && (
        <div style={{marginTop:12}}>
          <p className="small">Subscriber ID: {subscriberId}</p>
          <div className="row">
            <input className="input" placeholder="6-digit OTP" value={otp} onChange={e=>setOtp(e.target.value)} />
            <button className="btn" onClick={submitOTP} disabled={busy || !otp}>Submit OTP</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## app/(auth)/login/page.tsx

```tsx
import LoginForm from "@/components/LoginForm";

export default function Page(){
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
    </div>
  );
}
```

---

## app/dashboard/page.tsx

```tsx
"use client";
import RequireAuth from "@/components/RequireAuth";
import { useEffect, useState } from "react";

export default function Dashboard(){
  const [profile, setProfile] = useState<any>();
  const [balance, setBalance] = useState<any>();
  const idToken = typeof window!=="undefined"? localStorage.getItem("id_token"): null;

  useEffect(()=>{
    (async()=>{
      if(!idToken) return;
      const [p,b] = await Promise.all([
        fetch("/api/profile", { headers: { Authorization: `Bearer ${idToken}` } }).then(r=>r.json()),
        fetch("/api/balance", { headers: { Authorization: `Bearer ${idToken}` } }).then(r=>r.json())
      ]);
      setProfile(p);
      setBalance(b);
    })();
  },[idToken]);

  return (
    <RequireAuth>
      <div className="card">
        <h2>Account</h2>
        <pre className="small">{JSON.stringify(profile, null, 2)}</pre>
      </div>
      <div className="card" style={{marginTop:12}}>
        <h2>Balance</h2>
        <pre className="small">{JSON.stringify(balance, null, 2)}</pre>
      </div>
    </RequireAuth>
  );
}
```

---

## components/PackagesTable.tsx

```tsx
"use client";
import { useEffect, useState } from "react";

export default function PackagesTable(){
  const [familyCode, setFamilyCode] = useState("");
  const [packagesData, setPackages] = useState<any>();
  const idToken = typeof window!=="undefined"? localStorage.getItem("id_token"): null;

  async function fetchFamily(){
    const r = await fetch(`/api/packages/family?code=${encodeURIComponent(familyCode)}`, {
      headers: { Authorization: `Bearer ${idToken}` }
    });
    const j = await r.json();
    setPackages(j);
  }

  return (
    <div className="card">
      <h3>Find Packages by Family Code</h3>
      <div className="row">
        <input className="input" placeholder="FAMILY_CODE" value={familyCode} onChange={e=>setFamilyCode(e.target.value)} />
        <button className="btn" onClick={fetchFamily} disabled={!familyCode}>Fetch</button>
      </div>
      <pre className="small" style={{marginTop:12}}>{packagesData? JSON.stringify(packagesData, null, 2): 'No data'}</pre>
    </div>
  );
}
```

---

## components/QRPreview.tsx

```tsx
"use client";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

export default function QRPreview({ text }: { text: string }){
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    if(!text || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, text, { width: 220 });
  },[text]);
  return <canvas ref={canvasRef} />;
}
```

---

## lib/server-fetch.ts (server-only proxy helper)

```ts
// lib/server-fetch.ts
import { headers } from "next/headers";

function baseHeaders() {
  return {
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": process.env.UA || "MEWeb/1.0",
    "Ax-Device-Id": process.env.AX_DEVICE_ID || "",
    "Ax-Fingerprint": process.env.AX_FP || "",
  };
}

export async function upstreamJSON(
  method: "GET"|"POST",
  path: string,
  body?: any,
  idToken?: string
){
  const url = `${process.env.BASE_API_URL!.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
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
  const url = `${process.env.BASE_CIAM_URL!.replace(/\/$/, "")}/realms/xl-ciam/auth/otp?msisdn=${encodeURIComponent(msisdn)}`;
  const h: Record<string,string> = {
    ...baseHeaders(),
    "Authorization": process.env.BASIC_AUTH || "",
  };
  const r = await fetch(url, { method: "GET", headers: h, cache: "no-store" });
  return r.json();
}

export async function ciamSubmitOTP(subscriber_id: string, otp: string){
  const url = `${process.env.BASE_CIAM_URL!.replace(/\/$/, "")}/realms/xl-ciam/protocol/openid-connect/token`;
  const form = new URLSearchParams({ grant_type: "password", subscriber_id, otp });
  const h: Record<string,string> = {
    ...baseHeaders(),
    "Authorization": process.env.BASIC_AUTH || "",
    "content-type": "application/x-www-form-urlencoded"
  };
  const r = await fetch(url, { method: "POST", headers: h, body: form, cache: "no-store" });
  return r.json();
}
```

---

## lib/auth.ts

```ts
import jwt from "jsonwebtoken";

export function withAuthIdToken(req: Request){
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const idToken = m? m[1]: undefined;
  if(!idToken) return undefined;
  // optionally validate shape/expiry
  try{ jwt.decode(idToken); }catch{}
  return idToken;
}
```

---

## app/api/auth/request-otp/route.ts

```ts
import { NextResponse } from "next/server";
import { ciamRequestOTP } from "@/lib/server-fetch";

export async function GET(req: Request){
  const { searchParams } = new URL(req.url);
  const msisdn = searchParams.get("msisdn");
  if(!msisdn) return NextResponse.json({ error: "msisdn required" }, { status: 400 });
  const data = await ciamRequestOTP(msisdn);
  return NextResponse.json(data);
}
```

---

## app/api/auth/submit-otp/route.ts

```ts
import { NextResponse } from "next/server";
import { ciamSubmitOTP } from "@/lib/server-fetch";

export async function POST(req: Request){
  const { subscriber_id, otp } = await req.json();
  if(!subscriber_id || !otp) return NextResponse.json({ error: "missing fields" }, { status: 400 });
  const data = await ciamSubmitOTP(subscriber_id, otp);
  return NextResponse.json(data);
}
```

---

## app/api/profile/route.ts

```ts
import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function GET(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const data = await upstreamJSON("POST", "api/v8/profile", {
    access_token: "", app_version: "8.7.0", is_enterprise: false, lang: "en",
  }, idToken);
  return NextResponse.json(data);
}
```

---

## app/api/balance/route.ts

```ts
import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function GET(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const data = await upstreamJSON("POST", "api/v8/packages/balance-and-credit", { is_enterprise: false }, idToken);
  return NextResponse.json(data);
}
```

---

## app/api/packages/family/route.ts

```ts
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
```

---

## app/api/packages/details/route.ts

```ts
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
```

---

## app/api/payment/initiate/route.ts

```ts
import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function POST(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const body = await req.json();
  const data = await upstreamJSON("POST", "payments/api/v8/initiate-payment", body, idToken);
  return NextResponse.json(data);
}
```

---

## app/api/payment/methods/route.ts

```ts
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
```

---

## app/api/payment/settlement/multipayment/route.ts

```ts
import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function POST(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const body = await req.json();
  const data = await upstreamJSON("POST", "payments/api/v8/settlement/multipayment", body, idToken);
  return NextResponse.json(data);
}
```

---

## app/api/payment/settlement/qris/route.ts

```ts
import { NextResponse } from "next/server";
import { withAuthIdToken } from "@/lib/auth";
import { upstreamJSON } from "@/lib/server-fetch";

export async function POST(req: Request){
  const idToken = withAuthIdToken(req);
  if(!idToken) return NextResponse.json({ error: "auth required" }, { status: 401 });
  const body = await req.json();
  const data = await upstreamJSON("POST", "payments/api/v8/settlement/qris", body, idToken);
  return NextResponse.json(data);
}
```

---

## README.md (ops)

```md
# MYnyak Engsel Web (Next.js 14 / App Router)

A web UI that wraps the original CLI flows using server-side Route Handlers. Secrets live in env vars (Vercel project settings).

## Local dev

```bash
pnpm i # or npm i / yarn
cp .env.example .env && $EDITOR .env
npm run dev
```

Open http://localhost:3000

## Deploy to GitHub + Vercel
1. Push this folder to a new GitHub repository.
2. In Vercel: **New Project → Import from GitHub**.
3. Framework: **Next.js**. Root: repository root. Build command: `next build`. Output: `.next` (default).
4. Add env vars from `.env.example` in **Project Settings → Environment Variables** (Preview & Production). See Vercel docs.  
5. Deploy. Preview URL will be available; promote to Production when ready.

## Notes
- This app calls upstream APIs from **server** (Route Handlers) to avoid leaking secrets/CORS.
- OTP/login routes mirror the CLI (`/auth/otp` & `/token`).
- Payment flows: Multipayment and QRIS. For QRIS background & standards, see BI docs.
