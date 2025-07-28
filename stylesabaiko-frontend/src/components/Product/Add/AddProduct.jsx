import React, { useState } from "react";
import "./AddProduct.css";
import { createProductApi } from "../../../apis/Api";
import { toast } from "react-toastify";

const AddProduct = () => {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        description: "",
        category: "women",
        price: ""
    });
    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [categoryError, setCategoryError] = useState("");
    const [priceError, setPriceError] = useState("");

    const validate = () => {
        let isValid = true;
        if (productDetails.name.trim() === "") {
            setTitleError("Title is empty or invalid");
            isValid = false;
        } else setTitleError("");

        if (productDetails.description.trim() === "") {
            setDescriptionError("Description is Required");
            isValid = false;
        } else setDescriptionError("");

        if (productDetails.category.trim() === "") {
            setCategoryError("Category is Required");
            isValid = false;
        } else setCategoryError("");

        if (productDetails.price.trim() === "") {
            setPriceError("Price is Required");
            isValid = false;
        } else setPriceError("");

        return isValid;
    };

    const handleAddProduct = async () => {
        const isValid = validate();
        if (!isValid) return;

        let formData = new FormData();
        formData.append("title", productDetails.name);
        formData.append("description", productDetails.description);
        formData.append("category", productDetails.category);
        formData.append("price", productDetails.price);
        formData.append("image", image);

        try {
            await createProductApi(formData);
            toast.success("Product has been added.");
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Something went wrong!");
        }
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className="addproduct">
            <h1 className="text-center mb-3">Add New Product</h1>

            <div className="form-grid">
                <div className="addproduct-itemfield">
                    <input
                        type="text"
                        name="name"
                        value={productDetails.name}
                        onChange={changeHandler}
                        placeholder=" "
                        autoComplete="off"
                    />
                    <p>Product title</p>
                    {titleError && <p className="text-danger">{titleError}</p>}
                </div>

                <div className="addproduct-itemfield">
                    <input
                        type="text"
                        name="description"
                        value={productDetails.description}
                        onChange={changeHandler}
                        placeholder=" "
                        autoComplete="off"
                    />
                    <p>Product description</p>
                    {descriptionError && <p className="text-danger">{descriptionError}</p>}
                </div>

                <div className="addproduct-itemfield">
                    <input
                        type="number"
                        name="price"
                        value={productDetails.price}
                        onChange={changeHandler}
                        placeholder=" "
                        autoComplete="off"
                        min="0"
                    />
                    <p>Price</p>
                    {priceError && <p className="text-danger">{priceError}</p>}
                </div>

                <div className="addproduct-itemfield">
                    <select
                        name="category"
                        value={productDetails.category}
                        onChange={changeHandler}
                        className="add-product-selector"
                        placeholder=" "
                    >
                        <option value="women">Women</option>
                        <option value="men">Men</option>
                        <option value="kid">Kid</option>
                    </select>
                    <p>Product category</p>
                    {categoryError && <p className="text-danger">{categoryError}</p>}
                </div>
            </div>

            <div className="addproduct-itemfield image-upload">
                <label htmlFor="file-input" className={`file-input-label ${image ? "image-present" : ""}`}>
                    {image ? (
                        <div className="image-wrapper">
                            <img
                                className="addproduct-thumbnail-img"
                                src={URL.createObjectURL(image)}
                                alt="Product Thumbnail"
                            />
                        </div>
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

            <button className="addproduct-btn" onClick={handleAddProduct}>
                ADD
            </button>
        </div>
    );
};

export default AddProduct;
