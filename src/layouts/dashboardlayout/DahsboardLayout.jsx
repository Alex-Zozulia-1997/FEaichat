import { Outlet, useNavigate } from 'react-router-dom';
import './dahsboardLayout.css';
import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import ChatList from '../../components/chatList/ChatList';

const DahsboardLayout = () => {
  const { userId, isLoaded } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in');
    }
  }, [userId, isLoaded]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList />
      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default DahsboardLayout;
