define(["lodash", "backbone", "jquery", "js/views/header"],
    function(_, Backbone, $, HeaderView) {
        var game = {
            eventsBus: _.extend({}, Backbone.Events)
        };

        _.extend(game, {
            initialize: function (router) {
                var header = new HeaderView({ el: $("#header").get(0) });

                header.render();
                this.eventsBus.on("header.toggleInstructions", _.bind(header.toggleInstructions, header));
            }
        });

        return game;
});