import * as React from 'react';
import {useRef, useState} from "react";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {CustomDayPickerCaption} from './customDayPickerCaption'

import 'react-day-picker/lib/style.css';

import MomentLocaleUtils from 'react-day-picker/moment';
import './dateInput.css';
import {CustomOverlayFactory, YearSelectionHandler} from "./CustomOverlay";

export interface DateInputProps {
  title: string;
  id: string;
  defaultValue: string;
  onChange: (value: string) => void;
  className?: string;
  required?: boolean;
}

const DateInput = (props: DateInputProps) => {
  const [isValid, setIsValid] = useState(true);
  const [month, setMonth] = useState(new Date());

  const dayPickerRef = useRef<DayPickerInput>(null);

  const yearChangeHandler: YearSelectionHandler = year => {
    console.log(year);
    props.onChange(year);
    dayPickerRef.current!.hideDayPicker();
  };

  return (
    <div
      className={`${props.className || ""} ${isValid ? "" : "invalid"} date-input-container`}>
      <label htmlFor={props.id}>
        {props.required &&
        <span className={"mandatory-field-indicator"}>*</span>}
        {props.title}
      </label>
      <DayPickerInput
        ref={dayPickerRef}
        value={props.defaultValue}
        onDayChange={(selectedDay, modifiers, dayPickerInput) => {
          const input = dayPickerInput.getInput();
          console.log(selectedDay, input.value);
          props.onChange(input.value);
        }}
        keepFocus={false}
        overlayComponent={CustomOverlayFactory(yearChangeHandler)}
        formatDate={MomentLocaleUtils.formatDate}
        parseDate={MomentLocaleUtils.parseDate}
        format={'DD/MM/YYYY'}
        placeholder={'YYYY או DD/MM/YYYY'}
        dayPickerProps={{
          month: month,
          canChangeMonth: true,
          captionElement: (
            { date, localeUtils }) => (
              <CustomDayPickerCaption
                date={date}
                localeUtils={localeUtils}
                onChange={(date) => setMonth(date)}
                />)}}
        inputProps={
          {
            id: props.id,
            autoComplete: 'off',
            className: 'date-input-input'
          }}
      />
      {!isValid && <div className={"invalid-input-feedback"}>נא להזין שנה או תאריך</div>}
    </div>
  );
};

export {DateInput};
