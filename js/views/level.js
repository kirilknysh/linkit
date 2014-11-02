define(["lodash", "backbone", "js/views/base", "game", "text!html/level.html", "text!html/target.html", "text!html/base.html"],
    function (_, Backbone, BaseView, Game, LevelTemplate, TargetTemplate, BaseTemplate) {
        var LevelView;

        LevelView = BaseView.extend({

            template: _.template(LevelTemplate),
            targetTemplate: _.template(TargetTemplate),
            basisTemplate: _.template(BaseTemplate),

            tagName: "div",

            name: "level",

            events: {
                "click .check-solution": "onCheckSolutionClick",
                "click .level-num.button": "onLevelNumClick"
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

            onCheckSolutionClick: function (e) {
                alert(this.validatelevel(this.getLevelSolution()));
            },

            onLevelNumClick: function (e) {
                Game.router.navigate("levels", { trigger: true });
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