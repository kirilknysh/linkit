define(["lodash", "backbone", "js/views/base", "text!html/oldBrowserError.html"],
    function (_, Backbone, BaseView, OldBrowserErrorTemplate) {
        return BaseView.extend({

            template: _.template(OldBrowserErrorTemplate),

            name: "old-browser-error"

        });
});