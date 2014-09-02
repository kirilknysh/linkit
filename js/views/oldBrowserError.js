define(["lodash", "backbone", "js/views/base", "text!html/oldBrowserError.html"],
    function (_, Backbone, BaseView, OldBrowserErrorTemplate) {
        return BaseView.extend({

            template: _.template(OldBrowserErrorTemplate),

            name: "old-browser-error",

            events: {
                "click .browser-thumb": "goToBrowser"
            },

            goToBrowser: function (e) {
                var target = e.target;

                if (target && target.dataset && target.dataset.destination) {
                    window.location.href = target.dataset.destination;
                }
            }

        });
});