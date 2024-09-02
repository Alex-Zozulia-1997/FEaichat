import { useRef } from 'react';
import { IKContext, IKUpload } from 'imagekitio-react';

const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const authenticator = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/upload');

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImage }) => {
  const uploadref = useRef();

  const onError = (err) => {
    console.log('Error', err);
  };

  const onSuccess = (res) => {
    console.log('Success', res);
    setImage((perv) => ({
      ...perv,
      url: res,
      isLoading: false,
    }));
  };
  const onUploadProgress = (progress) => {
    console.log('Progress', progress);
  };

  const onUploadStart = (evt) => {
    const file = evt.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('File', reader.result);

      setImage((perv) => ({
        ...perv,
        isLoading: true,
        aiData: {
          inlineData: {
            data: reader.result.split(',')[1],
            mimeType: file.type,
          },
        },
      }));
    };
    reader.readAsDataURL(file);

    console.log('Start', evt);
  };

  //   function fileToGenerativePart(path, mimeType) {
  //     return {
  //       inlineData: {
  //         data: Buffer.from(fs.readFileSync(path)).toString('base64'),
  //         mimeType,
  //       },
  //     };
  //   }
  return (
    <>
      <IKContext
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}>
        <IKUpload
          fileName="test-upload.png"
          onError={onError}
          onSuccess={onSuccess}
          useUniqueFileName={true}
          onUploadProgress={onUploadProgress}
          onUploadStart={onUploadStart}
          style={{ display: 'none' }}
          ref={uploadref}
        />
        <label htmlFor="docForm" onClick={() => uploadref.current.click()}>
          <img src="/attachment.png"></img>
        </label>
      </IKContext>
    </>
  );
};

export default Upload;
