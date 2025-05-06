import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('main', () => App);

// Register the app for web
if (typeof document !== 'undefined') {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication('main', { rootTag });
} 