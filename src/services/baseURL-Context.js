import React from "react";

export const BaseURLContext = React.createContext({
    baseURL: "http://127.0.0.1:8000/api/",
    setBaseURL: () => {},
});