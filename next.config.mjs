// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

import webpack from 'webpack';


import { config as dotenvConfig } from 'dotenv';
// import { EnvironmentPlugin } from 'webpack';
const { EnvironmentPlugin } = webpack;

const { parsed: localEnv } = dotenvConfig();

const nextConfig = {
  webpack(config) {
    config.plugins.push(new EnvironmentPlugin(localEnv));
    return config;
  },
};

export default nextConfig;
