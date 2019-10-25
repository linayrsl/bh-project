import * as React from "react";
import { Component } from "react";
import { History } from "history";
import { withRouter } from "react-router-dom";
import "./proceedButton.css";

export interface ProceedButtonProps {
  history?: History;

  text: string;
  nextPageUrl: string;
  disabled?: boolean;
  callback?: () => Promise<any>;

  tabIndex?: number;
}

class ProceedButtonComponent extends Component<ProceedButtonProps> {
  render() {
    return (
      <button
        tabIndex={this.props.tabIndex}
        disabled={this.props.disabled}
        onClick={() => {
          if (!this.props.callback) {
            return this.props.history!.push(this.props.nextPageUrl);
          }

          this.props.callback().then(() => {
            this.props.history!.push(this.props.nextPageUrl);
          });
        }}
        className={`proceed-button ${
          this.props.disabled === true ? "disabled" : ""
        }`}
      >
        {this.props.text}
      </button>
    );
  }
}

const ProceedButton = (withRouter(
  ProceedButtonComponent as any
) as any) as React.ComponentClass<ProceedButtonProps>;
export { ProceedButton };
