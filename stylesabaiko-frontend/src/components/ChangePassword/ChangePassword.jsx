import React, { useState } from 'react';
import './ChangePassword.css';
import { changePasswordApi } from '../../apis/Api';
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

    var validate = () => {
        var isValid = true;
        if (oldPassword.trim() === "") {
            setOldPasswordError("Please enter Old Password.");
            isValid = false;
        }
        if (newPassword.trim() === "") {
            setNewPasswordError("Please enter New Password.");
            isValid = false;
        }

        if (confirmNewPassword.trim() === "") {
            setConfirmNewPasswordError("Please enter New Password For Confirmation.");
            isValid = false;
        }

        if (newPassword.trim() !== confirmNewPassword.trim()) {
            toast.error("New Password and Confirmed Password does not match.");
            isValid = false;
        }
        return isValid;
    };

    const handleSave = (e) => {
        e.preventDefault();
        var isValid = validate();
        if (!isValid) {
            return;
        }

        const data = {
            oldPassword,
            newPassword,
        };

        changePasswordApi(data)
            .then((res) => {
                if (res.data?.success === false) {
                    toast.error(res.data.message);
                } else {
                    toast.success(res.data.message);
                }
            })
            .catch((err) => {
                if (err?.response?.status === 400) {
                    toast.error(err?.response?.data?.message);
                } else {
                    toast.error("Internal Server Error!");
                }
            });
    };
    return (
        <div className="change-password-section">
            <h2>Change Password</h2>
            <form>
                <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="Current Password" onChange={(e) => setOldPassword(e.target.value)} />
                    {oldPasswordError && (
                        <small className="text text-danger">{oldPasswordError}</small>
                    )}
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)} />
                    {newPasswordError && (
                        <small className="text text-danger">{newPasswordError}</small>
                    )}
                </div>
                <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm New Password" onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    {confirmNewPasswordError && (
                        <small className="text text-danger">
                            {confirmNewPasswordError}
                        </small>
                    )}
                </div>
                <button onClick={handleSave} type="submit">Change Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
