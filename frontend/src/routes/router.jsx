import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '../layouts/AppLayout.jsx';
import AdminRoute from './AdminRoute.jsx';
import Login from '../pages/Login.jsx';
import PlaceholderPage from '../pages/PlaceholderPage.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import Register from '../pages/Register.jsx';

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
        element: page('Storefront', 'Home', 'The storefront foundation is ready.')
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
        element: page('Catalog', 'Products', 'Product browsing will be added in a later checkpoint.')
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'cart',
            element: page('Shopping', 'Cart', 'Cart interactions will be added in a later checkpoint.')
          },
          {
            path: 'checkout',
            element: page('Shopping', 'Checkout', 'Checkout will be added in a later checkpoint.')
          },
          {
            path: 'orders',
            element: page('Account', 'Orders', 'Customer order history will be added in a later checkpoint.')
          },
          {
            path: 'profile',
            element: page('Account', 'Profile', 'Profile management will be added in a later checkpoint.')
          }
        ]
      },
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'admin',
            element: page('Operations', 'Admin dashboard', 'Admin workflows will be added in a later checkpoint.')
          }
        ]
      }
    ]
  }
]);