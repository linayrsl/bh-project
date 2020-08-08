import React, {useContext} from "react";
import {AppConfig} from "../../contracts/appConfig";
import {appConfigContext} from "../../context/appConfigContext";

export interface WithAppConfigProps {
  config: AppConfig;
}

const withAppConfig = function<P extends WithAppConfigProps>(
  WrappedComponent: React.ComponentType<P>
) {
  return (props: Omit<P, keyof WithAppConfigProps>) => {
    const config = useContext(appConfigContext);
    return (
      <WrappedComponent {...props as P} config={config}/>
    );
  };
}

export { withAppConfig };
