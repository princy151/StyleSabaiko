// import React, { useState } from "react";
// import "./ProductDisplay.css";
// import RelatedProducts from "../RelatedProducts/RelatedProducts";
// import { useCart } from "../Context/CartContext";

// const ProductDisplay = ({ product }) => {
//     const [rating, setRating] = useState(product.rating || 0);
//     const [hover, setHover] = useState(0);
//     const { addToCart } = useCart();

//     const handleRating = (value) => setRating(value);

//     const handleAddToCart = () => addToCart(product);

//     return (
//         <section className="product-display">
//             <div className="product-image">
//                 <img src={process.env.REACT_APP_BACKEND_IMAGE_URL + product.imageUrl} alt={product.title} />
//             </div>

//             <div className="product-details">
//                 <h1 className="product-title">{product.title}</h1>

//                 <div className="rating">
//                     {[1, 2, 3, 4, 5].map((i) => (
//                         <span
//                             key={i}
//                             className={`star ${i <= (hover || rating) ? "filled" : ""}`}
//                             onMouseEnter={() => setHover(i)}
//                             onMouseLeave={() => setHover(0)}
//                             onClick={() => handleRating(i)}
//                         >
//                             ★
//                         </span>
//                     ))}
//                 </div>

//                 <p className="product-price">Rs. {product.price.toFixed(2)}</p>

//                 <p className="product-description">{product.description}</p>

//                 <div className="product-sizes">
//                     <label>Size:</label>
//                     <div className="size-options">
//                         {[38, 39, 40, 41].map((size) => (
//                             <button key={size}>{size}</button>
//                         ))}
//                     </div>
//                 </div>

//                 <p className="product-category">
//                     <strong>Category:</strong> {product.category}
//                 </p>

//                 <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
//             </div>

//             <RelatedProducts id={product._id} category={product.category} />
//         </section>
//     );
// };

// export default ProductDisplay;


import React, { useState } from "react";
import "./ProductDisplay.css";
import { useCart } from "../Context/CartContext";

const ProductDisplay = ({ product }) => {
  // Size options
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  // Local state for selected size
  const [selectedSize, setSelectedSize] = useState('');

  // Import addToCart from your cart context
  const { addToCart } = useCart();

  // Add to cart handler with size validation
  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size before adding to cart.');
      return;
    }
    // Add product with selected size to cart
    addToCart({ ...product, selectedSize });
    alert(`Added "${product.title}" (Size: ${selectedSize}) to cart!`);
  };

  return (
    <div className="product-container">
      {/* Image */}
      <div className="image-wrapper">
        <img
          src={process.env.REACT_APP_BACKEND_IMAGE_URL + product.imageUrl}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="product-details">
        <h2 className="product-title">{product.title}</h2>
        <p className="product-price">Rs. {product.price.toFixed(2)}</p>
        <p className="product-desc">{product.description}</p>

        {/* Size Selector */}
        <div className="sizes-section">
          <span className="size-label">Choose Size:</span>
          <div className="sizes-container">
            {sizes.map((size) => (
              <button
                key={size}
                className={`size-btn ${selectedSize === size ? "selected" : ""}`}
                onClick={() => setSelectedSize(size)}
                aria-pressed={selectedSize === size}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button className="add-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDisplay;
