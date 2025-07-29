import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import Login from './pages/login/Login';
import Navbar from './components/Navbar/Navbar';

// Toast config
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './pages/register/Register';
import UserRoute from './protectedRoutes/userRoute';
import Homepage from './pages/homepage/Homepage';
import Product from './pages/product/Product';
import AdminDashboard from './pages/admin/AdminDasboard';
import ListProduct from './components/Product/Product';
import AddProduct from './components/Product/Add/AddProduct';
import EditProduct from './components/Product/Edit/EditProduct';
import Footer from './components/Footer/Footer';
import ProductList from './pages/productList/ProductList';
import Search from './pages/search/Search';
import Cart from './pages/cart/Cart';
import Order from './pages/order/Order';
import OrderHistory from './pages/order/OrderHistory';
import SingleOrder from './pages/order/SingleOrder';
import Account from './pages/account/Account';
import AdminRoute from './protectedRoutes/adminRoute';
import ListCustomer from './components/Customer/Customer';
import ListOrder from './components/Order/Order';
import PaymentSuccess from './utils/payment/PaymentSuccess';
import UnauthorizedPage from './pages/unauthorized/Unauthorized';
import ActivityLogPage from './pages/admin/Log.tsx';
// import ActivityLogPage from './pages/admin/Log';

// ✅ Create a wrapper component for logic using useLocation
const AppWrapper = () => {
  const location = useLocation();
  const hideNavbarOnPaths = ['/login', '/register'];

  return (
    <>
      {!hideNavbarOnPaths.includes(location.pathname) && <Navbar />}
      <ToastContainer />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route element={<UserRoute />}>
          <Route path='/' element={<Homepage />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/men' element={<ProductList category={'men'} />} />
          <Route path='/women' element={<ProductList category={'women'} />} />
          <Route path='/kids' element={<ProductList category={'kid'} />} />
          <Route path='/search/:keyword' element={<Search />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<Order />} />
          <Route path='/orders' element={<OrderHistory />} />
          <Route path='/order/:id' element={<SingleOrder />} />
          <Route path='/profile' element={<Account />} />
          <Route path='/payment-success' element={<PaymentSuccess />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/logs' element={<ActivityLogPage />} />
          <Route path='/admin/dashboard/products' element={<ListProduct />} />
          <Route path='/admin/dashboard/products/add' element={<AddProduct />} />
          <Route path='/admin/dashboard/products/edit/:id' element={<EditProduct />} />
          <Route path='/admin/dashboard/customers' element={<ListCustomer />} />
          <Route path='/admin/dashboard/orders' element={<ListOrder />} />
        </Route>
        <Route path='/unauthorized' element={<UnauthorizedPage />} />
      </Routes>
      {/* <Footer /> */}
    </>
  );
};

// ✅ Wrap everything under Router
function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
