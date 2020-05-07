import React from "react";
import { withRouter } from "react-router";
import { LocationDescriptorObject } from "history";
import {Link} from "react-router-dom";

import {Header} from "../header/header";
import "./errorBoundary.scss";


interface ErrorBoundaryProps {
  location?: LocationDescriptorObject;
  children: any;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryComponent extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidUpdate(prevProps: Readonly<ErrorBoundaryProps>, prevState: Readonly<ErrorBoundaryState>): void {
    if (prevProps.location!.pathname !== this.props.location!.pathname) {
      if (this.state.hasError) {
        this.setState({hasError: false});
      }
    }
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={"ErrorBoundary"}>
          <Header title={"פרויקט עצי המשפחה"}/>
          <h1>
             אירעה שגיאה בדף המבוקש, ניתן לפנות&nbsp;<a href={"https://www.bh.org.il/he/%D7%A6%D7%A8%D7%95-%D7%A7%D7%A9%D7%A8/"}>לתמיכה של המוזיאון העם היהודי</a>&nbsp;או&nbsp;
            <Link to={"/"}>לנסות בשנית</Link>
          </h1>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary = withRouter(ErrorBoundaryComponent as any) as React.ComponentType<ErrorBoundaryProps>;
export { ErrorBoundary };
