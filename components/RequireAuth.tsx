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
