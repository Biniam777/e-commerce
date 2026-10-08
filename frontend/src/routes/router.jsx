import { createBrowserRouter } from 'react-router-dom';
import Payment from '../pages/Payment.jsx';
import AdminUserDetails from '../pages/admin/AdminUserDetails.jsx';
import AdminUsers from '../pages/admin/AdminUsers.jsx';
import AdminOrderDetails from '../pages/admin/AdminOrderDetails.jsx';
import AdminOrders from '../pages/admin/AdminOrders.jsx';
import AdminCategories from '../pages/admin/AdminCategories.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminProductForm from '../pages/admin/AdminProductForm.jsx';
import AdminProducts from '../pages/admin/AdminProducts.jsx';
import AppLayout from '../layouts/AppLayout.jsx';
import Cart from '../pages/Cart.jsx';
import Checkout from '../pages/Checkout.jsx';
import Login from '../pages/Login.jsx';
import OrderDetails from '../pages/OrderDetails.jsx';
import Orders from '../pages/Orders.jsx';
import Home from '../pages/Home.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import Products from '../pages/Products.jsx';
import Profile from '../pages/Profile.jsx';
import Register from '../pages/Register.jsx';
import AdminRoute from './AdminRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'products',
        element: <Products />
      },
      {
        path: 'products/:slug',
        element: <ProductDetail />
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'cart',
            element: <Cart />
          },
          {
            path: 'checkout',
            element: <Checkout />
          },
          {
            path: 'orders',
            element: <Orders />
          },
          {
            path: 'orders/:id',
            element: <OrderDetails />
          },
          {
            path: 'orders/:id/payment',
            element: <Payment />
          },
          {
            path: 'profile',
            element: <Profile />
          }
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'admin',
            element: <AdminDashboard />
          },
          {
            path: 'admin/products',
            element: <AdminProducts />
          },
          {
            path: 'admin/products/new',
            element: <AdminProductForm />
          },
          {
            path: 'admin/products/:slug/edit',
            element: <AdminProductForm />
          },
          {
            path: 'admin/categories',
            element: <AdminCategories />
          },
          {
            path: 'admin/orders',
            element: <AdminOrders />
          },
          {
            path: 'admin/orders/:id',
            element: <AdminOrderDetails />
          },
          {
            path: 'admin/users',
            element: <AdminUsers />
          },
          {
            path: 'admin/users/:id',
            element: <AdminUserDetails />
          }
        ]
      }
    ]
  }
]);
