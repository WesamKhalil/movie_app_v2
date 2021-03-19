const path = require("path")
require('../node_modules/dotenv').config({ path: __dirname + '../../.env' })

module.exports = {
    mode: "production",
    entry: {
        main: "./src/index.js"
    },
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    devServer: {
        contentBase: path.resolve(__dirname, "dist"),
        port: process.env.CLIENT_PORT || 5000,
        open: true,
        hot: true,
        proxy: {
            "/api": "http://localhost:" + process.env.SERVER_PORT || 3000
        },
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}