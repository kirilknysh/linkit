define(["lodash", "backbone", "js/utils", "js/enum", "js/models/LevelModel", "js/models/LevelsPool"],
    function (_, Backbone, Utils, Enum, LevelModel, LevelsPool) {

        return Backbone.Collection.extend({

            model: LevelModel,

            addLevels: function (levels) {
                var collection = this;

                _.forEach(levels, function (level) {
                    collection.add(level);
                });
            },

            getJSONLevels: function () {
                var levels = [];

                this.forEach(function (level) {
                    levels.push(level.toJSON());
                });

                return levels;
            },

            unload: function () {
                while(LevelsPool.put(this.pop())) { }
            }

        });
});