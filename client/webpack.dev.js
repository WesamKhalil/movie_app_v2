const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require("path")

module.exports = merge(common, {
    mode: "development",
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        port: process.env.CLIENT_PORT || 8080,
        open: true,
        hot: true,
        proxy: {
            "/api": "http://localhost:" + process.env.SERVER_PORT || 3000
        },
        historyApiFallback: true
    },
})