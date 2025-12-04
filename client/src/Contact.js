import React from 'react';
import EnquiryForm from './EnquiryForm';

export default function Contact() {
    return (
        <div className="section-container" style={{ padding: '60px 20px', maxWidth: 1000 }}>
            <div style={{ textAlign: 'center', marginBottom: 50 }}>
                <h1 style={{ fontSize: 42, marginBottom: 15, color: '#222' }}>Get in Touch</h1>
                <p style={{ fontSize: 18, color: '#666', maxWidth: 600, margin: '0 auto' }}>
                    Have questions about our packages or need help with your AI itinerary? We're here to help!
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 50 }}>

                {/* Contact Info */}
                <div>
                    <div style={{ marginBottom: 30 }}>
                        <h3 style={{ fontSize: 24, marginBottom: 15, color: '#d32f2f' }}>Visit Us</h3>
                        <p style={{ fontSize: 16, color: '#444', lineHeight: 1.6 }}>
                            TravelTech Solutions Pvt Ltd.<br />
                            123 Innovation Drive, Tech Park<br />
                            Bangalore, Karnataka 560001<br />
                            India
                        </p>
                    </div>

                    <div style={{ marginBottom: 30 }}>
                        <h3 style={{ fontSize: 24, marginBottom: 15, color: '#d32f2f' }}>Call Us</h3>
                        <p style={{ fontSize: 16, color: '#444' }}>
                            <strong>Support:</strong> +91 98765 43210<br />
                            <strong>Sales:</strong> +91 98765 43211
                        </p>
                    </div>

                    <div>
                        <h3 style={{ fontSize: 24, marginBottom: 15, color: '#d32f2f' }}>Email Us</h3>
                        <p style={{ fontSize: 16, color: '#444' }}>
                            support@traveltech.com<br />
                            sales@traveltech.com
                        </p>
                    </div>
                </div>

                {/* Enquiry Form */}
                <div>
                    <EnquiryForm title="Send us a Message" />
                </div>

            </div>
        </div>
    );
}
