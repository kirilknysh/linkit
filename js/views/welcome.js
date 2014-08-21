define(["lodash", "backbone", "js/views/base", "text!html/welcome.html"],
    function (_, Backbone, BaseView, WelcomeTemplate) {
        return BaseView.extend({

            template: _.template(WelcomeTemplate),
            tagName: "div",

            name: "welcome",

            events: {

            },

            render: function () {
                this.$el.html(this.template());

                return this.$el;
            },

            getCssClasses: function () {
                var classes = BaseView.prototype.getCssClasses.apply(this, arguments);

                classes.push("text-view");

                return classes;
            }

        });
});