import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import React from 'react';

import { AuthProvider } from './context/auth.context.js';

import Login from './components/login/Login.jsx';
import HomeComponent from './components/home/HomeComponent.jsx';
import ManageRequests from './components/manage-requests/ManageRequests.jsx'; 
import AddCar from './components/add-car/AddCar.jsx';
import AddRequestUser from './components/add-request-user/AddRequestUser.jsx';
import ManageCars from './components/manage-cars/ManageCars.jsx';
import FormViewEditCar from './components/form-view-edit-car/FormViewEditCar.jsx';
import ManageUsers from './components/manage-users/ManageUser.jsx';
import AddUser from './components/add-user/AddUser.jsx';
import FormViewEditUser from './components/form-view-edit-users/FormViewEditUser.jsx'; 
import FormViewEditRequest from './components/form-view-edit-request/FormViewEditRequest.jsx';

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
        path: '/home',
        element: <HomeComponent />,
      },
      {
        path: '/manage-requests',
        element: <ManageRequests />,
      },
      {
        path: '/add-car',
        element: <AddCar />,
      },
      {
        path: '/new-request',
        element: <AddRequestUser />,
      },
      {
        path: '/manage-cars',
        element: <ManageCars />,
      },
      {
        path: '/edit-cars/:id', 
        element: <FormViewEditCar />,
      },
      {
        path: '/add-user',
        element: <AddUser />,
      },
      {
        path: '/manage-users',
        element: <ManageUsers />,
      },
      {
        path: '/edit-user/:id', 
        element: <FormViewEditUser />,
      },
      {
        path: '/edit-request/:id', 
        element: <FormViewEditRequest />,
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