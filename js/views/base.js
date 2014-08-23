define(["lodash", "backbone", "jquery"],
    function (_, Backbone, $) {
        return Backbone.View.extend({

            initialize: function () {
                this.$el.addClass(_.compact(this.getCssClasses()).join(" "));
            },

            render: function () {
                if (_.isFunction(this.template)) {
                    this.$el.html(this.template());
                }

                return this.$el;
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
                return ["view", this.name];
            }

        });
});