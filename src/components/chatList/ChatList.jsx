import { Link } from 'react-router-dom';
import './chatList.css';
import { useQuery } from '@tanstack/react-query';

const ChatList = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: 'include',
      }).then((res) => res.json()),
  });

  return (
    <div className="chatList">
      <span className="title">DASHBOARD</span>
      <Link to="/dashboard">Create a New Chat</Link>
      <Link to="/">Explore new Stuff</Link>
      <Link to="/">Contact</Link>
      <hr />
      <span className="title">CHATS</span>

      <div className="list no-scrollbar">
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {data &&
          data.map((chat) => (
            <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
              {chat.title}
            </Link>
          ))}
      </div>
      <hr />
      <div className="upgrade">
        <img src="/logo.png" alt="Upgrade Logo" />
        <div className="texts">
          <span>Upgrade to a Pro</span>
          <span>You will make me a bit happier</span>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
