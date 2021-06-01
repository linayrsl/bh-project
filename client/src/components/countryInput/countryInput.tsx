import i18next from "i18next";
import React, { useMemo, useState } from "react";
import {
  Trans,
  useTranslation,
  WithTranslation,
  withTranslation,
} from "react-i18next";
import "./countryInput.scss";

const countries = require("i18n-iso-countries");
countries.registerLocale(require("i18n-iso-countries/langs/en.json"));
countries.registerLocale(require("i18n-iso-countries/langs/he.json"));

interface CountryInputProps {
  onChange: (country: string) => void;
}

const CountryInput: React.FunctionComponent<CountryInputProps> = ({
  onChange,
}) => {
  const [country, setCountry] = useState("");
  const { t } = useTranslation();
  const listOfCountries = useMemo(() => {
    const countriesNames: string[] = Object.values(
      countries.getNames(i18next.language === "en" ? "en" : "he", {
        select: "official",
      })
    );
    return Object.values(countriesNames).map((country) => (
      <option value={country} key={country}>
        {country}
      </option>
    ));
  }, [countries]);
  return (
    <div className="country-input-wrapper">
      <label htmlFor="country">
        <span className={"mandatory-field-indicator"}>*</span>
        <Trans i18nKey={"registerPage.registerFormCountry"}>
          מדינה
          <span className="mandatory-fields-register"> (שדות חובה *)</span>
        </Trans>
      </label>
      <select
        onChange={(event) => onChange(event.target.value)}
        id="country"
        name="country"
      >
        <option></option>
        {listOfCountries}
      </select>
    </div>
  );
};

export default CountryInput;
