import React, {useState} from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import "./imageManipulation.scss";
import 'react-image-crop/lib/ReactCrop.scss';

interface ImageManipulationProps {
  rawImage: string;
  onFinished: (resizedImage: string) => void;
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
    width: 30,
    aspect: 16 / 9,
  });

  return (
    <div className={"imageManipulation"}>
      <ReactCrop
        src={props.rawImage}
        crop={crop}
        onChange={(newCrop) => setCrop(newCrop)}
        onImageLoaded={(image) => setImageRef(image)}/>
      {imageRef && <button onClick={() => {
        const resizedImage = getCroppedImg(imageRef, crop);
        console.log(resizedImage);
        props.onFinished(resizedImage);
      }}>Accept</button>}
    </div>
  );
}

export default ImageManipulation;
