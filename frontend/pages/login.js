import { useState } from 'react';
import Layout from '../components/Layout';
import { postJson } from '../services/api';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleToken, setGoogleToken] = useState('');
  const [googleRole, setGoogleRole] = useState('FARMER');
  const [googleDistrictId, setGoogleDistrictId] = useState('');
  const [googleCompanyName, setGoogleCompanyName] = useState('');
  const [message, setMessage] = useState('');

  const handleOtpLogin = async () => {
    const response = await postJson('/auth/verify-otp', { phoneNumber, otp });
    setMessage(response?.data?.message || response.message || 'Request finished');
  };

  const handleEmailLogin = async () => {
    const response = await postJson('/auth/login/email', { email, password });
    setMessage(response.success ? `Welcome ${response.data.user.fullName}. JWT issued.` : response.message);
  };

  const handleGoogleAuth = async () => {
    const response = await postJson('/auth/google', {
      idToken: googleToken,
      role: googleRole,
      districtId: googleDistrictId,
      companyName: googleCompanyName
    });

    setMessage(response.success ? `Google auth success for ${response.data.user.email}` : response.message);
  };

  return (
    <Layout title="Login / Authentication">
      <div className="card">
        <h3>Phone Login (OTP Placeholder)</h3>
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
        <button className="button" onClick={handleOtpLogin}>Verify OTP</button>
      </div>

      <div className="card">
        <h3>Email Login</h3>
        <input className="input" placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button className="button" onClick={handleEmailLogin}>Login with Email</button>
      </div>

      <div className="card">
        <h3>Google Auth (Signup + Login)</h3>
        <p>For local testing, paste a Google ID token from your client app.</p>
        <input className="input" placeholder="Google ID Token" value={googleToken} onChange={(event) => setGoogleToken(event.target.value)} />
        <input className="input" placeholder="District ID (needed for first signup)" value={googleDistrictId} onChange={(event) => setGoogleDistrictId(event.target.value)} />
        <input className="input" placeholder="Company Name (for buyer signup only)" value={googleCompanyName} onChange={(event) => setGoogleCompanyName(event.target.value)} />
        <select className="input" value={googleRole} onChange={(event) => setGoogleRole(event.target.value)}>
          <option value="FARMER">FARMER</option>
          <option value="BUYER">BUYER</option>
        </select>
        <button className="button" onClick={handleGoogleAuth}>Continue with Google</button>
      </div>

      <p>{message}</p>
    </Layout>
  );
}
