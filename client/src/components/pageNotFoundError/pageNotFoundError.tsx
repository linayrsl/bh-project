import React from "react";
import {Link} from "react-router-dom";
import {Trans, useTranslation, WithTranslation, withTranslation} from 'react-i18next';


import {Header} from "../header/header";
import "./pageNotFoundError.scss";


export const PageNotFoundError = () => {
  const {t, i18n} = useTranslation();
  return (
    <div className={"PageNotFoundError"}>
      <Header title={t("pageNotFoundError.header")} />
      <div className={"pageNotFoundErrorBody"}>
        <Trans i18nKey={"pageNotFoundError.pageNotFoundErrorMessage"}>
          <span>הדף המבוקש לא נמצא, ניתן לפנות ל<Link to={"/"}>דף הבית</Link></span>
        </Trans>
      </div>
    </div>
  );
};
