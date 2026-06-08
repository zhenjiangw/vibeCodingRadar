import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import '../styles/globals.css';

interface AppProps {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
