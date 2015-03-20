({
    baseUrl: "./",
    paths: {
        "jquery": "empty:",
        "lodash": "empty:",
        "backbone": "empty:"
    },
    optimizeCss: "none",//CSS will be optimized by less itself
    dir: "build",
    optimize: "uglify2",
    fileExclusionRegExp: /(^\.)|(^r.js$)|(build.js)|(build.bat)|(.psd$)|(.less$)|(node_modules)/
})