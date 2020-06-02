import * as React from 'react';
import {useState} from "react";
import {Trans, useTranslation} from 'react-i18next';

import 'react-day-picker/lib/style.css';
import {CustomDayPickerCaption} from "./customDayPickerCaption";
import DayPicker from "react-day-picker";


export type YearSelectionHandler = (year: string) => void;

interface CustomOverlayProps {
  yearChangeHandler: YearSelectionHandler;
  overlayCloseHandler: () => void;
  dateChangeHandler: (date: Date) => void;
}

const CustomOverlay = (props: CustomOverlayProps) => {

  const [yearInputValue, setYearInputValue] = useState('');
  const [yearInputFieldErrorMessage, setYearInputFieldErrorMessage] = useState(false);

  const [month, setMonth] = useState(new Date());
  const {t, i18n} = useTranslation();
  const validateYearInput = (value: string) => {
    const valueRegex = /^[0-9]{4}$/;
    return valueRegex.test(value) && parseInt(value) <= new Date().getFullYear();
  }

  const activateHandler = () => {
    if (validateYearInput(yearInputValue)) {
      props.yearChangeHandler(yearInputValue);
      setYearInputFieldErrorMessage(false);
    } else {
      setYearInputFieldErrorMessage(true);
    }
  }
  return (
    <div
      onClick={(event) => event.stopPropagation()}
      className={'DayPickerInput-OverlayWrapper'}
      tabIndex={0}>
      <div className={'DayPickerInput-Overlay'}>
        <div className={'calendar-container'}>
        <div className={'overlay-input'}>
          <button
            id={'day-picker-close-button'}
            type={'button'}
            onClick={props.overlayCloseHandler}
          >&times;
          </button>
          <div className={'year-only-input-text'}>
            <Trans i18nKey={"customOverlay.yearOnlyInputText"}>במידה ולא ידוע תאריך מדויק הזינו שנה</Trans>
          </div>
          <div className={'year-input'}>
            <input
              placeholder={t("customOverlay.yearInoutPlaceholder", "הזינו שנה")}
              id={'custom-overlay-year-input'}
              type="number"
              pattern="[0-9]{4}"
              inputMode="numeric"
              onChange={(event) => setYearInputValue(event.target.value)}
              onKeyDown={event => {
                if (event.keyCode === 13) {
                  activateHandler();
                }
              }}/>
            <button
              type={'button'}
              onClick={() => {
                activateHandler();
              }}>
              <Trans i18nKey={"customOverlay.yearInputButtonText"}>אישור</Trans>
            </button>
            {yearInputFieldErrorMessage &&
            <div id={'year-input-error-message'}>
              <Trans i18nKey={"customOverlay.yearInputErrorMessage"} values={{currentYear: new Date().getFullYear()}}>
                * נא להזין שנה בת 4 ספרות (עד {new Date().getFullYear()})
              </Trans>
            </div>}
          </div>
          <div className={'date-input-separator'}>
            <Trans i18nKey={"customOverlay.dateInputSeparator"}>או</Trans>
          </div>
          <div id={'date-input-text'}>
            <Trans i18nKey={"customOverlay.dateInputText"}>בחרו תאריך מדויק</Trans>
          </div>
        </div>
        <DayPicker
          fromMonth={new Date(1900, 0)}
          toMonth={new Date()}
          onDayClick={(date) => {
            props.dateChangeHandler(date);
            props.overlayCloseHandler();
          }}
          month={month}
          captionElement={
            ({date, localeUtils}) => (
              <CustomDayPickerCaption
                date={date}
                localeUtils={localeUtils}
                onChange={(date) => setMonth(date)}
              />)}/>
        </div>
      </div>
    </div>
  );
}

export {
  CustomOverlay
};
