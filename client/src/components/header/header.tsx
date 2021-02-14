import * as React from "react";
import bhLogoHe from "../../assets/images/new-logo-hebrew.svg";
import bhLogoEn from "../../assets/images/new-logo-english.svg";
import {i18n} from "../../i18n";
import "./header.scss";

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
          <img className="bh-logo" alt="Beit Hatfutzot Logo" src={i18n.language === "he" ? bhLogoHe : bhLogoEn} />
        </div>
      </div>
    );
  }
}

export { Header };
