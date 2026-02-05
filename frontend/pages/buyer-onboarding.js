import { useState } from 'react';
import Layout from '../components/Layout';
import { postJson } from '../services/api';

export default function BuyerOnboardingPage() {
  const [form, setForm] = useState({
    phoneNumber: '',
    fullName: '',
    districtId: '',
    companyName: ''
  });
  const [message, setMessage] = useState('');

  const submit = async () => {
    const response = await postJson('/auth/register', { ...form, role: 'BUYER' });
    setMessage(response.success ? 'Buyer registration submitted.' : response.message);
  };

  return (
    <Layout title="Buyer Onboarding">
      <div className="card">
        <input className="input" placeholder="Full Name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder="Company Name" onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
        <input className="input" placeholder="Phone Number" onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
        <input className="input" placeholder="District ID" onChange={(e) => setForm({ ...form, districtId: e.target.value })} />
        <button className="button" onClick={submit}>Submit</button>
        <p>{message}</p>
      </div>
    </Layout>
  );
}
