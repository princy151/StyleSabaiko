import React, {  useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';
import { getProductApi } from '../../apis/Api';

const Product = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(false);

    useEffect(() => {
        getProductApi(id).then((res) => {
            setProduct(res.data.product)
        }).catch((err) => {})
    }, [id])

    return product ? (
        <div>
            <ProductDisplay product={product} />
        </div>
    ) : null
}

export default Product
