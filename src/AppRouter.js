import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import Login from './components/login/Login.tsx';
import { AuthProvider } from './context/auth.context.js';
import React from 'react';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/app',
        element: <App />,
      },
    ],
  },
]);


export default function AppRouter() {
  return (
      <RouterProvider router={router} />
  );
}
