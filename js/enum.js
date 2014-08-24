define(["lodash"],
    function(_) {
        var Enum = { };

        _.assign(Enum, {
            "GameErrorTypes": {
                "GENERIC": 0,
                "OLD_BROWSER": 1,
                "PAGE_NOT_FOUND": 2
            }
        });

        return Enum;
});