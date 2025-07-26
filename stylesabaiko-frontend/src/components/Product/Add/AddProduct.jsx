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


    // // Form validation function
    const validate = () => {
        let isValid = true;
        if (productDetails.name.trim() === "") {
            setTitleError("Title is empty or invalid");
            isValid = false;
        } else {
            setTitleError(""); // clear the error
        }

        if (productDetails.description.trim() === "") {
            setDescriptionError("Description is Required");
            isValid = false;
        } else {
            setDescriptionError(""); // clear the error
        }

        if (productDetails.category.trim() === "") {
            setCategoryError("Category is Required");
            isValid = false;
        } else {
            setCategoryError(""); // clear the error

        } if (productDetails.price.trim() === "") {
            setPriceError("Price is Required");
            isValid = false;
        } else {
            setPriceError(""); // clear the error
        }

        return isValid;
    };

    const handleAddProduct = async () => {
        const isValid = validate();
        if (!isValid) {
            return;
        }
        let product = { ...productDetails };

        let formData = new FormData();
        formData.append('title', product.name);
        formData.append('description', product.description);
        formData.append('category', product.category);
        formData.append('price', product.price);
        formData.append('image', image);

        try {
            await createProductApi(formData)
            toast.success('Product has been added.');
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error('Something went wrong!');
        }
    };

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    return (
        <div className="addproduct">
            <h1 className="text-center mb-3">Add New Product</h1>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input type="text" name="name" value={productDetails.name} onChange={changeHandler} placeholder="Type here" />
                {titleError && <p className="text-danger">{titleError}</p>}
            </div>
            <div className="addproduct-itemfield">
                <p>Product description</p>
                <input type="text" name="description" value={productDetails.description} onChange={changeHandler} placeholder="Type here" />
                {descriptionError && <p className="text-danger">{descriptionError}</p>}
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input type="number" name="price" value={productDetails.price} onChange={changeHandler} placeholder="Type here" />
                    {priceError && <p className="text-danger">{priceError}</p>}
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product category</p>
                <select value={productDetails.category} name="category" className="add-product-selector" onChange={changeHandler}>
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
                {categoryError && <p className="text-danger">{categoryError}</p>}
            </div>
            <div className="addproduct-itemfield">
                <p>Product image</p>
                <label htmlFor="file-input" className="file-input-label">
                    {
                        image && <img className="addproduct-thumbnail-img" src={URL.createObjectURL(image)} alt="Product Thumbnail" />
                    }
                    {!image && <span>Click to upload image</span>}
                </label>
                <input onChange={(e) => setImage(e.target.files[0])} type="file" name="image" id="file-input" accept="image/*" hidden />
            </div>
            <button className="addproduct-btn" onClick={handleAddProduct}>ADD</button>
        </div>
    );
};

export default AddProduct;






