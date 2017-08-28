const path = require("path");
const webpack = require("webpack");

module.exports = function(env) {
    return {
        entry: env === "prod" ? ["./src/index.ts"] : [
            "webpack-dev-server/client?http://0.0.0.0:8081",
            "webpack/hot/only-dev-server",
            "./src/index.ts"
        ],
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "src")
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: { appendTsSuffixTo: [/\.vue$/] }
            }, {
                test: /\.vue$/,
                loader: "vue-loader"
            }, {
                test: /\.json$/,
                loader: "json-loader"
            }, {
                test: /\.png$/,
                loader: "file-loader"
            }, {
                test: /\.jpg$/,
                loader: "file-loader"
            }, {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }]
        },
        resolve: {
            extensions: [".js", ".json", ".ts", ".html", ".vue"]
        },
        devServer: {
            hot: true,
            contentBase: path.resolve(__dirname, "src"),
            publicPath: "/",
            port: 8081
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ]
    };
};