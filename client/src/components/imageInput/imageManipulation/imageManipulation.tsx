import React, {useEffect, useState} from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import {Trans, WithTranslation, withTranslation} from 'react-i18next';

import "./imageManipulation.scss";
import 'react-image-crop/lib/ReactCrop.scss';

interface ImageManipulationProps {
  rawImage: string;
  onFinished: (resizedImage: string) => void;
  onCanceled: (rawImage: string) => void;
}

function rotateImage(rawImage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = function() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext("2d");

      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const width = canvas.width;
      const height = canvas.height;

      canvas.width = height;
      canvas.height = width;

      ctx!.translate(canvas.width, canvas.height / canvas.width);
      ctx!.rotate(Math.PI / 2);
      ctx!.drawImage(image,0,0);

      resolve(canvas.toDataURL());
    };

    image.onerror = function(error) {
      reject(error);
    }

    image.src = rawImage;
  });
}

function getCroppedImg(image: HTMLImageElement , crop: Crop): string {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width!;
  canvas.height = crop.height!;
  const ctx = canvas.getContext('2d');

  if (!crop || !ctx) {
    throw new Error("Crop or context is undefined");
  }
  ctx.drawImage(
    image,
    crop.x! * scaleX,
    crop.y! * scaleY,
    crop.width! * scaleX,
    crop.height! * scaleY,
    0,
    0,
    crop.width!,
    crop.height!
  );
  return canvas.toDataURL("image/jpeg");
}

function ImageManipulation(props: ImageManipulationProps) {
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [rawImage, setRawImage] = useState(props.rawImage);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className={"imageManipulation"}>
      <div className={"imageContainer"}>
      <div className={"imageEditingText"}>
        <Trans i18nKey={"imageInput.ImageCropText"}>ניתן לחתוך את התמונה אם צריך</Trans>
      </div>
      <ReactCrop
        className={"componentContainer"}
        src={rawImage}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onImageLoaded={(image) => setImageRef(image)}/>

        <div className={"editImageButtons"}>
          {imageRef &&
          <button type={"button"} className={"accept"} onClick={() => {
            const resizedImage = getCroppedImg(imageRef, crop);
            props.onFinished(resizedImage);
          }}>
            <Trans i18nKey={"imageInput.ImageCropAcceptButton"}>אישור</Trans>
          </button>}
          <button type={"button"} onClick={() => props.onCanceled(rawImage)}>
            <Trans i18nKey={"imageInput.ImageCropCancelButton"}>ביטול</Trans>
          </button>
          <button type={"button"} onClick={(event) => {
            rotateImage(rawImage)
              .then((imageDataUrl) => {
                setRawImage(imageDataUrl);
                setCrop({
                  unit: '%',
                  width: 100,
                  height: 100,
                });
              });
          }}>
            <Trans i18nKey={"imageInput.ImageRotateButton"}>
              סובב
            </Trans>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageManipulation;
