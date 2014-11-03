define(["lodash"],
    function(_) {
        var Enum = { };

        _.assign(Enum, {
            "GameErrorTypes": {
                "GENERIC": 0,
                "OLD_BROWSER": 1,
                "PAGE_NOT_FOUND": 2,
                "NO_LEVELS_LOADED": 3,
                "USER_ERROR": 4
            },

            "GameStatus": {
                "LOADING": "loading",
                "READY": "ready",
                "IN_PROGRESS": "inprogress"
            },

            "ItemDataType": {
                "TEXT": "text",
                "IMAGE": "image"
            }
        });

        return Enum;
});