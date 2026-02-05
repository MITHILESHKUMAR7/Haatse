import { useState } from 'react';
import Layout from '../components/Layout';
import { postJson } from '../services/api';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    const response = await postJson('/auth/verify-otp', { phoneNumber, otp });
    setMessage(response?.data?.message || response.message || 'Request finished');
  };

  return (
    <Layout title="Phone Login (OTP Placeholder)">
      <div className="card">
        <input
          className="input"
          placeholder="Phone number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
        <input
          className="input"
          placeholder="OTP"
          value={otp}
          onChange={(event) => setOtp(event.target.value)}
        />
        <button className="button" onClick={handleLogin}>Verify OTP</button>
        <p>{message}</p>
      </div>
    </Layout>
  );
}
