import * as React from "react";

import "./textInput.css";

export interface TextInputProps {
  id: string;
  defaultValue?: string;
  title: string;
  className?: string;
  type: string;
  placeholder: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

class TextInput extends React.Component<TextInputProps> {
  render() {
    return (
      <div className={`${this.props.className || ""} text-input-container`}>
        <label htmlFor={this.props.id}>{this.props.title}</label>
        <input
          defaultValue={this.props.defaultValue}
          onChange={this.props.onChange}
          id={this.props.id}
          type={this.props.type}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export { TextInput };
