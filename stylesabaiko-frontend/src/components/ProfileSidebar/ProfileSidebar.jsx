import React from 'react';
import './ProfileSidebar.css';
import { FaUser, FaLock } from 'react-icons/fa';

const ProfileSidebar = ({ setActiveTab, activeTab }) => {
    return (
        <div className="profile-sidebar">
            <div className="profile-sidebar-header">
                <h2>My Account</h2>
            </div>
            <ul className="profile-sidebar-menu">
                <li
                    className={`profile-sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    <FaUser className="icon" />
                    <span>Profile</span>
                </li>
                <li
                    className={`profile-sidebar-item ${activeTab === 'changePassword' ? 'active' : ''}`}
                    onClick={() => setActiveTab('changePassword')}
                >
                    <FaLock className="icon" />
                    <span>Change Password</span>
                </li>
            </ul>
        </div>
    );
};

export default ProfileSidebar;
