require.config({
    paths: {
        "jquery": ["//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min", "js/libs/jquery-2.1.1.min"],
        "lodash": ["//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min", "js/libs/lodash.min"],
        "backbone": ["//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.2/backbone-min", "js/libs/backbone-min"],
        "cryptojs-aes": ["js/libs/aes"],
        "text": "js/libs/text",
        "game": "js/game",
        "router": "js/router"
    },

    map: {
        "backbone": {
            "underscore": "lodash"
        }
    },

    shim: {
        "cryptojs-aes": {
            "exports": "CryptoJS"
        }
    },

    baseUrl: "./"
});

require(["backbone", "game", "router"], function (Backbone, Game, Router) {
    var router = new Router();

    Backbone.history.start();

    Game.initialize(router);

    window.g = Game;
});