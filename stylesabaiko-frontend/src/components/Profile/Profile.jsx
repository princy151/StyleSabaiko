import React, { useState, useEffect } from 'react';
import './Profile.css';
import { updateUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        fullName: savedUser.fullName || '',
        email: savedUser.email || '',
        phone: savedUser.phone || '',
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const containsHTML = (str) => /<[^>]*>/g.test(str);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (containsHTML(user.fullName) || containsHTML(user.phone)) {
      toast.error('HTML tags are not allowed in name or phone.');
      return;
    }

    const userData = {
      fullName: user.fullName,
      phone: user.phone,
    };

    updateUserApi(userData)
      .then((res) => {
        toast.success(res.data.message || 'Profile updated!');
        localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
      })
      .catch((err) => {
        toast.error('Failed to update profile');
        console.error(err);
      });
  };

  return (
    <div className="glass-profile-wrapper">
      <h2 className="glass-profile-title">Account Information</h2>
      <form className="glass-profile-form" onSubmit={handleSubmit}>
        <div className="glass-input-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={user.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>
        <div className="glass-input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={user.email}
            disabled
          />
        </div>
        <div className="glass-input-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="text"
            value={user.phone}
            onChange={handleChange}
            placeholder="+1234567890"
          />
        </div>
        <button type="submit" className="glass-submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
