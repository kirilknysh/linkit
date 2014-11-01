define(["lodash", "backbone", "jquery", "js/models/LevelsPool", "js/enum"],
    function (_, Backbone, $, LevelsPool, Enum) { 

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
                db: null
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
                        if (levelsCount < 1) {
                            model.fetchLevels().always(dfd.resolve);
                        } else {
                            dfd.resolve();
                        }
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
                        store;

                    model.set("db", db);

                    model.clearDB([model.get("DB_LEVELS_STORAGE")]);
                    store = db.createObjectStore(model.get("DB_LEVELS_STORAGE"), { keyPath: 'id', autoIncrement: true });

                    store.createIndex("by_index", "index", { unique: true });

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
                            levelsCount = data.levels.length,
                            levelIdx = 0;

                        function addItem() {
                            if (levelIdx < levelsCount) {
                                $.when(model.loadImages(data.levels[levelIdx])).always(function (level) {
                                    var store = db.transaction(model.get("DB_LEVELS_STORAGE"), "readwrite")
                                        .objectStore(model.get("DB_LEVELS_STORAGE"));

                                    store.transaction.oncomplete = addItem;
                                    store.transaction.onerror = dfd.reject;

                                    store.add(level);
                                    levelIdx++;
                                });
                            } else {
                                model.set("levelsCount", levelsCount);
                                dfd.resolve();
                            }
                        }

                        addItem();
                    }, function (e) {
                        dfd.reject();
                    });

                return dfd;
            },

            loadImages: function (level) {
                var model = this,
                    dfd = new $.Deferred(),
                    imgRequests = [];

                _.forEach(level.basis, function (base) {
                    if (base.dataType === Enum.ItemDataType.IMAGE) {
                        imgRequests.push(model.loadImage(base));
                    }
                });
                _.forEach(level.targets, function (target) {
                    if (target.dataType === Enum.ItemDataType.IMAGE) {
                        imgRequests.push(model.loadImage(target));
                    }
                });

                $.when.apply($, imgRequests).always(_.bind(dfd.resolve, dfd, level));

                return dfd;
            },

            loadImage: function (item) {
                var dfd = new $.Deferred(),
                    xhr = new XMLHttpRequest();
                 
                xhr.open("GET", item.data, true);
                xhr.responseType = "blob";
                 
                xhr.addEventListener("load", function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            item.data = xhr.response;
                        }
                        dfd.resolve();
                    }
                }, false);
                xhr.send();

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

            clearDB: function (stores) {
                var db = this.get("db");

                if (!db) {
                    return;
                }

                _.forEach(stores || db.objectStoreNames, function (storeName) {
                    if (_.contains(db.objectStoreNames, storeName)) {
                        db.deleteObjectStore(storeName);
                    }
                });
            },

            deleteDB: function () {
                var dfd = new $.Deferred(),
                    db = this.get("db"),
                    request;

                if (db) {
                    db.close();
                }
                
                request = window.indexedDB.deleteDatabase(this.get("DB_NAME"));

                request.onsuccess = dfd.resolve;
                request.onerror = dfd.reject;

                return dfd;
            }

        });
});