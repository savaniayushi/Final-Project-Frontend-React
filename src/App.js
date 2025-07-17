import React, { useEffect } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import { RouterProvider } from 'react-router-dom';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import ProductDetailPage from './pages/ProductDetailPage';
import Protected from './features/auth/Components/Protected';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItemsByUserIdAsync } from './features/cart/cartSlice';
import PageNotFound from './pages/404';
import OrderSuccessPage from './pages/OrderSuccessPage';
import UserOrdersPage from './pages/UserOrdersPage';
import UserProfilePage from './pages/UserProfilePage';
import { fetchLoggedInUserAsync } from './features/user/userSlice';
import { checkAuthAsync, selectLoggedInUser, selectUserChecked } from './features/auth/authSlice';
import Logout from './features/auth/Components/Logout';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminHome from './pages/AdminHome';
import ProtectedAdmin from './features/auth/Components/ProtectedAdmin';
import AdminProductDetailPage from './pages/AdminProductDetailPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import { createBrowserRouter } from 'react-router-dom';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js"
import { ToastContainer } from 'react-toastify';
import StripeCheckout from './pages/StripeCheckout.js';



const router = createBrowserRouter([
{
  path:'/',
  element:
    <Protected><Home /></Protected>
},
{
  path:'/admin',
  element:
  <ProtectedAdmin><AdminHome /></ProtectedAdmin>
},
{
  path:'/login',
  element:
    <LoginPage></LoginPage>
},
{
  path:'/signup',
  element:
    <SignupPage></SignupPage>
},
{
  path:'/cart',
  element:
  <Protected><CartPage /></Protected>
},
{
  path:'/checkout',
  element:
  <Protected><Checkout/></Protected>
},
{
  path:'/product-detail/:id',
  element:
  <Protected><ProductDetailPage /></Protected>
},
{
  path:'/admin/product-detail/:id',
  element:
  <Protected><AdminProductDetailPage /></Protected>
},
{
  path:'*',
  element:
  <PageNotFound></PageNotFound>
},
{
  path:'/order-success/:id',
  element:
  <OrderSuccessPage></OrderSuccessPage>
},
{
  path:'/orders',
  element:
  <UserOrdersPage></UserOrdersPage>
},
{
  path:'/profile',
  element:
    <UserProfilePage></UserProfilePage>
},
{
  path:'/logout',
  element:
  <Logout></Logout>
},
{
  path:'/forgot-password',
  element:
    <ForgotPasswordPage></ForgotPasswordPage>
},
{
  path:'/stripe-checkout/',
  element:
    <Protected><StripeCheckout></StripeCheckout></Protected>
},
{
  path:'/admin/product-form',
  element:
  <Protected><AdminProductFormPage></AdminProductFormPage></Protected>
},
{
  path:'/admin/product-form/edit/:id',
  element:
  <Protected><AdminProductFormPage></AdminProductFormPage></Protected>
},
{
  path:'/admin/orders',
  element:
    <Protected><AdminOrdersPage></AdminOrdersPage></Protected>
},

])

function App() {
  
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  const userChecked = useSelector(selectUserChecked);
  useEffect(()=>{
    dispatch(checkAuthAsync())

  },[dispatch])
  
  useEffect(() => {
    if (user) {
      dispatch(fetchLoggedInUserAsync());
      dispatch(fetchItemsByUserIdAsync()); // we can get req.user by token on backend so no need to give in front-end
  
    }
  },[dispatch,user])
 
  return (
    <>
    <div className='App'>
      {userChecked &&
        <RouterProvider router={router}/>}
    
    </div>

    <ToastContainer position="top-center"
               autoClose={2000} />
    </>

  );
}

export default App;


