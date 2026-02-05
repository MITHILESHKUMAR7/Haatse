import { useState } from 'react';
import Layout from '../components/Layout';
import { postJson } from '../services/api';

export default function FarmerDashboardPage() {
  const [form, setForm] = useState({ districtId: '', cropName: '', quantityKg: 100, pricePerKg: 0 });
  const [message, setMessage] = useState('');

  const createListing = async () => {
    const response = await postJson('/listings', form, {
      'x-user-role': 'FARMER',
      'x-user-id': 'replace-with-real-user-id'
    });

    setMessage(response.success ? 'Listing created.' : response.message);
  };

  return (
    <Layout title="Farmer Dashboard">
      <div className="card">
        <h3>Create Bulk Listing</h3>
        <input className="input" placeholder="District ID" onChange={(e) => setForm({ ...form, districtId: e.target.value })} />
        <input className="input" placeholder="Crop Name" onChange={(e) => setForm({ ...form, cropName: e.target.value })} />
        <input className="input" placeholder="Quantity (kg)" type="number" onChange={(e) => setForm({ ...form, quantityKg: Number(e.target.value) })} />
        <input className="input" placeholder="Price per kg" type="number" onChange={(e) => setForm({ ...form, pricePerKg: Number(e.target.value) })} />
        <button className="button" onClick={createListing}>Create Listing</button>
      </div>

      <div className="card">
        <h3>Your Deal Status</h3>
        <p className="badge">Active Deals: API integration pending</p>
        <p className="badge">Completed Deals: API integration pending</p>
      </div>
      <p>{message}</p>
    </Layout>
  );
}
