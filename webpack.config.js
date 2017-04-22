var path = require('path');

module.exports = {
    entry: ['./src/app.tsx'],
    output: {
        filename: "./dist/bundle.js",
    },

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.

        modules: [
            path.join(__dirname, 'src'),
            "node_modules"
        ],

        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    
        // resolveLoader: {
        //     root: path.join(__dirname, 'node_modules')
        // }
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {
                test: /\.tsx?$/, loaders: ["ts-loader"]
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader' ]
            },
            { test: /\.(ttf|woff|woff2|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" }
        ],
    },

    target: 'electron-main'
};