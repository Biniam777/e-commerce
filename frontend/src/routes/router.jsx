import { createBrowserRouter } from 'react-router-dom';

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
import PlaceholderPage from '../pages/PlaceholderPage.jsx';
import ProductDetail from '../pages/ProductDetail.jsx';
import Products from '../pages/Products.jsx';
import Register from '../pages/Register.jsx';
import AdminRoute from './AdminRoute.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const page = (eyebrow, title, description) => (
  <PlaceholderPage description={description} eyebrow={eyebrow} title={title} />
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: page(
          'Storefront',
          'Home',
          'The storefront foundation is ready.'
        )
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
            path: 'profile',
            element: page(
              'Account',
              'Profile',
              'Profile management will be added in a later checkpoint.'
            )
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
          }
        ]
      }
    ]
  }
]);
