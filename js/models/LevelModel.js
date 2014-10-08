define(["lodash", "backbone", "jquery", "js/utils", "cryptojs-aes"],
    function (_, Backbone, $, Utils, CryptoJS) {

        //To encrypt solution: CryptoJS.AES.encrypt("0-1::1-2::2-0", LEVELS_KEY_PHRASE).toString()

        var LEVELS_KEY_PHRASE = "encode Level$ secr3t",
            DEFAULT_MARGIN_LEFT = 1, DEFAULT_MARGIN_RIGHT = 1,
            STYLE_PATTERN = "margin-left: {marginLeft}; margin-right: {marginRight}; width: {width};";

        return Backbone.Model.extend({

            defaults: {
                index: 0,
                basis: null,
                targets: null,
                solution: null
            },

            init: function(level) {
                this.set("index", level.index);
                this.set("basis", level.basis);
                this.set("targets", level.targets);
                this.set("solution", CryptoJS.AES.decrypt(level.solution, LEVELS_KEY_PHRASE).toString(CryptoJS.enc.Utf8));
                this.setStyles(level.basis.length, level.targets.length);

                return this;
            },

            checkSolution: function (solution) {
                var solutionStr = Utils.levels.stringifySolution(solution);

                return this.get("solution") === solutionStr;
            },

            setStyles: function (basisCount, targetsCount) {
                var baseWidth = this._getWidth(basisCount, DEFAULT_MARGIN_LEFT, DEFAULT_MARGIN_RIGHT),
                    targerWidth = this._getWidth(targetsCount, DEFAULT_MARGIN_LEFT, DEFAULT_MARGIN_RIGHT),
                    marginLeft = DEFAULT_MARGIN_LEFT + "%", marginRight = DEFAULT_MARGIN_RIGHT + "%",
                    baseWidthPercent = baseWidth + "%", targetWidthPErcent = targerWidth + "%";

                _.forEach(this.get("basis"), function (base) {
                    base.style = STYLE_PATTERN.replace("{marginLeft}", marginLeft).replace("{marginRight}", marginRight)
                        .replace("{width}", baseWidthPercent);
                });
                _.forEach(this.get("targets"), function (base) {
                    base.style = STYLE_PATTERN.replace("{marginLeft}", marginLeft).replace("{marginRight}", marginRight)
                        .replace("{width}", baseWidthPercent);
                });
            },

            _getWidth: function (count, leftMargin, rightMargin) {
                return (100 - (count * (leftMargin + rightMargin))) / count;
            }

        });
});