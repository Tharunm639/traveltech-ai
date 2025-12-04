import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function ItineraryDetail() {
    const { id } = useParams();
    const [itinerary, setItinerary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItinerary = async () => {
            try {
                const token = localStorage.getItem('tt_token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch(`/api/itineraries?all=true`, { headers }); // Fetch all to find specific one (optimization: create specific GET endpoint)
                // Note: Ideally we should have GET /api/itineraries/:id, but for now we filter client side or use the existing list endpoint if needed.
                // Actually, let's try to fetch the specific one if the API supports it.
                // The current API implementation has GET /api/itineraries which returns a list.
                // I should probably add GET /api/itineraries/:id to the backend for efficiency, but let's check if I can just filter from the list for now to save time, 
                // OR better, I'll add the GET /api/itineraries/:id endpoint to the backend as it's standard practice.
                // Wait, I already saw GET /api/itineraries in the backend code, let me check if there is a GET /:id.
                // Looking at previous `view_file` of `itineraries.js`, there was NO GET /:id, only PATCH and DELETE.
                // So I should add GET /:id to backend first or just filter client side.
                // Filtering client side is easier for now given the constraints, but adding GET /:id is better.
                // Let's stick to filtering client side from the list for now to minimize backend changes unless strictly necessary.

                const data = await res.json();
                const found = Array.isArray(data) ? data.find(i => i._id === id) : null;

                if (found) {
                    setItinerary(found);
                } else {
                    setError('Itinerary not found');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load itinerary');
            } finally {
                setLoading(false);
            }
        };

        fetchItinerary();
    }, [id]);

    if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
    if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>{error}</div>;
    if (!itinerary) return <div style={{ padding: 40, textAlign: 'center' }}>Itinerary not found</div>;

    const { details, type } = itinerary;

    return (
        <div className="section-container" style={{ maxWidth: 900, padding: '40px 20px' }}>
            <Link to="/itineraries" style={{ textDecoration: 'none', color: '#666', marginBottom: 20, display: 'inline-block' }}>← Back to Itineraries</Link>

            <h1 style={{ fontSize: 32, marginBottom: 10 }}>{itinerary.name}</h1>
            <p style={{ color: '#666', marginBottom: 40 }}>Type: {type === 'ai' ? 'AI Generated Trip' : 'Custom Package Trip'}</p>

            {type === 'ai' && details && (
                <div>
                    {/* Hotels */}
                    {details.hotels && details.hotels.length > 0 && (
                        <div style={{ marginBottom: 40 }}>
                            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: 10, marginBottom: 20 }}>🏨 Hotels</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                                {details.hotels.map((hotel, idx) => (
                                    <div key={idx} style={{ border: '1px solid #eee', borderRadius: 12, padding: 20, background: '#f9f9f9' }}>
                                        <h4 style={{ margin: '0 0 10px 0' }}>{hotel.name}</h4>
                                        <p style={{ color: '#d32f2f', fontWeight: 'bold', margin: '0 0 10px 0' }}>{hotel.price}</p>
                                        <p style={{ fontSize: 14, color: '#666' }}>{hotel.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Itinerary */}
                    {details.itinerary && (
                        <div>
                            <h2 style={{ borderBottom: '2px solid #eee', paddingBottom: 10, marginBottom: 20 }}>📅 Daily Plan</h2>
                            {details.itinerary.map((day, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
                                    <div style={{
                                        background: '#333', color: 'white', width: 50, height: 50,
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontWeight: 'bold', fontSize: 16, flexShrink: 0
                                    }}>
                                        {day.day}
                                    </div>
                                    <div style={{ background: '#fff', border: '1px solid #eee', padding: 20, borderRadius: 12, width: '100%' }}>
                                        <p style={{ marginBottom: 8 }}><strong>🌅 Morning:</strong> {day.morning}</p>
                                        <p style={{ marginBottom: 8 }}><strong>☀️ Afternoon:</strong> {day.afternoon}</p>
                                        <p><strong>🌙 Evening:</strong> {day.evening}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {type !== 'ai' && (
                <div>
                    <p>Details for this package trip are not yet fully supported in this view.</p>
                </div>
            )}
        </div>
    );
}
