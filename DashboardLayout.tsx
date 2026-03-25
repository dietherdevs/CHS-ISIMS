// Updated DashboardLayout.tsx for mobile responsiveness

// 1. Reduce padding on mobile
// 2. Make cards responsive
// 3. Fix search bar truncation
// 4. Ensure all content is visible on small screens

import React from 'react';
import { Card } from 'antd';
import './DashboardLayout.css';

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <div className="search-bar">
                <input type="text" placeholder="Search..." className="search-input" />
            </div>
            <div className="card-container">
                {[1, 2, 3].map(item => (
                    <Card key={item} className="responsive-card">
                        <h3>Card {item}</h3>
                        <p>Some content here...</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DashboardLayout;