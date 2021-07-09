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
  isTriggered?: boolean;
}

class ProceedButtonComponent extends Component<ProceedButtonProps> {
  handleClick() {
    if (!this.props.callback) {
      return this.props.history!.push(this.props.nextPageUrl);
    }

    this.props.callback().then(() => {
      this.props.history!.push(this.props.nextPageUrl);
    });
  }

  componentDidMount() {
    if (this.props.isTriggered && !this.props.disabled) {
      this.handleClick();
    }
  }

  componentDidUpdate(prevProps: ProceedButtonProps) {
    if (
      this.props.isTriggered !== prevProps.isTriggered &&
      this.props.isTriggered &&
      !this.props.disabled
    ) {
      this.handleClick();
    }
  }

  render() {
    return (
      <div className="buttom">
        <button
          tabIndex={this.props.tabIndex}
          disabled={this.props.disabled}
          onClick={this.handleClick.bind(this)}
          className={`proceed-button ${
            this.props.disabled === true ? "disabled" : ""
          }`}
        >
          {this.props.text}
        </button>
      </div>
    );
  }
}

const ProceedButton = withRouter(
  ProceedButtonComponent as any
) as any as React.ComponentClass<ProceedButtonProps>;
export { ProceedButton };
