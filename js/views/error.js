define(["lodash", "backbone", "js/enum", "js/views/base", "text!html/error-404.html", "text!html/error-user.html", ""],
    function (_, Backbone, Enum, BaseView, Error404Template, ErrorUserTemplate, ErrorGenericTemplate) {
        return BaseView.extend({

            tagName: "div",

            name: "error",

            initialize: function (errorCode) {
                BaseView.prototype.initialize.apply(this, arguments);

                this.errorCode = errorCode;
            },

            prepareData: function () {
                var template;

                switch(this.errorCode) {
                    case Enum.GameErrorTypes.PAGE_NOT_FOUND:
                    case Enum.GameErrorTypes.NO_LEVELS_LOADED:
                        template = Error404Template;
                        break;
                    case Enum.GameErrorTypes.USER_ERROR:
                        template = ErrorUserTemplate;
                        break;
                    default:
                    case Enum.GameErrorTypes.GENERIC:
                        template = ErrorGenericTemplate;
                        break;
                }

                this.template = _.template(template);
            }

        });
});