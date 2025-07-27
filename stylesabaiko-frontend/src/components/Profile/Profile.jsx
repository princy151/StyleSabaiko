import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import './Profile.css';
import { updateUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    phone: '',
    imageUrl: '',
  });

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser({
        fullName: savedUser.fullName || '',
        email: savedUser.email || '',
        phone: savedUser.phone || '',
        imageUrl: savedUser.imageUrl || '',
      });
    }
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      updateUserApi(formData)
        .then((res) => {
          setUser((prevState) => ({
            ...prevState,
            imageUrl: res.data.user.imageUrl,
          }));
          localStorage.setItem(
            'user',
            JSON.stringify({
              ...user,
              imageUrl: res.data.user.imageUrl,
            })
          );
          toast.success('Profile image updated!');
        })
        .catch((err) => {
          console.error('Error uploading image:', err);
          toast.error('Failed to upload image');
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      fullName: user.fullName,
      phone: user.phone,
    };

    updateUserApi(userData)
      .then((res) => {
        toast.success(res.data.message || 'Profile updated successfully');
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...user,
            ...userData,
          })
        );
      })
      .catch((err) => {
        console.error('Error saving user data:', err);
        toast.error('Failed to update profile');
      });
  };

  return (
    <div className="profile-section">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-picture">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/users/${user.imageUrl}`}
              alt="Profile"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null;
                currentTarget.src = '/Assets/WALK-WISE-LOGO.png';
              }}
            />
            <label htmlFor="imageUpload" className="edit-icon">
              <FaEdit />
            </label>
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>
          <div className="profile-info">
            <h3>{user.fullName}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              placeholder="john.doe@example.com"
              disabled
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              placeholder="+123456789"
            />
          </div>
          <button className="profile-button" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
