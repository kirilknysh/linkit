define(["lodash", "backbone", "jquery", "js/utils", "js/enum", "cryptojs-aes"],
    function (_, Backbone, $, Utils, Enum, CryptoJS) {

        //To encrypt solution: CryptoJS.AES.encrypt("basis.1.0-target.1.1::basis.1.1-target.1.2", LEVELS_KEY_PHRASE).toString()

        var LEVELS_KEY_PHRASE = "encode Level$ secr3t",
            DEFAULT_MARGIN_LEFT = 1, DEFAULT_MARGIN_RIGHT = 1,
            STYLE_PATTERN = "margin-left: {marginLeft}; margin-right: {marginRight}; width: {width};";

        return Backbone.Model.extend({

            defaults: {
                index: 0,
                basis: null,
                targets: null,
                solution: null,
                available: true
            },

            init: function(level) {
                var URL = window.URL || window.webkitURL,
                    solutionStr = "", solution;

                _.forEach(level.basis, function (base) {
                    if (base.dataType === Enum.ItemDataType.IMAGE) {
                        base.data = URL.createObjectURL(base.data);
                    }
                });
                _.forEach(level.targets, function (target) {
                    if (target.dataType === Enum.ItemDataType.IMAGE) {
                        target.data = URL.createObjectURL(target.data);
                    }
                });

                solutionStr = CryptoJS.AES.decrypt(level.solution, LEVELS_KEY_PHRASE).toString(CryptoJS.enc.Utf8);
                solution = Utils.levels.parseSolution(solutionStr);

                this.set("index", level.index);
                this.set("basis", _.shuffle(level.basis));
                this.set("targets", _.shuffle(level.targets));
                this.set("solution", solution);
                this.setStyles(level.basis.length, level.targets.length);

                return this;
            },

            checkSolution: function (solution) {
                var valid = true,
                    levelSolution = this.get("solution");

                _.forEach(solution, function (targetId, baseId) {
                    valid = levelSolution[baseId] === targetId;
                    return valid;
                });

                return valid;
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