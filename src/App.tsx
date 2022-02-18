import React from 'react';
import Router, { IRouterProps } from './components/router';
import LoginModule from "./modules/loginModule";

function App() {
  const [isLoggedIn, updateLoginState] = React.useState<boolean>(false);
  LoginModule.init(updateLoginState);

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
