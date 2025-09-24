export default function Home() {
  return (
    <div className="card">
      <h1>Welcome</h1>
      <p>Use this web to login via OTP, view balance & packages, and test checkout flows (Multipayment/QRIS).</p>
      <ul>
        <li>Go to <a className="link" href="/login">Login</a> to start.</li>
        <li>After login, open <a className="link" href="/dashboard">Dashboard</a>.</li>
      </ul>
    </div>
  );
}
