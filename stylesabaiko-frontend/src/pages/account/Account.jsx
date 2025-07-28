import React from 'react';
import '../CSS/Account.css';
import Profile from '../../components/Profile/Profile';
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar';

const Account = () => {
    return (
        <div>          
            <div className="account-glass-content">
                <Profile />
            </div>
        </div>
    );
};

export default Account;
