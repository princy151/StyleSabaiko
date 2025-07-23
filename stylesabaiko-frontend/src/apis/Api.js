import axios from "axios";
// creating an instance of axios
const Api = axios.create({
    baseURL: process.env['REACT_APP_BACKEND_URL'] || "http://localhost:5000",
    withCredentials: true,
    headers: {
        "Access-Control-Allow-Credentials": "true",
        // "Content-Type":"multipart/from-data"
    }

});

const token = localStorage.getItem('token');


// if (!token) {
//     console.error('No token found in localStorage!');
//     // You can also redirect to login page here, or throw an error
//     // For example, if using React Router:
//     // window.location.href = "/login";
//     throw new Error("User not authenticated");
// }

const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}

// =========================== Authentication APIS ============================== //
export const registerUserApi = (data) => Api.post('/api/user/create', data)

export const loginUserApi = (data) => Api.post('/api/user/login', data)


// =========================== Product APIS ============================== //
export const getPopularProductsApi = () => Api.get('/api/product/get-popular-products')

export const getNewProductsApi = () => Api.get('/api/product/get-all')

export const getProductsApi = () => Api.get('/api/product/get-all')

export const createProductApi = (data) => Api.post('/api/product/create', data);

export const deleteProductApi = (id) => Api.delete(`/api/product/delete/${id}`);

export const getProductApi = (id) => Api.get(`/api/product/get/${id}`);

export const updateProductApi = (id, data) => Api.patch(`/api/product/update/${id}`, data);

export const getProductsByCategoryApi = (category) => Api.get(`/api/product/get-all/category/${category}`);

export const searchProductsApi = (keyword) => Api.get(`/api/product/get-all?keyword=${keyword}`);


// =========================== Cart APIS ============================== //
export const addItemToCartApi = (data) => Api.post(`/api/cart/add`, data, config)
export const getItemsFromCartApi = () => Api.get(`/api/cart/get-all`, config)
export const removeItemFromCartApi = (id) => Api.delete(`/api/cart/remove/${id}`, config)
export const removeItemsFromCartApi = () => Api.delete(`/api/cart/remove`, config)


// =========================== Order APIS ============================== //
export const createOrderApi = (data) => Api.post(`/api/order/create`, data, config)
export const getOrderApi = (id) => Api.get(`/api/order/get/${id}`, config)
export const getOrdersApi = () => Api.get(`/api/order/get-all`, config)
export const getAllOrdersApi = () => Api.get(`/api/order/admin/get-all`, config)
export const updateOrderStatusApi = (id, status) => Api.patch(`/api/order/update/${id}/${status}`, {}, config)


// =========================== User APIS ============================== //
export const updateUserApi = (data) => Api.patch(`/api/user/update/me`, data, config)
export const changePasswordApi = (data) => Api.patch(`/api/user/change-password`, data, config)
export const getUsersApi = () => Api.get(`/api/user/admin/get-all`, config)
export const deleteUserApi = (id) => Api.delete(`/api/user/admin/${id}`, config)


// =========================== Khalti APIS ============================== //
// export const khaltiApi  = (data) => axios.post('https://dev.khalti.com/api/v2/epayment/initiate/', {
//     "return_url": "http://localhost:3000/payment-success",
//     "website_url": "http://localhost:3000",
//     "amount": 1300,
//     "purchase_order_id": "test12",
//     "purchase_order_name": "test",
//     "customer_info": {
//         "name": "Princy Agrawal",
//         "phone": "9800000004"
//     },
//     "amount_breakdown": [
//         {
//             "label": "Mark Price",
//             "amount": 1000
//         },
//         {
//             "label": "VAT",
//             "amount": 300
//         }
//     ],
//     "product_details": [
//         {
//             "identity": "1234567890",
//             "name": "Khalti logo",
//             "total_price": 1300,
//             "quantity": 1,
//      "unit_price": 1300
//         }
//     ],
//     "merchant_username": "merchant_name",
//     "merchant_extra": "merchant_extra"
//   }, {
//     headers: {
//         "Authorization": "key 6fa778cd3be54fbcb62eaf35b71c0ae8"
//     }
//   })

export const khaltiApi = (data) => axios.post(
    'https://dev.khalti.com/api/v2/epayment/initiate/',
    {
        return_url: "http://localhost:3000/payment-success",
        website_url: "http://localhost:3000",
        amount: data.amount,                   // total amount in paisa (multiply by 100)
        purchase_order_id: data.order_id,     // order id from your backend response
        purchase_order_name: data.order_name, // name of order (e.g. "Purchase from StyleSabaiko")
        customer_info: {
            name: data.name,
            phone: data.phone,
            email: data.email || "",             // user email (optional)
        },
        amount_breakdown: [
            {
                label: "Subtotal",
                amount: data.subtotal || data.amount,
            },
            {
                label: "VAT",
                amount: data.vat || 0,
            },
        ],
        product_details: data.products || [],  // list of products in correct format
    },
    {
        headers: {
            Authorization: "Key 6fa778cd3be54fbcb62eaf35b71c0ae8"  // your Khalti secret key
        }
    }
);
