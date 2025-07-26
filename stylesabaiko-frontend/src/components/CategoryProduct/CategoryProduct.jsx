import React, { useState, useEffect } from 'react';
import { getProductsByCategoryApi } from '../../apis/Api';
import './CategoryProduct.css';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 8;

const CategoryProduct = ({ category }) => {
    const [productList, setProductList] = useState([]);
    const [totalFetched, setTotalFetched] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState(30000);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getProductsByCategoryApi(category);
                setTotalFetched(res.data.products);
                setLoading(false);
            } catch (err) {
                setError('Failed to load products');
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    // Filter products by search term and price range
    const filteredProducts = totalFetched.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        p.price <= priceRange
    );

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    const handlePriceChange = (e) => {
        setPriceRange(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="product-listing-page">
            <header>
                <h1>{category.charAt(0).toUpperCase() + category.slice(1)} Products</h1>
            </header>
            <div className="content-wrapper">
                <aside className="sidebar">
                    <div className="filter-group">
                        <label htmlFor="search" className="filter-label">Search</label>
                        <input
                            id="search"
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search products..."
                            className="search-input"
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="priceRange" className="filter-label">
                            Max Price: Rs. {priceRange}
                        </label>
                        <input
                            type="range"
                            id="priceRange"
                            min="0"
                            max="30000"
                            value={priceRange}
                            onChange={handlePriceChange}
                            className="price-slider"
                        />
                    </div>
                </aside>

                <main className="product-main">
                    {loading && (
                        <div className="loading">
                            <div className="spinner"></div> Loading...
                        </div>
                    )}
                    {error && <p className="error">{error}</p>}
                    <div className="product-grid">
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map(product => (
                                <div key={product._id} className="product-card">
                                    <Link to={`/product/${product._id}`}>
                                        <img
                                            src={process.env.REACT_APP_BACKEND_IMAGE_URL + product.imageUrl}
                                            alt={product.title}
                                        />
                                        <h2>{product.title}</h2>
                                        <p className="category-product-price">Rs. {product.price.toFixed(2)}</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p>No products found.</p>
                        )}
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            aria-label="Previous Page"
                            className="pagination-btn"
                        >
                            ←
                        </button>

                        <span className="pagination-info">
                            Page {currentPage} of {totalPages || 1}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            aria-label="Next Page"
                            className="pagination-btn"
                        >
                            →
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default CategoryProduct;
