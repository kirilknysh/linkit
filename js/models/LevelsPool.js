define(["lodash", "backbone", "jquery", "js/models/LevelModel"],
    function (_, Backbone, $, LevelModel) {

        var LevelsPool = {};

        function createLevel() {
            return new LevelModel();
        }

        function clearLevel(level) {

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
                    clearLevel(level);
                    ++this.poolVolume;
                    this.pool.push(level);
                }
            });


        return LevelsPool;
});