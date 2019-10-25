import * as React from "react";
import bhLogo from "../../assets/images/bh-logo-he.svg";
import "./header.css";

export interface HeaderProps {
  title: string;
  className?: string;
}

class Header extends React.Component<HeaderProps> {
  render() {
    return (
      <div className={`${this.props.className || ""} bh-header`}>
        <div className="title">{this.props.title}</div>
        <div className="logo">
          <img className="bh-logo" alt="Beit Hatfutzot Logo" src={bhLogo} />
        </div>
      </div>
    );
  }
}

export { Header };
