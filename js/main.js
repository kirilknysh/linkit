require.config({
    paths: {
        "jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min", "libs/jquery-2.1.1.min"],
        "lodash": ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min", "libs/lodash.min"],
        "backbone": ["//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min", "libs/backbone-min"]
    },

    map: {
        "backbone": {
            "underscore": "lodash"
        }
    }
});

require(["game"], function (Game) {
    Game.initialize();
});