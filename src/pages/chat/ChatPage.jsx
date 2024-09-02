import { Fragment, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import './chatPage.css';
import NewPrompt from '../../components/newPrompt/NewPrompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { IKImage } from 'imagekitio-react';

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split('/').pop();
  const { isPending, error, data } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: 'include',
      }).then((res) => res.json()),
  });
  console.log(data);

  return (
    <div className="chatPage">
      <div className="wrapper no-scrollbar">
        <div className="chatAi no-scrollbar">
          {isPending ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            data?.history?.map((message, i) => (
              <Fragment key={i}>
                {message.img && (
                  <>
                    {console.log(
                      `${import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}${
                        message.img
                      }`
                    )}
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
                      path={message.img}
                      height={300}
                      width={400}
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  </>
                )}
                <div
                  className={
                    message.role === 'user' ? 'message human' : 'message ai'
                  }>
                  <MarkedDown
                    text={message.parts?.[0]?.text?.toString() || ''}
                  />
                </div>
              </Fragment>
            ))
          )}
          {data && <NewPrompt data={data} />}{' '}
        </div>
      </div>
    </div>
  );
};

const MarkedDown = ({ text }) => {
  return <Markdown>{text}</Markdown>;
};

export default ChatPage;
