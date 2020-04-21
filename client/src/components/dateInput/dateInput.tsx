import * as React from 'react';
import {useEffect, useState} from "react";
import moment from 'moment';

import calenderLogo from "../../assets/images/bx-calendar.svg";
import 'react-day-picker/lib/style.css';

import './dateInput.scss';
import {CustomOverlay, YearSelectionHandler} from "./CustomOverlay";

export interface DateInputProps {
  title: string;
  id: string;
  defaultValue: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

const DateInput = (props: DateInputProps) => {

  const validateDate = (value: string) => {
    const dateInputRegex = /^(\d{2}\/\d{2}\/\d{4}|[0-9]{4})$/;
    if (dateInputRegex.test(value)) {
      setIsValid(true);
      return true;
    }
    setIsValid(false);
    return false;
  }

  const [isCalendarDisplayed, setCalendarDisplayed] = useState(false);
  const [isValid, setIsValid] = useState(true);


  useEffect(() => {
    if (props.defaultValue) {
      validateDate(props.defaultValue);
    } else {
      setIsValid(!props.required)
    }
  }, [props.defaultValue]);


  const yearChangeHandler: YearSelectionHandler = year => {
    console.log(year);
    props.onChange(year);
    setCalendarDisplayed(false);
  };

  return (
    <div
      onClick={(event => {
        setCalendarDisplayed(!isCalendarDisplayed);
      })}
      className={`${props.className || ""} ${isValid ? "" : "invalid"} date-input-container`}>
      <label htmlFor={props.id}>
        {props.required &&
        <span className={"mandatory-field-indicator"}>*</span>}
        {props.title}
      </label>
      <div className={'date-input'}>
        <button
          type={'button'}>
          <img src={calenderLogo} alt={'calender-logo'}/>
        </button>
        <div className={'date-calendar'}>{props.defaultValue}</div>
        {isCalendarDisplayed &&
        <CustomOverlay
          dateChangeHandler={(date) => {
            props.onChange(moment(date).format('DD/MM/YYYY'));
          }}
          yearChangeHandler={yearChangeHandler}
          overlayCloseHandler={() => setCalendarDisplayed(false)}
        />}
      </div>
      {!isValid && <div className={"invalid-input-feedback"}>נא להזין שנה או תאריך</div>}
    </div>
  );
};

export {DateInput};
