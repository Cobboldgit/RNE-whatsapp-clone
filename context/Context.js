import React, { createContext } from "react";
import { theme } from "../utils";

const GlobalContext = createContext({
  theme,
  lightMode: true,
  setLightMode: () => {},
  rooms: [],
  setRooms: () => {},
  unfilteredRooms: [],
  setUnfilteredRooms: () => {},
});

export default GlobalContext;
