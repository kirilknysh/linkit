define(["lodash", "backbone", "js/views/base", "game", "text!html/welcome.html"],
    function (_, Backbone, BaseView, Game, WelcomeTemplate) {
        return BaseView.extend({

            template: _.template(WelcomeTemplate),
            tagName: "div",

            name: "welcome",

            events: {

            },

            getCssClasses: function () {
                var classes = BaseView.prototype.getCssClasses.apply(this, arguments);

                classes.push("text-view");

                return classes;
            },

            show: function (waitFor) {
                Game.eventsBus.trigger("header.toggleInstructions", false);

                return BaseView.prototype.show.apply(this, arguments);
            },

            hide: function () {
                Game.eventsBus.trigger("header.toggleInstructions", true);

                return BaseView.prototype.show.apply(this, arguments);
            }

        });
});