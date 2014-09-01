define(["lodash", "backbone", "js/views/base", "game", "text!html/level.html"],
    function (_, Backbone, BaseView, Game, LevelTemplate) {
        return BaseView.extend({

            template: _.template(LevelTemplate),
            tagName: "div",

            name: "level",

            events: {

            },

            initialize: function (index) {
                BaseView.prototype.initialize.apply(this, arguments);

                this.levelIndex = _.isNumber(index) ? index : parseInt(index);
            },

            prepareData: function () {
                var view = this;

                return Game.db.getLevel(this.levelIndex).then(function (level) {
                    view.model = level;
                });
            }

        });
});