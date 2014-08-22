define(["lodash", "backbone", "text!html/header.html"],
    function (_, Backbone, HeaderTemplate) {
        return Backbone.View.extend({

            template: _.template(HeaderTemplate),

            name: "header",

            render: function () {
                this.$el.html(this.template());

                this.$instructions = this.$(".header-instructions");

                return this.$el;
            },

            toggleInstructions: function (show) {
                this.$instructions.toggleClass("nintja", !show);
            }
        });
});