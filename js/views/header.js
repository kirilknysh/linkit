define(["lodash", "backbone", "text!html/header.html"],
    function (_, Backbone, HeaderTemplate) {
        return Backbone.View.extend({

            template: _.template(HeaderTemplate),

            name: "header",

            events: {
                "click h1": "onHeaderClick"
            },

            render: function () {
                this.$el.html(this.template());

                this.$instructions = this.$(".header-instructions");

                return this.$el;
            },

            toggleInstructions: function (show) {
                this.$instructions.toggleClass("nintja", !show);
            },

            onHeaderClick: function () {
                window.location.hash = "#welcome";
            }

        });
});