define(["lodash", "backbone", "js/views/base", "text!html/level.html"],
    function (_, Backbone, BaseView, LevelTemplate) {
        return BaseView.extend({

            template: _.template(LevelTemplate),
            tagName: "div",

            name: "level",

            events: {

            },

            render: function () {
                this.$el.html(this.template());

                return this.$el;
            }

        });
});