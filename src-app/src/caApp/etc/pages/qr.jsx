import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { useNavigate, useParams } from 'react-router-dom';

const Test = ({ }) => {
    const navigate = useNavigate();
    const { _sid } = useParams();
    const webcamRef = useRef(null);
    const [scannedCode, setScannedCode] = useState(null);
    const isUUIDv4 = (str) => {
        const uuidv4Regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return uuidv4Regex.test(str);
    }
    const captureFrame = () => {
        const imageSrc = webcamRef.current.getScreenshot();

        if (imageSrc) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = webcamRef.current.video.clientWidth;
            canvas.height = webcamRef.current.video.clientHeight;

            const img = new Image();
            img.src = imageSrc;

            img.onload = () => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    if (isUUIDv4(code.data)) {
                        navigate(`./../../customers/${_sid}/${code.data}`);
                    } else {
                        setScannedCode("Invalid QR");
                    }
                } else {
                    requestAnimationFrame(captureFrame);
                }
            };
        } else {
            requestAnimationFrame(captureFrame);
        }
    };

    useEffect(() => {
        requestAnimationFrame(captureFrame);
    }, [captureFrame]);

    return (
        <div>
             <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative bg-black">
            <Webcam
                audio={false}
                height={640}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
            />
           {scannedCode && (
        <p className="mb-2 text-lg font-semibold text-red-500 text-center">
          {scannedCode}
        </p>
      )}
        </div>
        </div>
        </div>
    );
};

export default Test;