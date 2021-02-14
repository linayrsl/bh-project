import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import {i18n} from "i18next";

import { HomePage } from "./components/homePage/homePage";
import { RegisterPage } from "./components/registerPage/registerPage";
import { VerificationPage } from "./components/verificationPage/verificationPage";
import { FamilyTreePageSubmitter } from "./components/familyTreePageSubmitter/familyTreePageSubmitter";
import { FamilyTreePageMother } from "./components/familyTreePageMother/familyTreePageMother";
import { FamilyTreePageFather } from "./components/familyTreePageFather/familyTreePageFather";
import { FamilyTreePageSiblings } from "./components/familyTreePageSiblings/familyTreePageSiblings";
import { FamilyTreePageSubmit } from "./components/familyTreePageSubmit/familyTreePageSubmit";
import { FamilyTreeThankYouPage } from "./components/familyTreeThankYouPage/familyTreeThankYouPage";
import {PageNotFoundError} from "./components/pageNotFoundError/pageNotFoundError";
import {ErrorBoundary} from "./components/errorBoundary/errorBoundary";
import {AppConfig} from "./contracts/appConfig";
import config from "./config";
import {appConfigContext} from "./context/appConfigContext";

import "./app.scss";
import "react-toastify/dist/ReactToastify.css";
import ReportAnalyticsPageView from "./components/reportAnalyticsPageView/reportAnalyticsPageView";


interface AppProps {
  i18n: i18n;
}

interface AppState {
  config: AppConfig;
}

class App extends Component<AppProps, AppState> {
  constructor(props: Readonly<AppProps>) {
    super(props);
    const language = props.i18n.language;
    if (language === "en" && typeof window !== "undefined") {
      window.document.title = "Family tree project of the Museum of the Jewish People"
    }

    this.state = {
      config: {
        ...config,
        ...((window as any).clientConfigOverride || {})
      }
    }
  }

  componentDidMount() {
    console.log("app did mount");
  }

  render() {
    const language = this.props.i18n.language;

    let direction = "rtl";
    if (language === "en") {
      direction = "ltr";
    }

    return (
      <appConfigContext.Provider
        value={this.state.config}>
        <div dir={direction} className="bh-app">
          <BrowserRouter basename={language === "en" ? "/en" : "/"}>
            <ReportAnalyticsPageView />
            <ErrorBoundary>
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route exact path="/register">
                  <RegisterPage />
                </Route>
                <Route path="/verification/:email">
                  <VerificationPage />
                </Route>
                <Route exact path="/family-tree/me">
                  <FamilyTreePageSubmitter />
                </Route>
                <Route exact path="/family-tree/mother">
                  <FamilyTreePageMother />
                </Route>
                <Route exact path="/family-tree/father">
                  <FamilyTreePageFather />
                </Route>
                <Route exact path="/family-tree/siblings">
                  <FamilyTreePageSiblings />
                </Route>
                <Route exact path="/family-tree/submit">
                  <FamilyTreePageSubmit />
                </Route>
                <Route exact path="/thank-you">
                  <FamilyTreeThankYouPage />
                </Route>
                <Route render={() => <PageNotFoundError />} />
              </Switch>
            </ErrorBoundary>
          </BrowserRouter>
          <ToastContainer
            position="bottom-right"
            autoClose={false}
            newestOnTop={false}
            closeOnClick
            rtl={true}
            draggable={false}
          />
        </div>
      </appConfigContext.Provider>
    );
  }
}

export { App };
