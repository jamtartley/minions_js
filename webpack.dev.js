const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    watch: true,
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        stats: "errors-only",
        open: true
    },
});

