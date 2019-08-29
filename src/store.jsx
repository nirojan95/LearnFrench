import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success")
    return { ...state, loginStatus: true, username: action.username };
  if (action.type === "logout")
    return { ...state, loginStatus: false, username: "" };
  return state;
};

let store = createStore(
  reducer,
  { loginStatus: false, username: "" },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
