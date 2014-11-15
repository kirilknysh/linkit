define(["lodash", "backbone", "jquery", "game", "js/enum", "js/views/welcome", "js/views/level", "js/views/levels", "js/views/gameOver", "js/views/error", "js/views/oldBrowserError"],
    function (_, Backbone, $, Game, Enum, WelcomeView, LevelView, LevelsView, GameOverView, ErrorView, OldBrowserErrorView) {
        var router = Backbone.Router.extend({

            currentView: null,
            $container: null,

            routes: {
                "": "setDefault",
                "welcome": "welcome",
                "error(/:errorType)": "error",
                "levels": "levels",
                "level/:number": "level",
                "gameOver": "gameOver"
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

            error: function (errorType) {
                var viewToShow,
                    errorCode = _.parseInt(errorType);

                switch(errorCode) {
                    case Enum.GameErrorTypes.OLD_BROWSER:
                        this.forceRemoveView(this.currentView);
                        return this.showView(OldBrowserErrorView);
                    default:
                        viewToShow = ErrorView;
                        break;
                }

                this.hideCurrentView();
                this.showView(viewToShow, errorCode);
            },

            level: function (number) {
                //to navigate to level a fully initialized game is required
                Game.onInitialize(_.bind(function () {
                    Game.navigateToLevel(~~number);
                }, this));
            },

            levels: function () {
                //to navigate to level a fully initialized game is required
                Game.onInitialize(_.bind(function () {
                    this.hideCurrentView();
                    this.showView(LevelsView);
                }, this));
            },

            gameOver: function () {
                this.hideCurrentView();
                this.showView(GameOverView);
            },

            hideCurrentView: function () {
                var view = this.currentView,
                    router = this;

                if (view) {
                    return $.when(view.hide()).always(function () {
                        router.forceRemoveView(view);
                    });
                } else {
                    return (new $.Deferred()).resolve();
                }
            },

            forceRemoveView: function (view) {
                if (view && _.isFunction(view.remove)) {
                    view.remove();
                }
            },

            showView: function (viewClass) {
                var dfd = new $.Deferred(),
                    router = this,
                    viewRootEl, postRenderEl;


                this.currentView = new (Function.prototype.bind.apply(viewClass, [null].concat(Array.prototype.slice.call(arguments, 1))))();
                $.when(this.currentView.prepareData()).then(function () {
                    viewRootEl = router.currentView.render();

                    function showCurrentView() {
                        $.when(router.currentView.show()).always(function () {
                            dfd.resolve();
                        });
                    }

                    if (viewRootEl) {
                        postRenderEl = viewRootEl.find(".postRender");

                        if (postRenderEl.length) {
                            postRenderEl.one("animationend webkitAnimationEnd", _.bind(showCurrentView, router));
                        } else {
                            showCurrentView();
                        }
                        
                        router.$container.append(viewRootEl);
                    } else {
                        dfd.resolve();
                    }
                }, function (e) {
                    var errorCode = e.code || Enum.GameErrorTypes.GENERIC;

                    router.navigate("error/" + errorCode, { trigger: true });
                });

                return dfd;
            },

            showLevelView: function (levelNum) {
                return this.showView(LevelView, levelNum);
            }

        });

        return router;
});