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
