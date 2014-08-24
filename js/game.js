define(["lodash", "backbone", "jquery", "js/enum", "js/views/header"],
    function(_, Backbone, $, Enum, HeaderView) {
        var game = {
            eventsBus: _.extend({}, Backbone.Events)
        };

        _.extend(game, {
            VERSION: "0.1",

            initialize: function (router) {
                var header = new HeaderView({ el: $("#header").get(0) });

                this.printVersionInfo();

                header.render();

                if (!this.checkBrowser()) {
                    return router.navigate("error/" + Enum.GameErrorTypes.OLD_BROWSER, { trigger: true });
                }

                this.eventsBus.on("header.toggleInstructions", _.bind(header.toggleInstructions, header));
            },

            printVersionInfo: function () {
                var log = console && console.log || function () {};
                log.call(console, "===========================");
                log.call(console, "= Backbone: " + Backbone.VERSION);
                log.call(console, "= Lodash: " + _.VERSION);
                log.call(console, "= jQuery: " + $.fn.jquery);
                log.call(console, "= Link It: " + this.VERSION);
                log.call(console, "===========================");
            },

            checkBrowser: function () {
                return !! (window.indexedDB);
            }
        });

        return game;
});