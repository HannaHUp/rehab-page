const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          'react-native-web',
          '@react-native-async-storage/async-storage',
          'react-native-gesture-handler',
          'react-native-safe-area-context',
          'react-native-screens',
        ],
      },
    },
    argv
  );

  // Add resolver aliases for web-specific implementations
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native$': 'react-native-web',
  };

  // Add fallbacks for node modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'crypto': false,
    'stream': false,
    'path': false,
    'fs': false,
  };

  return config;
}; 