import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "./app.scss";
import "react-toastify/dist/ReactToastify.css";
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

class App extends Component {
  render() {
    return (
      <div className="bh-app">
        <BrowserRouter>
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
    );
  }
}

export { App };
