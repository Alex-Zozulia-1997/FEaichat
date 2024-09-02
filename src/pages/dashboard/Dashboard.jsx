import { useNavigate } from 'react-router-dom';
import ChatList from '../../components/chatList/ChatList';
import './dashboard.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onMutation = useMutation({
    mutationFn: async (text) => {
      return await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['userChats'] });
      navigate(`/dashboard/chats/${id}`);
    },
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    onMutation.mutate(text);

    // try {
    //   const response = await fetch('http://localhost:3001/api/chats', {
    //     method: 'POST',
    //     credentials: 'include',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ text }),
    //   });

    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }

    //   e.target.text.value = '';
    // } catch (error) {
    //   console.error('There was a problem with the fetch operation:', error);
    //   alert('There was an error submitting your request. Please try again.');
    // }
  };
  return (
    <div className="dashboard">
      <div className="texts">
        <div className="logo">
          <img src="logo.png" alt="" className="logo" />
          <h1>Cool ChatGPT Copy </h1>
        </div>
        <div className="options">
          <div className="option">
            <img src="chat.png" alt="" />
            <span>Create a new chat</span>
          </div>
          <div className="option">
            <img src="image.png" alt="" />
            <span>Analyze an image</span>
          </div>
          <div className="option">
            <img src="code.png" alt="" />
            <span>Help Me Code</span>
          </div>
        </div>
      </div>
      <div className="formcontainer">
        <form action="" className="chatform" onSubmit={handleSubmit}>
          <input name="text" type="text" placeholder="Ask me anythin" />
          <button type="submit">
            <img src="/arrow.png" alt="" className="arrow" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;
