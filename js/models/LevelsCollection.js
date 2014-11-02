define(["lodash", "backbone", "js/utils", "js/enum", "js/models/LevelModel"],
    function (_, Backbone, Utils, Enum, LevelModel) {

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
            }

        });
});