define(["lodash"],
    function(_) {
        var Utils = { };

        _.assign(Utils, {
            "levels": {
                stringifySolution: function (solution) {
                    var result = [];

                    _.forEach(solution, function (value, key) {
                        result.push(key + "-" + value);
                    });

                    return result.join("::");
                },

                parseSolution: function (solution) {
                    if (!_.isString(solution)) {
                        return null;
                    }

                    var pairs = solution.split("::"),
                        result = {};

                    _.forEach(pairs, function (pair) {
                        var keyValue = pair.split("-");
                        result[keyValue[0]] = keyValue[1];
                    });

                    return result;
                }
            }
        });

        return Utils;
});