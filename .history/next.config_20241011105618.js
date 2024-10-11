const withTM = require('next-transpile-modules')(['react-bootstrap']);

module.exports = withTM({
  reactStrictMode: true,
  // I don't want it to run when compiling as I trust the CI stage of the pipeline and Husky.
  ignoreDuringBuilds: true,
  images: {
    domains: ['shorturl.at', 'imgs.search.brave.com', 'example.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.module.rules.push({
        test: /\.js$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });
    }
    return config;
  },
});
