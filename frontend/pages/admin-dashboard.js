import { useState } from 'react';
import Layout from '../components/Layout';
import { patchJson } from '../services/api';

export default function AdminDashboardPage() {
  const [commission, setCommission] = useState(2);
  const [message, setMessage] = useState('');

  const updateCommission = async () => {
    const response = await patchJson('/admin/commission', { percent: Number(commission) }, {
      'x-user-role': 'ADMIN',
      'x-user-id': 'replace-with-real-admin-id'
    });

    setMessage(response.success ? `Commission updated to ${commission}%` : response.message);
  };

  return (
    <Layout title="Admin Dashboard">
      <div className="card">
        <h3>Set Commission</h3>
        <p>Allowed values: 2% (default) or 3%</p>
        <input className="input" type="number" value={commission} onChange={(e) => setCommission(e.target.value)} />
        <button className="button" onClick={updateCommission}>Save Commission</button>
      </div>

      <div className="card">
        <h3>Trust Control</h3>
        <ul>
          <li>Verify farmers and buyers before they can trade</li>
          <li>Suspend or blacklist repeat defaulters</li>
          <li>Track district-wise growth before expanding beyond Bihar</li>
        </ul>
      </div>

      <p>{message}</p>
    </Layout>
  );
}
