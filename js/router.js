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
                this.hideCurrentView();
                this.showView(WelcomeView);
            },

            level: function (number) {
                this.hideCurrentView();
                this.showView(LevelView);
            },

            hideCurrentView: function () {
                var view = this.currentView;

                if (view) {
                    return $.when(view.hide()).always(function () {
                        view.remove();
                    });
                } else {
                    return (new $.Deferred()).resolve();
                }
            },

            showView: function (viewClass) {
                var dfd = new $.Deferred(),
                    viewRootEl, postRenderEl;

                this.currentView = new viewClass();
                viewRootEl = this.currentView.render();

                function showCurrentView() {
                    $.when(this.currentView.show()).always(function () {
                        dfd.resolve();
                    });
                }

                if (viewRootEl) {
                    postRenderEl = viewRootEl.find(".postRender");

                    if (postRenderEl.length) {
                        postRenderEl.one("webkitAnimationEnd animationend", _.bind(showCurrentView, this));
                    } else {
                        showCurrentView();
                    }
                    
                    this.$container.append(viewRootEl);
                } else {
                    dfd.resolve();
                }

                return dfd;
            }

        });

        return router;
});