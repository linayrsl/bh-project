import * as React from "react";

import "./textInput.css";

export interface TextInputProps {
  id: string;
  defaultValue?: string;
  title: string;
  className?: string;
  type: string;
  placeholder: string;
  validateRegex?: RegExp;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

class TextInput extends React.Component<TextInputProps> {
  validateInput(value: string) {
    if (!this.props.validateRegex) {
      return;
    }

    // TODO: validate input value against regex provided in props
  }

  render() {
    return (
      <div className={`${this.props.className || ""} text-input-container`}>
        <label htmlFor={this.props.id}>{this.props.title}</label>
        <input
          defaultValue={this.props.defaultValue}
          onChange={event => {
            this.validateInput(event.target.value);
            this.props.onChange(event);
          }}
          id={this.props.id}
          type={this.props.type}
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}

export { TextInput };
