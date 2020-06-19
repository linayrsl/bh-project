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
        src={props.rawImage}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onImageLoaded={(image) => setImageRef(image)}/>

        <div className={"editImageButtons"}>{imageRef && <button className={"accept"} onClick={() => {
          const resizedImage = getCroppedImg(imageRef, crop);
          console.log(resizedImage);
          props.onFinished(resizedImage);
        }}>
          <Trans i18nKey={"imageInput.ImageCropAcceptButton"}>אישור</Trans>
        </button>}
          <button onClick={() => props.onCanceled(props.rawImage)}>
            <Trans i18nKey={"imageInput.ImageCropCancelButton"}>ביטול</Trans>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageManipulation;
