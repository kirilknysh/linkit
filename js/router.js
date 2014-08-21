define(["lodash", "backbone", "jquery", "js/views/welcome", "js/views/level"],
    function (_, Backbone, $, WelcomeView, LevelView) {
        var router = Backbone.Router.extend({

            currentView: null,
            $container: null,

            routes: {
                "": "setDefault",
                "welcome": "welcome",
                "level/:number": "level"
            },

            initialize: function (options) {
                this.$container = $("#content");
            },

            setDefault: function () {
                //by default let's got to the welcome view
                this.navigate("welcome", { trigger: true });
            },

            welcome: function () {
                this.showView(WelcomeView, this.hideCurrentView());
            },

            level: function (number) {
                this.showView(LevelView, this.hideCurrentView());
            },

            hideCurrentView: function () {
                var waitFor;

                if (this.currentView) {
                    waitFor = $.when(this.currentView.hide()).then(_.bind(this.currentView.remove, this.currentView));
                }
                
                return $.when(waitFor);
            },

            showView: function (viewClass, waitFor) {
                this.currentView = new viewClass();

                this.$container.append(this.currentView.render());

                setTimeout(_.bind(function () {
                    this.currentView.show(waitFor);                    
                }, this), 100);
            }

        });

        return router;
});