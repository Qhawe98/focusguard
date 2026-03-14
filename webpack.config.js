const webpack = require("@nativescript/webpack");

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.chainWebpack((config) => {
    config.resolve.alias.set("application", "@nativescript/core/application");
    config.resolve.alias.set("utils/utils", "@nativescript/core/utils");
  });

  return webpack.resolveConfig();
};
