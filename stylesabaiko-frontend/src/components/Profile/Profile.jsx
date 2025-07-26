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
        gender: '',
        imageUrl: '',
    });

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('user'));
        if (savedUser) {
            setUser({
                fullName: savedUser.fullName || '',
                email: savedUser.email || '',
                phone: savedUser.phone || '',
                gender: savedUser.gender || '',
                imageUrl: savedUser.imageUrl || '',
            });
        }
    }, []);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const formData = new FormData();
                formData.append("image", file);
                updateUserApi(formData)
                    .then((res) => {
                        setUser(prevState => ({
                            ...prevState,
                            imageUrl: res.data.user.imageUrl
                        }));
                        localStorage.setItem('user', JSON.stringify({
                            ...user,
                            imageUrl: res.data.user.imageUrl
                        }));
                    })
                    .catch((err) => {
                        console.error('Error uploading image:', err);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save updated user data to server
        localStorage.setItem('user', JSON.stringify(user));
        updateUserApi(user)
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch((err) => {
                console.error('Error saving user data:', err);
            });
    };

    return (
        <div className="profile-section">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-picture">
                        <img
                            src={process.env['REACT_APP_BACKEND_URL']+'/users/' + user.imageUrl}
                            alt="Profile"
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src = "/Assets/WALK-WISE-LOGO.png";
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
                            onChange={handleChange}
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
                    <div className="form-group">
                        <label>Gender</label>
                        <select
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <button className="profile-button" type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
