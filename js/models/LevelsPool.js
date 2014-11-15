define(["lodash", "backbone", "jquery", "js/models/LevelModel"],
    function (_, Backbone, $, LevelModel) {

        var LevelsPool = {};

        function createLevel() {
            return new LevelModel();
        }

        function clearLevel(level) {
            level.unload();
        }

        _.assign(LevelsPool, {
            pool: [],
            poolVolume: 0,

            get: function () {
                if (this.poolVolume > 0) {
                    --this.poolVolume;
                    return this.pool.pop();
                } else {
                    return createLevel();
                }
            },

            put: function (level) {
                if (level instanceof LevelModel) {
                    clearLevel(level);
                    ++this.poolVolume;
                    this.pool.push(level);
                    return true;
                }

                return false;
            }
        });

        return LevelsPool;
});