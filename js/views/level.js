define(["lodash", "backbone", "js/views/base", "game", "text!html/level.html"],
    function (_, Backbone, BaseView, Game, LevelTemplate) {
        return BaseView.extend({

            template: _.template(LevelTemplate),
            tagName: "div",

            name: "level",

            events: {
                "click .check-solution": "onCheckSolutionClick"
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
            },

            onCheckSolutionClick: function (e) {
                alert(this.validatelevel(this.getLevelSolution()));
            },

            getLevelSolution: function () {
                return {
                    "0": "1",
                    "1": "2",
                    "2": "0"
                };
            },

            validatelevel: function (solution) {
                return this.model.checkSolution(solution);
            }

        });
});