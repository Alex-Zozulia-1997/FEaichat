import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';
import Markdown from 'react-markdown';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from '../../lib/geminy';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({ data }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);
    setQuestion(text);

    e.target.text.value = '';
  };
  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;
    if (data?.history?.length === 1) {
      add(data.history[0].parts[0].text, true);
      hasRun.current = true;
    }
  }, []);
  const [question, setQuestion] = useState('');
  const [answer, setanswer] = useState('');
  const [img, setimg] = useState({
    isLoading: false,
    url: {},
    error: '',
    aiData: {},
  });

  const chat = model.startChat({
    history: data?.history?.map(({ role, parts }) => ({
      role,
      parts: [
        { text: parts[0].text, img: parts[0].img ? parts[0].img : undefined },
      ],
      // img,
    })),
    generationConfig: {
      // maxOutputTokens: 100,
    },
  });

  const queryClient = useQueryClient();
  const onMutation = useMutation({
    mutationFn: async () => {
      console.log({
        question: question.length ? question : undefined,
        answer: answer.toString(),
        img: img.url.filePath || undefined,
      });
      return await fetch(
        `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: question.length ? question : undefined,
            answer: answer.toString(),
            img: img.url.filePath || undefined,
          }),
        }
      ).then((res) => res.json());
    },
    onSuccess: () => {
      formRef.current.reset();
      queryClient
        .invalidateQueries({ queryKey: ['chat', data._id] })
        .then(() => {
          setQuestion('');
          setanswer('');
          setimg({ isLoading: false, url: {}, error: '', aiData: {} });
        });
    },
    onError: (error) => {
      console.error('Error:', error);
    },
  });
  const formRef = useRef();
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }, [data, question, answer, img]);

  const add = async function run(prompt, initial) {
    if (!initial) setQuestion(prompt);
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, prompt] : prompt
      );
      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setanswer(accumulatedText);
      }
      onMutation.mutate();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {img.isLoading && <div className="loading">Loading...</div>}
      {img.url?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
          path={img.url.filePath}
          width={380}
        />
      )}
      {question && <div className="message human">{question}</div>}
      {answer && (
        <div className="message ai">
          <Markdown>{answer}</Markdown>
        </div>
      )}

      <div className="endOfChat" ref={ref}></div>
      <div className="newP">
        <form
          ref={formRef}
          className="promptForm"
          action=""
          onSubmit={handleSubmit}>
          <Upload setImage={setimg} />

          <input name="text" type="text" placeholder="Type a message" />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPrompt;
