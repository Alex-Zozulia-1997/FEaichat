import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import ChatPage from './pages/chat/ChatPage.jsx';
import RootLayout from './layouts/rootLayout/RootLayout.jsx';
import Home from './pages/homepage/Home.jsx';
import DahsboardLayout from './layouts/dashboardlayout/DahsboardLayout.jsx';
import SignInPage from './pages/signIn/SignIn.jsx';
import SignUpPage from './pages/signUp/SignUp.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/sign-in/*', element: <SignInPage /> },
      { path: '/sign-up/*', element: <SignUpPage /> },

      {
        element: <DahsboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <Dashboard />,
          },

          { path: '/dashboard/chats/:id', element: <ChatPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />{' '}
  </React.StrictMode>
);
