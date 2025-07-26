import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { searchProductsApi } from '../../apis/Api';
import '../CSS/Search.css';

const Search = () => {
    const { keyword } = useParams();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await searchProductsApi(keyword);
                const data = response.data.products;
                setResults(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchResults();
    }, [keyword]);

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">Error loading results. Please try again later.</p>;

    return (
        <div className="search-container">
            <h1 className="search-title">Search Results for "{keyword}"</h1>
            {results.length > 0 ? (
                <ul className="results-list">
                    {results.map((result) => (
                        <li key={result._id} className="result-item">
                            <Link to={`/product/${result._id}`}>
                                <img
                                    src={`${process.env.REACT_APP_BACKEND_IMAGE_URL}${result.imageUrl}`}
                                    alt={result.title}
                                    className="result-image"
                                />
                                <div className="result-details">
                                    <h2 className="result-title">{result.title}</h2>
                                    <p className="result-description">{result.description}</p>
                                    <p className="result-price">Rs. {result.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-results">No results found for "{keyword}".</p>
            )}
        </div>
    );
};

export default Search;
