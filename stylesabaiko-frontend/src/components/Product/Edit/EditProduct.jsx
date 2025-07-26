import React, { useEffect, useState } from "react";
import "../Add/AddProduct.css";
import { createProductApi, getProductApi, updateProductApi } from "../../../apis/Api";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const EditProduct = () => {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        image: "",
        category: "",
        price: ""
    });

    useEffect(() => {
        getProductApi(id)
            .then((res) => {
                const product = res.data.product;
                setProductDetails({
                    name: product.title,
                    description: product.description,
                    image: product.imageUrl,
                    category: product.category,
                    price: product.price
                });
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
            });
    }, [id]);


    const handleEditProduct = async () => {
        let formData = new FormData();
        formData.append('title', productDetails.name);
        formData.append('description', productDetails.description);
        formData.append('category', productDetails.category);
        formData.append('price', productDetails.price);
        if (image) formData.append('image', image);

        try {
            await updateProductApi(id, formData);
            toast.success('Product has been updated.');
        } catch (error) {
            console.error("Error updating product:", error);
            toast.error('Something went wrong!');
        }
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className="addproduct">
            <h1 className="text-center mb-3">Edit Your Product</h1>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input
                    type="text"
                    name="name"
                    value={productDetails.name}
                    onChange={changeHandler}
                    placeholder="Type here"
                />
            </div>
            <div className="addproduct-itemfield">
                <p>Product description</p>
                <input
                    type="text"
                    name="description"
                    value={productDetails.description}
                    onChange={changeHandler}
                    placeholder="Type here"
                />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input
                        type="number"
                        name="price"
                        value={productDetails.price}
                        onChange={changeHandler}
                        placeholder="Type here"
                    />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product category</p>
                <select
                    value={productDetails.category}
                    name="category"
                    className="add-product-selector"
                    onChange={changeHandler}
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>
            <div className="addproduct-itemfield">
                <p>Product image</p>
                <label htmlFor="file-input" className="file-input-label">
                    {image ? (
                        <img
                            className="addproduct-thumbnail-img"
                            src={URL.createObjectURL(image)}
                            alt="Product Thumbnail"
                        />
                    ) : (
                        <span>Click to upload image</span>
                    )}
                </label>
                <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    name="image"
                    id="file-input"
                    accept="image/*"
                    hidden
                />
            </div>
            {productDetails.image && (
                <div className="old-product-image">
                    <p>Current Product Image</p>
                    <img
                        className="addproduct-thumbnail-img"
                        src={process.env.REACT_APP_BACKEND_IMAGE_URL + productDetails.image}
                        alt="Current Product"
                    />
                </div>
            )}
            <button className="addproduct-btn" onClick={handleEditProduct}>
                EDIT
            </button>
        </div>
    );
};

export default EditProduct;
