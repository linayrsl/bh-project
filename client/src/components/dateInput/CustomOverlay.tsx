import * as React from 'react';

import 'react-day-picker/lib/style.css';
import {ReactNode} from "react";


export type YearSelectionHandler = (year: string) => void;

interface CustomOverlay {
  classNames: {overlayWrapper: string, overlay: string},
  selectedDay: Date,
  input: HTMLInputElement,
  children: ReactNode
}


const CustomOverlayFactory = (yearChangeHandler: YearSelectionHandler) => {
  return ({ classNames, selectedDay, input, children, ...props }: CustomOverlay) => {

    const activateHandler = () => {
      const yearInput = document.getElementById('custom-overlay-year-input') as HTMLInputElement;
      yearChangeHandler(yearInput.value);
    }

    return (
      <div
        className={classNames.overlayWrapper}
        {...props}
      >
        <div className={classNames.overlay}>
          <div className={'overlay-input'}>
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
