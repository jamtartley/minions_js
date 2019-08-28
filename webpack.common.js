const path = require('path');

module.exports = {
    entry: [
        './src/styles/index.less',
        './src/js/index.js'
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }]
            },
            {
                test: /\.(eot|png|jp(e*)g|svg|ttf|otf|woff|woff2)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        limit: 8000,
                        name: 'images/[name].[ext]'
                    }
                }]
            },
        ]
    },
};
