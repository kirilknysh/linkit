define(["lodash", "backbone", "js/views/base", "text!html/error.html"],
    function (_, Backbone, BaseView, ErrorTemplate) {
        return BaseView.extend({

            template: _.template(ErrorTemplate),
            tagName: "div",

            name: "error"

        });
});