import React, { useState } from 'react';
import '../CSS/Account.css';
import Profile from '../../components/Profile/Profile';
import ChangePassword from '../../components/ChangePassword/ChangePassword';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';

const Account = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <Profile />;
            case 'changePassword':
                return <ChangePassword />;
            default:
                return <Profile />;
        }
    };

    return (
        <div className="account-container">
            <ProfileSidebar setActiveTab={setActiveTab} activeTab={activeTab} />
            <div className="account-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Account;
