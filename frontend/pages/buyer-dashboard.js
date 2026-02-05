import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getJson, postJson } from '../services/api';

export default function BuyerDashboardPage() {
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getJson('/listings').then((response) => {
      setListings(response.data || []);
    });
  }, []);

  const lockDeal = async (listingId) => {
    const response = await postJson('/orders/lock', {
      listingId,
      quantityKg: 100,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    }, {
      'x-user-role': 'BUYER',
      'x-user-id': 'replace-with-real-user-id'
    });

    setMessage(response.success ? 'Deal locked. No renegotiation allowed.' : response.message);
  };

  return (
    <Layout title="Buyer Dashboard">
      <div className="card">
        <h3>Verified Listings</h3>
        {listings.map((listing) => (
          <div className="card" key={listing.id}>
            <p><strong>{listing.cropName}</strong> - {listing.quantityKg} kg - ₹{listing.pricePerKg}/kg</p>
            <p>District: {listing?.district?.name || 'Unknown'}</p>
            <button className="button" onClick={() => lockDeal(listing.id)}>Lock Deal</button>
          </div>
        ))}
      </div>
      <p>{message}</p>
    </Layout>
  );
}
