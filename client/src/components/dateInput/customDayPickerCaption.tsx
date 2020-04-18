import * as React from 'react';
import {LocaleUtils} from "react-day-picker";
import {useRef} from "react";

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();

const fromMonth = new Date(1900, 0);
const toMonth = new Date(currentYear, currentMonth);

interface CustomCaptionProps {
  date: Date,
  localeUtils: LocaleUtils,
  onChange: (date: Date) => void
}


const CustomDayPickerCaption = ({ date, localeUtils, onChange}: CustomCaptionProps) => {
  const monthInputRef = useRef<HTMLSelectElement>(null);
  const yearInputRef = useRef<HTMLSelectElement>(null);

  const months = localeUtils.getMonths();

  const years = [];
  for (let i = fromMonth.getFullYear(); i <= toMonth.getFullYear(); i += 1) {
    years.push(i);
  }

  const handleChange = function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const month = monthInputRef.current;
    const year = yearInputRef.current;
    onChange(new Date(parseInt(year!.value), parseInt(month!.value)));
  };

  return (
    <div className="DayPicker-Caption">
      <select ref={monthInputRef} name="month" onChange={handleChange} value={date.getMonth()}>
        {months.map((month, i) => (
          <option key={month} value={i}>
            {month}
          </option>
        ))}
      </select>
      <select ref={yearInputRef} name="year" onChange={handleChange} value={date.getFullYear()}>
        {years.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}

export {CustomDayPickerCaption};
