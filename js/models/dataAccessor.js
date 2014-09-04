define(["lodash", "backbone", "jquery", "js/models/LevelsPool"],
    function (_, Backbone, $, LevelsPool) { 

        /*
         * General rules:
         * 1. methods started with fetch* are used to fetch data and, probably, save it to inetrnals
         */

        return Backbone.Model.extend({

            defaults: {
                DB_NAME: "LinkItDB",
                DB_VERSION: 1,
                DB_LEVELS_STORAGE: "levels",
                url: "./js/levels.json",
                levelsCount: null,
                db: null,
                encrypter: null
            },

            initDB: function () {
                var dfd = new $.Deferred(),
                    request = window.indexedDB.open(this.get("DB_NAME"), this.get("DB_VERSION")),
                    model = this;

                function safeFallback(db) {
                    db.onversionchange = function (e) {
                        db.close();
                    };
                }

                request.onsuccess = function () {
                    //DB exists and was opened successfully
                    model.set("db", this.result);
                    safeFallback(this.result);

                    model.fetchLevelsCount().then(function (levelsCount) {
                        dfd.resolve();
                    }, function () {
                        //fail to get levels amount
                        dfd.reject();
                    });
                };

                request.onerror = function () {
                    //error durin DB opening/creation
                    dfd.reject();
                };

                request.onupgradeneeded = function (e) {
                    var db = this.result,
                        store = db.createObjectStore(model.get("DB_LEVELS_STORAGE"), { keyPath: 'id', autoIncrement: true });

                    model.set("db", this.result);
                    safeFallback(this.result);

                    store.createIndex("by_index", "index", { unique: true });

                    store.transaction.oncomplete = function (e) {
                        //the DB has been just created; levels amount will always be 0
                        model.set("levelsCount", 0);
                        dfd.resolve();
                    };

                    store.transaction.onerror = function (e) {
                        dfd.reject();
                    };
                };

                return dfd;
            },

            getLevel: function (index) {
                var dfd = new $.Deferred(),
                    db = this.get("db"),
                    objectStore, storeIndex;


                if (!_.isNumber(index)) {
                    return dfd.reject();
                }

                objectStore = db.transaction(this.get("DB_LEVELS_STORAGE"), "readonly")
                        .objectStore(this.get("DB_LEVELS_STORAGE"));
                storeIndex = objectStore.index("by_index").get(index);
                
                storeIndex.onsuccess = function () {
                    dfd.resolve(LevelsPool.get().init(this.result));
                };
                storeIndex.onerror = function () {
                    dfd.reject();
                };

                return dfd;
            },

            fetchLevels: function () {
                var dfd = new $.Deferred(),
                    model = this;

                $.getJSON(this.get("url"))
                    .then(function (data) {
                        if (!data || !_.isArray(data.levels)) {
                            return dfd.reject();
                        }

                        var db = model.get("db"),
                            store = db.transaction(model.get("DB_LEVELS_STORAGE"), "readwrite")
                                .objectStore(model.get("DB_LEVELS_STORAGE"));

                        _.forEach(data.levels, function (level) {
                            //TODO: encrypt solution
                            store.add(level);
                        });
                        model.set("levelsCount", data.levels.length);

                        dfd.resolve();
                    }, function (e) {
                        dfd.reject();
                    });

                return dfd;
            },

            getLevelsCount: function () {
                return this.get("levelsCount") || 0;
            },

            fetchLevelsCount: function () {
                var dfd = new $.Deferred(),
                    db = this.get("db"),
                    store = db.transaction(this.get("DB_LEVELS_STORAGE"), "readonly")
                        .objectStore(this.get("DB_LEVELS_STORAGE")),
                    count = store.count(),
                    model = this;

                count.onsuccess = function (e) {
                    model.set("levelsCount", this.result || 0);
                    dfd.resolve(this.result);
                };

                count.onerror = function (e) {
                    model.set("levelsCount", null);
                    dfd.reject(null);
                };

                return dfd;
            },

            deleteDB: function () {
                var dfd = new $.Deferred(),
                    request = window.indexedDB.deleteDatabase(this.get("DB_NAME"));

                request.onsuccess = function (e) { dfd.resolve(); };
                request.onerror = function (e) { dfd.reject(); };

                return dfd;
            }

        });
});