define(["lodash", "backbone", "js/views/base", "game", "text!html/gameOver.html"],
    function (_, Backbone, BaseView, Game, GameOverTemplate) {
        var GameOverView;

        GameOverView = BaseView.extend({

            template: _.template(GameOverTemplate),

            tagName: "div",

            name: "gameOver"

        });

        return GameOverView;
});