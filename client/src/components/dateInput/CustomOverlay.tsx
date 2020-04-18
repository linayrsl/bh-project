import * as React from 'react';
import {ReactNode} from "react";

import 'react-day-picker/lib/style.css';


export type YearSelectionHandler = (year: string) => void;

interface CustomOverlay {
  classNames: {overlayWrapper: string, overlay: string},
  selectedDay: Date,
  input: HTMLInputElement,
  children: ReactNode
}

const CustomOverlayFactory = (yearChangeHandler: YearSelectionHandler, overlayCloseHandler: () => void) => {
  return ({ classNames, selectedDay, input, children, ...props }: CustomOverlay) => {

    const validateYearInput = (value: string) => {
      const valueRegex = /^[0-9]{4}$/;
      return valueRegex.test(value) && parseInt(value) <= new Date().getFullYear();
    }

    const activateHandler = () => {
      const yearInputFieldErrorMessage = document.getElementById('year-input-error-message');
      const yearInput = document.getElementById('custom-overlay-year-input') as HTMLInputElement;
       if (validateYearInput(yearInput.value)) {
         yearChangeHandler(yearInput.value);
         yearInputFieldErrorMessage!.style.display = 'none';
       } else {

         yearInputFieldErrorMessage!.style.display = 'block';
       }
    }

    return (
      <div
        className={classNames.overlayWrapper}
        {...props}
      >
        <div className={classNames.overlay}>
          <div className={'overlay-input'}>
            <button
              id={'day-picker-close-button'}
              type={'button'}
              onClick={overlayCloseHandler}
            >&times;
            </button>
            <div className={'year-only-input-text'}>הזן שנה אם לא ידוע תאריך מדויק</div>
            <div>
              <input
                placeholder={'הזן שנה'}
                id={'custom-overlay-year-input'}
                type="number"
                pattern="[0-9]{4}"
                inputMode="numeric"
                onKeyDown={event => {
                  if (event.keyCode === 13) {
                    activateHandler();
                  }
                }}/>
              <button
                type={'button'}
                onClick={() => {
                  activateHandler();
                }}>שמור בחירה</button>
              <div id={'year-input-error-message'}>* נא להזין שנה בת 4 ספרות (עד {new Date().getFullYear()})</div>
            </div>
            <div className={'date-input-separator'}>או</div>
            <div>בחר תאריך מדויק</div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export {
  CustomOverlayFactory
};
