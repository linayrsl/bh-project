import * as React from "react";
import {toast} from "react-toastify";
// @ts-ignore
import {readAndCompressImage} from "browser-image-resizer";
import "./imageInput.css";

interface ImageInputProps {
  id: string;
  onChange: (image: string | null) => void;
  defaultValue?: string; // In case of previously uploaded image, saved in localStorage
}

interface ImageInputState {
  image: string | null;
}

class ImageInput extends React.Component<ImageInputProps, ImageInputState> {
  constructor(props: Readonly<ImageInputProps>) {
    super(props);

    this.state = {
      image: props.defaultValue || null
    }
  }

  componentDidUpdate(prevProps: Readonly<ImageInputProps>, prevState: Readonly<ImageInputState>): void {
    if (!prevProps.defaultValue && this.props.defaultValue) {
      this.setState({ image: this.props.defaultValue! });
    }
    if (prevState.image !== this.state.image) {
      this.props.onChange(this.state.image);
    }
  }

  imageChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    let fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      let image = fileList[0];
      if (image) {
        this.setState({ image: "" });

        const configImage = {
          quality: 0.8,
          maxWidth: 800,
          maxHeight: 600,
          autoRotate: true,
          debug: false
        };
        readAndCompressImage(image, configImage)
          .then((resizedImage: Blob) => {
            let reader = new FileReader();
            reader.onload = () => {
              if (reader.result) {
                this.setState({ image: reader.result!.toString()});
              }
              else {
                toast.error("לא ניתן להטעין את התמונה שנבחרה");
              }
            };
            reader.onerror = () => {
              toast.error("לא ניתן להטעין את התמונה שנבחרה");
            };
            reader.readAsDataURL(resizedImage);
          });
      }
    }
  }

  render() {
    return (
      <div className="image-input-container">
        <label htmlFor={this.props.id}>
          הוסיפו תמונה
        </label>
        <input
          onChange={this.imageChangeHandler.bind(this)}
          id={this.props.id}
          className="image-input"
          type="file"
          placeholder="הוסיפו תמונה"
          accept="image/jpeg"
        />
        <div className="image-location">
          {this.state.image && (
            <img style={{}} src={this.state.image} />
          )}
        </div>
      </div>
    );
  }
}

export { ImageInput };
