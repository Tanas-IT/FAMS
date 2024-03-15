import React, { createContext, useState } from "react";
export const AuthContext = createContext({
  token: null,
  setToken: (data) => {},
  authenticate: (token) => {},
  getAuthenticate: () => {},
  logOut: () => {},
});

function AuthContextProvider({ children, ...props }) {
  const [token, setToken] = useState();

  function setTokenFunc(tokenParameter) {
    setToken(tokenParameter);
  }

  function authenticate(token) {
    setToken(token);
    localStorage.setItem("token", JSON.stringify(token));
  }
  function getAuthenticate() {
    if (!token) {
      return JSON.parse(localStorage.getItem("token"));
    }
    return token;
  }
  function logOut() {
    localStorage.removeItem("token");
  }

  const value = {
    token: token,
    setToken: setTokenFunc,
    authenticate: authenticate,
    getAuthenticate: getAuthenticate,
    logOut: logOut,
  };

  return (
    <AuthContext.Provider value={value} {...props}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
