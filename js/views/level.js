define(["lodash", "backbone", "js/views/base", "game", "js/views/message", "text!html/level.html", "text!html/target.html", "text!html/base.html"],
    function (_, Backbone, BaseView, Game, MessageView, LevelTemplate, TargetTemplate, BaseTemplate) {
        var LevelView;

        LevelView = BaseView.extend({

            template: _.template(LevelTemplate),
            targetTemplate: _.template(TargetTemplate),
            basisTemplate: _.template(BaseTemplate),

            tagName: "div",

            name: "level",

            events: {
                "click .check-solution": "onCheckSolutionClick",
                "click .level-num.button": "onLevelNumClick",
                "click .reset.button": "onResetClick"
            },

            initialize: function (index) {
                BaseView.prototype.initialize.apply(this, arguments);

                this.levelIndex = _.isNumber(index) ? index : parseInt(index);
            },

            prepareData: function () {
                var view = this;

                return Game.db.getLevel(this.levelIndex).then(function (level) {
                    view.model = level;
                });
            },

            getTemplateData: function () {
                var td = BaseView.prototype.getTemplateData.apply(this, arguments);

                _.assign(td, {
                    renderTargetItem: this.targetTemplate,
                    renderBasisItem: this.basisTemplate
                });

                return td;
            },

            show: function () {
                $.when(BaseView.prototype.show.apply(this, arguments))
                    .then(_.bind(this.initDragAreas, this))
                    .then(_.bind(this.initDropAreas, this));
            },

            reset: function () {
                this.$el.find(".base .occupied").removeClass("occupied").attr("data-linked-target-id", "")
                    .find(".target").appendTo(this.$el.find(".targets").get(0));
            },

            onCheckSolutionClick: function (e) {
                var dfds = [];

                if (this.validatelevel(this.getLevelSolution())) {
                    dfds.push(Game.updateActiveLevel(this.levelIndex));
                    dfds.push(this.showWinMessage());

                    $.when.apply($, dfds).then(function (nextLevelIndex) {
                        return Game.navigateToLevel(nextLevelIndex);
                    });
                } else {
                    this.showFailMessage();
                }
            },

            showWinMessage: function () {
                var dfd = new $.Deferred();

                (new MessageView()).show({
                    "templateData": {
                        "header": "Co-o-o-ol!",
                        "body": "Good job! Let's go futher! But be ready - it'll be not so easy!",
                        "buttons": [{
                            "text": "Next level"
                        }]
                    },
                    "postRender": function (message) {
                        message.$el.find(".button").click(function() {
                            message.hide();
                            dfd.resolve();
                        });
                    }
                });

                return dfd;
            },

            showFailMessage: function () {
                (new MessageView()).show({
                    "templateData": {
                        "header": "O-o-o-p-psss!",
                        "body": "Something is wrong. Try again, try to think deeper...",
                        "buttons": [{
                            "text": "Try again"
                        }]
                    },
                    "postRender": function (message) {
                        message.$el.find(".button").click(_.bind(message.hide, message));
                    }
                });
            },

            onLevelNumClick: function (e) {
                Game.router.navigate("levels", { trigger: true });
            },

            onResetClick: function (e) {
                this.reset();
            },

            initDropAreas: function () {
                this.$el.find(".drop-area")
                    .on("dragenter", onDragEnter)
                    .on("dragover", onDragOver)
                    .on("dragleave", onDragLeave)
                    .on("drop", onDrop);
            },

            initDragAreas: function () {
                this.$el.find(".drag-area")
                    .on("dragstart", onDragStart);
            },

            getLevelSolution: function () {
                var solution = {};

                this.$el.find(".base").each(function (index, base) {
                    var dropArea = base.getElementsByClassName("drop-area")[0];
                    if (dropArea) {
                        solution[base.id] = dropArea.dataset.linkedTargetId || "";
                    }
                });
                
                return solution;
            },

            validatelevel: function (solution) {
                return this.model.checkSolution(solution);
            }

        });

        //===================================
        //==========  Drag'n'Drop  ==========
        //===================================

        function onDragStart (e) {
            e.originalEvent.dataTransfer.setData("text/html", e.currentTarget.id);
        }

        function onDragEnter (e) {
            e.preventDefault();
            e.currentTarget.classList.add('drag-over');
        }

        function onDragOver (e) {
            e.preventDefault();
        }

        function onDragLeave (e) {
            e.preventDefault();
            e.currentTarget.classList.remove('drag-over');
        }

        function onDrop (e) {
            var targetId = e.originalEvent.dataTransfer.getData("text/html"),
                target = document.getElementById(targetId),
                pastBase;

            e.preventDefault();
            
            e.currentTarget.classList.remove('drag-over');

            // if drop to base
            if (_.has(e.currentTarget.dataset, "dropAreaBase")) {
                if (e.currentTarget.dataset.linkedTargetId) {
                    //base already has target inside
                    return;
                }

                e.currentTarget.dataset.linkedTargetId = targetId;
                e.currentTarget.classList.add("occupied");
            }
            
            // if drop back from base
            pastBase = $(target).closest("[data-drop-area-base]")[0];
            if (pastBase) {
                pastBase.dataset.linkedTargetId = "";
                pastBase.classList.remove("occupied");
            }
            
            e.currentTarget.appendChild(target);
        }

        return LevelView;
});