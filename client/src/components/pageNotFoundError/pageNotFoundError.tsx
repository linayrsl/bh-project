import React from "react";
import {Link} from "react-router-dom";

import {Header} from "../header/header";
import "./pageNotFoundError.scss";


export const PageNotFoundError = () => {
  return (
    <div className={"PageNotFoundError"}>
      <Header title={"פרויקט עצי המשפחה"} />
      <div className={"pageNotFoundErrorBody"}> הדף המבוקש לא נמצא, ניתן לפנות ל<Link to={"/"}>דף הבית</Link></div>
    </div>
  );
};
