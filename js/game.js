define(["lodash", "backbone", "jquery", "js/enum", "js/views/header", "js/models/dataAccessor"],
    function(_, Backbone, $, Enum, HeaderView, DataAccessor) {
        var game = {
                eventsBus: _.extend({}, Backbone.Events),
                db: null
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

                this.db = new DataAccessor();
                this.initializeDB().fail(function () {
                    return router.navigate("error/" + Enum.GameErrorTypes.NO_LEVELS_LOADED, { trigger: true });
                });
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
            },

            initializeDB: function () {
                return this.db.initDB()
                    .then(function () {
                        if (game.db.getLevelsCount() > 0) {
                            game.eventsBus.trigger("levels.loaded");
                        } else {
                            //no levels - let's try to load them!
                            return game.db.fetchLevels().then(function () {
                                game.eventsBus.trigger("levels.loaded");
                            });
                        }
                    });
            }
        });

        return game;
});