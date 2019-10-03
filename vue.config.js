const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  // pluginOptions: {
  //   webpackBundleAnalyzer: {
  //     openAnalyzer: true
  //   }
  // },
  configureWebpack: {
    plugins: [
      new CompressionPlugin({
        test: /\.(js|css|html|svg)$/,
      })
    ]
  },
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      exclude: [
        /\.map$/,
        /manifest\.json$/
      ],
    },
    themeColor: '#EC008C'
  },
  devServer: {
    port: 3000,
    host: "localhost",
  },
  // integrate Snap SVG
  chainWebpack: config => {
    config.module
      .rule("Snap")
      .test(require.resolve("snapsvg/dist/snap.svg.js"))
      .use("imports-loader")
      .loader("imports-loader?this=>window,fix=>module.exports=0");

    config.resolve.alias.set("snapsvg", "snapsvg/dist/snap.svg.js");
  }
};