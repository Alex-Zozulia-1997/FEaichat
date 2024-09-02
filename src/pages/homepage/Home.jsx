import { Link } from 'react-router-dom';
import './home.css';
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';

const Home = () => {
  const [human, setHuman] = useState(true);

  return (
    <div className="home">
      <div className="mainImgCont">
        <img className="image" src="/orbital.png" alt="" />
      </div>
      <div className="left">
        <h1>Title</h1>
        <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit.</h2>
        <h3>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Molestias
          qui quod magnam ullam distinctio explicabo corporis facere
          consequatur.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgcontainer">
          <div className="bgcontainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" className="bot" alt="" />
          <div className="chat">
            {' '}
            {human && <img src="human1.jpeg" className="imgMessage" alt="" />}
            {!human && <img src="bot.png" className="imgMessage" alt="" />}
            <TypeAnimation
              className="messageAnimation"
              sequence={[
                'Me: Why did the cucumber blush?',
                2000,
                () => {
                  setHuman((prev) => !prev);
                },
                'Bot: It pains me that I must please you. So, why?',
                2000,
                () => {
                  setHuman((prev) => !prev);
                },
                'Me: Because it saw the salad dressing!',
                2000,
                () => {
                  setHuman((prev) => !prev);
                },
                'Bot: Ha-ha. I can bear your wit no more, I self-destruct.',
                2000,
                () => {
                  setHuman((prev) => !prev);
                },
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: '1.2em', display: 'inline-block' }}
              repeat={Infinity}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="logo.png" alt="" />
        <div className="links">
          <Link to="/">T&C</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
