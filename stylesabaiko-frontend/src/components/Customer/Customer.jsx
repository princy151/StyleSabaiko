import React, { useEffect, useState } from "react";
import { deleteUserApi, getUsersApi } from "../../apis/Api";
import "../Product/Product.css"
import { toast } from "react-toastify";
const ListCustomer = () => {
    const [allUsers, setAllUsers] = useState([]);

    const fetchUsers = () => {
        getUsersApi()
            .then((res) => {
                setAllUsers(res.data.users);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const removeUser = async (id) => {
        // eslint-disable-next-line no-restricted-globals
        const shouldRemove = confirm("are you sure you want to delete?");
        if (shouldRemove) {
            deleteUserApi(id).then((res) => {
                toast.success(res.data.message)
            }).catch((err) => { });
            fetchUsers(); // Re-fetch the list after removal
        }
    };

    return (
        <div className="listproduct">
            <h1>Customers</h1>
            <div className="listproduct-header">
            </div>
            <div className="listproduct-format-main">
                <p>Image</p> <p>Full Name</p> <p>Email</p> <p>Phone</p> <p>Actions</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allUsers.map((product, index) => (
                    <div key={index}>
                        <div className="listproduct-format">
                            <img
                                className="listproduct-product-icon"
                                src={`http://localhost:5000/users/${product.imageUrl}`}
                                alt=""
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = "/Assets/WALK-WISE-LOGO.png";
                                }}
                            />
                            <p className="cartitems-product-title">{product.fullName}</p>
                            <p>{product.email}</p>
                            <p>{product.phone}</p>
                            <p>
                                <button className="remove-product-button" onClick={() => removeUser(product._id)}>Delete</button>
                            </p>

                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListCustomer;
