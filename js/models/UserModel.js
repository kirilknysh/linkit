define(["lodash", "backbone", "jquery"],
    function (_, Backbone, $) {

        return Backbone.Model.extend({

            defaults: {
                name: "",
                activeLevel: 1
            }

        });
});