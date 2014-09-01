define(["lodash", "backbone", "jquery", "text!html/postRender.html"],
    function (_, Backbone, $, PostRender) {
        return Backbone.View.extend({

            getPostRenderIndicator: _.template(PostRender),

            initialize: function () {
                this.$el.addClass(_.compact(this.getCssClasses()).join(" "));
            },

            prepareData: function () {
                return true;
            },

            render: function () {
                if (_.isFunction(this.template)) {
                    this.$el.html(this.template(this.getTemplateData()));
                }

                this.$el.append(this.getPostRenderIndicator());

                return this.$el;
            },

            getTemplateData: function () {
                return {};
            },

            show: function () {
                var dfd = new $.Deferred();

                this.$el.one("animationend webkitAnimationEnd", dfd.resolve)
                    .addClass("show");

                return dfd;
            },

            hide: function () {
                var dfd = new $.Deferred();

                this.$el.one("animationend webkitAnimationEnd", dfd.resolve)
                    .addClass("hide");

                return dfd;
            },

            getCssClasses: function () {
                return ["view", this.name];
            }

        });
});