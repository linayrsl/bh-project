import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./app.css";
import { HomePage } from "./components/homePage/homePage";
import { RegisterPage } from "./components/registerPage/registerPage";
import { VerificationPage } from "./components/verificationPage/verificationPage";
import { FamilyTreePageSubmitter } from "./components/familyTreePageSubmitter/familyTreePageSubmitter";
import { FamilyTreePageMother } from "./components/familyTreePageMother/familyTreePageMother";
import { FamilyTreePageFather } from "./components/familyTreePageFather/familyTreePageFather";
import { FamilyTreePageSiblings } from "./components/familyTreePageSiblings/familyTreePageSiblings";
import { FamilyTreePageSubmit } from "./components/familyTreePageSubmit/familyTreePageSubmit";
import { FamilyTreeThankYouPage } from "./components/familyTreeThankYouPage/familyTreeThankYouPage";

class App extends Component {
  render() {
    return (
      <div className="bh-app">
        <BrowserRouter>
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
            <Route render={() => <div>Page Not Found</div>} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export { App };
