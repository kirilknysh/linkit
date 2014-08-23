define(["lodash", "backbone", "jquery", "text!html/postRender.html"],
    function (_, Backbone, $, PostRender) {
        return Backbone.View.extend({

            getPostRenderIndicator: _.template(PostRender),

            initialize: function () {
                this.$el.addClass(_.compact(this.getCssClasses()).join(" "));
            },

            render: function () {
                if (_.isFunction(this.template)) {
                    this.$el.html(this.template());
                }

                this.$el.append(this.getPostRenderIndicator());

                return this.$el;
            },

            show: function () {
                var dfd = new $.Deferred();

                this.$el.one("webkitAnimationEnd animationend", dfd.resolve)
                    .addClass("show");

                return dfd;
            },

            hide: function () {
                var dfd = new $.Deferred();

                this.$el.one("webkitAnimationEnd animationend", dfd.resolve)
                    .addClass("hide");

                return dfd;
            },

            getCssClasses: function () {
                return ["view", this.name];
            }

        });
});