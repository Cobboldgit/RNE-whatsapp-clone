import React, { useState } from "react";
import Context from "./Context";
import { theme } from "../utils";

export default ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [unfilteredRooms, setUnfilteredRooms] = useState([]);
  const [lightMode, setLightMode] = useState(true);

  return (
    <Context.Provider
      value={{
        theme,
        lightMode,
        setLightMode,
        rooms,
        setRooms,
        unfilteredRooms,
        setUnfilteredRooms,
      }}
    >
      {children}
    </Context.Provider>
  );
};
