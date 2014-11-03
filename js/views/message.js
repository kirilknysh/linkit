define(["lodash", "backbone", "jquery", "text!html/message.html"],
    function (_, Backbone, $, MessageTemplate) {
        var MessageView;

        MessageView = Backbone.View.extend({

            template: _.template(MessageTemplate),

            tagName: "div",

            name: "message",

            show: function (options) {
                var templateData = options.templateData,
                    html;

                _.defaults(templateData, this.getDefaultTemplateData());

                html = this.template(templateData);

                this.$el.addClass("message");
                this.$el.html(html);

                $("#messages").append(this.$el);

                if (_.isFunction(options.postRender)) {
                    options.postRender(this);
                }

                _.defer(_.bind(this.$el.addClass, this.$el, "show"));
            },

            hide: function () {
                var message = this;

                this.$el.one("transitionend webkitTransitionEnd", function () {
                    message.remove();
                });
                this.$el.addClass("hide");
            },

            getDefaultTemplateData: function () {
                return {
                    header: "",
                    body: "",
                    buttons: []
                };
            }

        });

        return MessageView;
});