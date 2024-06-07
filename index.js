/**
 * @format
 */



import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import ContextProvider from "./context/ContextProvider";
import { AuthProvider } from './src/auth/AuthProvider';

const Root = () => (
  <AuthProvider>
  <ContextProvider>
    <App />
  </ContextProvider>
  </AuthProvider>
);

AppRegistry.registerComponent(appName, () => Root);