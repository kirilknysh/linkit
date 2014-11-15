define(["lodash", "backbone", "js/views/base", "game", "js/models/LevelsCollection", "text!html/levels.html"],
    function (_, Backbone, BaseView, Game, LevelsCollection, LevelsTemplate) {
        var LevelsView;

        LevelsView = BaseView.extend({

            template: _.template(LevelsTemplate),

            tagName: "div",

            name: "levels",

            events: {
                "click .level-button.button": "onLevelButtonClick"
            },

            initialize: function () {
                BaseView.prototype.initialize.apply(this, arguments);

                this.model = new LevelsCollection();
            },

            prepareData: function () {
                var view = this;

                return Game.db.getAllLevels().then(function (levels) {
                    view.model.addLevels(levels);
                });
            },

            remove: function () {
                this.model.unload();

                BaseView.prototype.remove.apply(this, arguments);
            },

            getTemplateData: function () {
                return { levels: this.model.getJSONLevels() };
            },

            onLevelButtonClick: function (e) {
                var levelNumStr = e.target.dataset.levelNum,
                    levelNum = parseInt(levelNumStr, 10);

                if (!_.isNumber(levelNum)) {
                    return;
                }

                Game.navigateToLevel(levelNum);
            }

        });

        return LevelsView;
});