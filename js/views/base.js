define(["backbone", "jquery"],
    function (Backbone, $) {
        return Backbone.View.extend({

            initialize: function () {
                this.$el.addClass(this.getCssClasses().join(" "));
            },

            show: function (waitFor) {
                this.$el.addClass("show");
            },

            hide: function () {
                var dfd = new $.Deferred();

                this.$el.one("webkitAnimationEnd animationend", dfd.resolve)
                    .addClass("hide").removeClass("show");

                return dfd;
            },

            getCssClasses: function () {
                return ["view"];
            }

        });
});