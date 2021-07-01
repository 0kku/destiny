module.exports = {
  entry: {
    app: "./components/App.ts",
  },
  /* So having this makes it work, but if we remove this, bundle, then start server, we get error in console, this is because Webpack is minifying the class and it's trying to name the custom element after the class name*/
  // optimization: {
  //   minimize: false
  // },
  output: {
    filename: "[name].js",
    path: __dirname + "/public/javascripts/",
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts"],
  },
};