import React from "react";
import {AppConfig} from "../contracts/appConfig";

export const appConfigContext = React.createContext<AppConfig>({} as any);
