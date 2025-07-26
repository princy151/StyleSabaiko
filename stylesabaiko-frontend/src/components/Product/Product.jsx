import React, { useEffect, useState } from "react";
import "./Product.css";
import { deleteProductApi, getProductsApi } from "../../apis/Api";
import { toast } from "react-toastify";

const ListProduct = () => {
    const [allProducts, setAllProducts] = useState([]);

    const fetchProducts = () => {
        getProductsApi()
            .then((res) => {
                setAllProducts(res.data.products);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const removeProduct = async (id) => {
        // eslint-disable-next-line no-restricted-globals
        const shouldRemove = confirm("are you sure you want to delete?");
        if (shouldRemove) {
            deleteProductApi(id).then((res) => {
                toast.success('Product has been deleted.');
            }).catch((err) => {
                toast.error('Something went wrong.');
            })
            fetchProducts(); // Re-fetch the product list after removal
         }
    };

    return (
        <div className="listproduct">
            <h1>Products</h1>
            <div className="listproduct-header">
                <a rel="stylesheet" href="/admin/dashboard/products/add" >  <button className="add-product-button">Add Product </button></a>
            </div>
            <div className="listproduct-format-main">
                <p>Image</p> <p>Title</p> <p>Price</p> <p>Category</p> <p>Actions</p>
            </div>
            <div className="listproduct-allproducts">
                <hr />
                {allProducts.map((product, index) => (
                    <div key={index}>
                        <div className="listproduct-format">
                            <img
                                className="listproduct-product-icon"
                                src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${product.imageUrl}`}
                                alt=""
                            />
                            <p className="cartitems-product-title">{product.title}</p>
                            <p>Rs. {product.price}</p>
                            <p>{product.category}</p>
                            
                            <p>
                                <a rel="stylesheet" href={`/admin/dashboard/products/edit/${product._id}`} ><button className="edit-product-button">Edit</button></a>
                                <button className="remove-product-button" onClick={() => removeProduct(product._id)}>Delete</button>
                            </p>
                            
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListProduct;
