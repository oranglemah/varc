import jwt from "jsonwebtoken";

export function withAuthIdToken(req: Request){
  const auth = req.headers.get("authorization") || "";
  const m = auth.match(/^Bearer\s+(.+)$/i);
  const idToken = m? m[1]: undefined;
  if(!idToken) return undefined;
  try{ jwt.decode(idToken); }catch{}
  return idToken;
}
