define(["lodash", "backbone", "js/views/base", "game", "js/enum", "text!html/welcome.html"],
    function (_, Backbone, BaseView, Game, Enum, WelcomeTemplate) {
        return BaseView.extend({

            template: _.template(WelcomeTemplate),
            tagName: "div",

            name: "welcome",

            events: {

            },

            initialize: function () {
                Game.eventsBus.once("levels.loaded", _.bind(this.toggleStartButton, this, true));

                BaseView.prototype.initialize.apply(this, arguments);
            },

            getTemplateData: function () {
                var td = BaseView.prototype.getTemplateData.apply(this, arguments);

                _.assign(td, {
                    buttonsClass: Game.status === Enum.GameStatus.LOADING ? "loading": ""
                });

                return td;
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

                return BaseView.prototype.hide.apply(this, arguments);
            },

            toggleStartButton: function (start) {
                this.$(".buttons").toggleClass("loading", _.isBoolean(start) ? !start : null);
            }

        });
});