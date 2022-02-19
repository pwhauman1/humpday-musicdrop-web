import React from 'react';
import Router, { IRouterProps } from './pages/router';
import LoginModule from "./modules/loginModule";
import "antd/dist/antd.css";
import './App.scss';

function App() {
  const [isLoggedIn, updateLoginState] = React.useState<boolean>(false);
  const loginModule = LoginModule.init(updateLoginState);

  // on first render, check if we are logged in
  React.useEffect(() => {
    if (loginModule.isLoggedIn()) {
      // try to login with token or something
      updateLoginState(true);
    }
  }, []);

  // Passing a logged in var down allows for the whole app to update appropriately
  const routerComponentProps: IRouterProps = {
    isLoggedIn,
  }
  return (
    <div className="App">
      <Router {...routerComponentProps} />
    </div>
  );
}

export default App;
