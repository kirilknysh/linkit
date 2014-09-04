define(["lodash", "backbone", "jquery", "js/utils", "cryptojs-aes"],
    function (_, Backbone, $, Utils, CryptoJS) {

        var LEVELS_KEY_PHRASE = "encode Level$ secr3t";

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

                return this;
            },

            checkSolution: function (solution) {
                var solutionStr = Utils.levels.stringifySolution(solution);

                return this.get("solution") === solutionStr;
            }

        });
});