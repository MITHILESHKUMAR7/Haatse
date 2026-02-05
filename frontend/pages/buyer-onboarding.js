import { useState } from 'react';
import Layout from '../components/Layout';
import { postJson } from '../services/api';

export default function BuyerOnboardingPage() {
  const [form, setForm] = useState({
    fullName: '',
    districtId: '',
    companyName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');

  const submit = async () => {
    const response = await postJson('/auth/signup/email', {
      fullName: form.fullName,
      districtId: form.districtId,
      companyName: form.companyName,
      email: form.email,
      password: form.password,
      role: 'BUYER'
    });

    if (!response.success && form.phoneNumber) {
      const fallback = await postJson('/auth/register', {
        fullName: form.fullName,
        districtId: form.districtId,
        companyName: form.companyName,
        phoneNumber: form.phoneNumber,
        role: 'BUYER'
      });
      setMessage(fallback.success ? 'Buyer phone registration submitted.' : fallback.message);
      return;
    }

    setMessage(response.success ? 'Buyer email signup complete.' : response.message);
  };

  return (
    <Layout title="Buyer Onboarding">
      <div className="card">
        <input className="input" placeholder="Full Name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder="Company Name" onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
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
