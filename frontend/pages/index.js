import Layout from '../components/Layout';

export default function HomePage() {
  return (
    <Layout title="Direct Bulk Trade Between Farmers & Buyers">
      <section className="card">
        <h3>Problem</h3>
        <p>Small fragmented trades reduce trust, delay payments, and hurt both farmers and buyers.</p>
      </section>

      <section className="card">
        <h3>How it works</h3>
        <ol>
          <li>Verified farmers list bulk produce (minimum 100 kg).</li>
          <li>Verified buyers lock quantity and price.</li>
          <li>Locked deal means no renegotiation.</li>
          <li>Admin tracks payment status and discipline rules.</li>
        </ol>
      </section>

      <section className="card">
        <h3>What makes HaatSe different</h3>
        <ul>
          <li>Commitment-first trade network</li>
          <li>Role-based verification and blacklisting</li>
          <li>Escrow-style payment status tracking</li>
        </ul>
      </section>

      <section className="card">
        <h3>Bihar-first rollout</h3>
        <p>District-by-district onboarding for controlled quality and trusted scale.</p>
      </section>

      <section className="card">
        <h3>Trust & safety</h3>
        <p>Default warnings, suspensions, and bans are enforced by strict policy logic.</p>
        <button className="button">Register as Farmer</button>
        <button className="button">Register as Buyer</button>
      </section>
    </Layout>
  );
}
