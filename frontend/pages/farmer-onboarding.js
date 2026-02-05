import { useState } from 'react';
import Layout from '../components/Layout';
import { postJson } from '../services/api';

export default function FarmerOnboardingPage() {
  const [form, setForm] = useState({
    fullName: '',
    districtId: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');

  const submit = async () => {
    const payload = {
      fullName: form.fullName,
      districtId: form.districtId,
      email: form.email,
      password: form.password,
      role: 'FARMER'
    };

    const response = await postJson('/auth/signup/email', payload);

    if (!response.success && form.phoneNumber) {
      const fallback = await postJson('/auth/register', {
        fullName: form.fullName,
        districtId: form.districtId,
        phoneNumber: form.phoneNumber,
        role: 'FARMER'
      });
      setMessage(fallback.success ? 'Farmer phone registration submitted.' : fallback.message);
      return;
    }

    setMessage(response.success ? 'Farmer email signup complete.' : response.message);
  };

  return (
    <Layout title="Farmer Onboarding">
      <div className="card">
        <input className="input" placeholder="Full Name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder="District ID" onChange={(e) => setForm({ ...form, districtId: e.target.value })} />
        <input className="input" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <p>Optional fallback phone registration if email signup fails:</p>
        <input className="input" placeholder="Phone Number" onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
        <button className="button" onClick={submit}>Submit</button>
        <p>{message}</p>
      </div>
    </Layout>
  );
}
