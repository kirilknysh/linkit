define(["lodash", "backbone", "js/views/base", "game", "js/models/LevelsCollection", "text!html/levels.html"],
    function (_, Backbone, BaseView, Game, LevelsCollection, LevelsTemplate) {
        var LevelsView;

        LevelsView = BaseView.extend({

            template: _.template(LevelsTemplate),

            tagName: "div",

            name: "levels",

            model: new LevelsCollection(),

            prepareData: function () {
                var view = this;

                return Game.db.getAllLevels().then(function (levels) {
                    view.model.addLevels(levels);
                });
            },

            getTemplateData: function () {
                return { levels: this.model.getJSONLevels() };
            }

        });

        return LevelsView;
});