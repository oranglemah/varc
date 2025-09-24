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
