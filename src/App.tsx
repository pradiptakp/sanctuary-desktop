import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import './App.global.css';

import '@fortawesome/fontawesome-free/css/all.min.css';
import './assets/styles/tailwind.css';
import './assets/styles/index.css';
import './assets/styles/nprogress.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, Slide } from 'react-toastify';
import { Provider as ReduxProvider, useSelector } from 'react-redux';

import { Layout } from './containers/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import { RootState, store } from './redux/store';

const contextClass = {
  success: 'bg-blue-600',
  error: 'bg-red-600',
  info: 'bg-gray-600',
  warning: 'bg-orange-400',
  default: 'bg-indigo-600',
  dark: 'bg-white-600 font-gray-300',
};

const Navigations = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Switch>
      {user ? (
        <>
          <Layout>
            <Switch>
              <Route path="/dashboard" exact component={Home} />

              <Redirect to="/dashboard" />
            </Switch>
          </Layout>
        </>
      ) : (
        <>
          <Route path="/login" exact component={Login} />

          <Redirect to="/login" />
        </>
      )}
    </Switch>
  );
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <Navigations />
        <ToastContainer
          transition={Slide}
          autoClose={2000}
          position="bottom-right"
          hideProgressBar
          toastClassName={(prop) =>
            contextClass[prop?.type || 'default'] +
            ' relative flex p-4 my-4 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
          }
        />
      </BrowserRouter>
    </ReduxProvider>
  );
}
