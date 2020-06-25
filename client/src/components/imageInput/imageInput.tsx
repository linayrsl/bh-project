import * as React from "react";
import {Trans, WithTranslation, withTranslation} from 'react-i18next';
import "./imageInput.scss";
import ImageManipulation from "./imageManipulation/imageManipulation";
import loadImage from "blueimp-load-image";


interface ImageInputProps extends WithTranslation {
  id: string;
  onChange: (image: string | null) => void;
  defaultValue?: string; // In case of previously uploaded image, saved in localStorage
}

interface ImageInputState {
  rawImage: string | null;
  image: string | null;
  isWideImage: boolean;
  isProcessingImage: boolean;
}

class ImageInputComponent extends React.Component<ImageInputProps, ImageInputState> {

  constructor(props: Readonly<ImageInputProps>) {
    super(props);

    this.state = {
      rawImage: null,
      image: props.defaultValue || null,
      isWideImage: false,
      isProcessingImage: false
    };
  }

  getNaturalImageSize(image: string): Promise<{imageWidth: number, imageHeight: number}> {
    return new Promise<{imageWidth: number, imageHeight: number}>(
      (resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => {
          let imageWidth = img.naturalWidth;
          let imageHeight = img.naturalHeight;
          resolve({imageWidth, imageHeight});
        });
        img.addEventListener("error", () => {
          reject();
        });
        img.src = `data:image/jpeg;base64,${image}`;
      });
  }

  componentDidUpdate(prevProps: Readonly<ImageInputProps>, prevState: Readonly<ImageInputState>): void {
    if (!prevProps.defaultValue && this.props.defaultValue) {
      this.setState({ image: this.props.defaultValue! });
    }
    if (prevState.image !== this.state.image) {
      if (this.state.image) {
        this.getNaturalImageSize(this.state.image)
          .then(
            (naturalSize: {imageWidth: number, imageHeight: number}) => {
              let {imageWidth, imageHeight} = naturalSize;
              this.setState({isWideImage: imageWidth > imageHeight});
            }
          )
          .catch(() => {
            console.error("Failed to get image natural dimensions");
          });
      }

      this.props.onChange(this.state.image);
    }
  }

  imageChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      let image = fileList[0];
      if (image) {

        const configImage: any = {
          maxWidth: 800,
          maxHeight: 600,
          canvas: true
        };
        this.setState({isProcessingImage: true});


        loadImage(
          image,
          // @ts-ignore
          (canvas: HTMLCanvasElement) => {
            this.setState({ rawImage: canvas.toDataURL()});
          },
          configImage);
      }
    }
  }

  render() {
    const t = this.props.t;
    return (
      <div className="image-input-container">
        <label htmlFor={this.props.id}>
          {this.state.image ? t("imageInput.imageInputDirectionsChange", "החליפו תמונה") : t("imageInput.imageInputDirectionsAdd", "הוסיפו תמונה")}
        </label>
        <input
          disabled={this.state.isProcessingImage}
          onChange={
            this.imageChangeHandler.bind(this)
          }
          id={this.props.id}
          className="image-input"
          type="file"
          placeholder={this.state.image ? "החליפו תמונה" : "הוסיפו תמונה"}
          accept="image/jpeg,image/png"
        />
        <div className="image-location">
          {this.state.image && (
            <img
              className={this.state.isWideImage ? "wide-image" : "high-image"}
              src={`data:image/jpeg;base64,${this.state.image}`} />
          )}
        </div>
        {this.state.rawImage &&
        <ImageManipulation
          rawImage={this.state.rawImage}
          onFinished={(image: string) => this.setState({ image: image.replace("data:image/jpeg;base64,", ""), rawImage: null, isProcessingImage:  false}) }
          onCanceled={() => this.setState({rawImage: null, isProcessingImage:  false})}
        />}
      </div>
    );
  }
}

const ImageInput = withTranslation()(ImageInputComponent);
export { ImageInput };
