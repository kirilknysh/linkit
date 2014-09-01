define(["lodash", "backbone", "jquery"],
    function (_, Backbone, $) {

        return Backbone.Model.extend({

            defaults: {
                index: 0,
                basis: null,
                targets: null
            },

            init: function() {},

            checkSolution: function () {}

        });
});