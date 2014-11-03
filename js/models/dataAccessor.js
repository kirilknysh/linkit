define(["lodash", "backbone", "jquery", "js/models/LevelsPool", "js/enum", "js/models/UserModel"],
    function (_, Backbone, $, LevelsPool, Enum, UserModel) { 

        /*
         * General rules:
         * 1. methods started with fetch* are used to fetch data and, probably, save it to inetrnals
         */

        return Backbone.Model.extend({

            defaults: {
                DB_NAME: "LinkItDB",
                DB_VERSION: 8,
                DB_LEVELS_STORAGE: "levels",
                DB_USERS_STORAGE: "users",
                DB_USER_ID_KEY: "userId",
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
                        store, userStore;

                    model.set("db", db);

                    model.clearDB([model.get("DB_LEVELS_STORAGE")]);
                    store = db.createObjectStore(model.get("DB_LEVELS_STORAGE"), { keyPath: 'id', autoIncrement: true });

                    if (!_.contains(db.objectStoreNames, model.get("DB_USERS_STORAGE"))) {
                        userStore = db.createObjectStore(model.get("DB_USERS_STORAGE"), { keyPath: 'name', autoIncrement: true });
                    }

                    store.createIndex("by_index", "index", { unique: true });

                    store.transaction.onerror = function (e) {
                        dfd.reject();
                    };
                };

                return dfd;
            },

            initUser: function (name) {
                var model = this,
                    dfd = new $.Deferred(),
                    db = this.get("db"),
                    userStore, request;

                userStore = db.transaction(this.get("DB_USERS_STORAGE"), "readonly")
                    .objectStore(this.get("DB_USERS_STORAGE"));

                request = userStore.get(name || "");

                request.onerror = function (e) {
                    dfd.reject();
                };

                request.onsuccess = function (e) {
                    var user = e.target.result,
                        userStore;

                    if (user) {
                        dfd.resolve(new UserModel(user));
                    } else {
                        userStore = db.transaction(model.get("DB_USERS_STORAGE"), "readwrite")
                            .objectStore(model.get("DB_USERS_STORAGE"));

                        user = model.getDefaultUser();
                        userStore.add(user);

                        userStore.transaction.oncomplete = function (e) {
                            dfd.resolve(new UserModel(user));
                        };
                        userStore.transaction.onerror = function () {
                            dfd.reject();
                        };
                    }
                };

                return dfd;
            },

            getCurrentUser: function () {
                var dfd = new $.Deferred(),
                    db = this.get("db"),
                    userRequest;

                userRequest = db.transaction(this.get("DB_USERS_STORAGE"), "readonly")
                    .objectStore(this.get("DB_USERS_STORAGE")).get(this.getCurrentUserName());

                userRequest.onerror = function (e) {
                    dfd.reject({ code: Enum.GameErrorTypes.USER_ERROR });
                };

                userRequest.onsuccess = function (e) {
                    var user = e.target.result;

                    dfd.resolve(new UserModel(user));
                };

                return dfd;
            },

            getDefaultUser: function () {
                return { name: "user" + _.random(Number.MAX_SAFE_INTEGER), activeLevel: 1 };
            },

            getCurrentUserName: function () {
                return window.localStorage.getItem(this.get("DB_USER_ID_KEY"));
            },

            saveCurrentUserName: function (userId) {
                if (userId && _.isString(userId)) {
                    window.localStorage.setItem(this.get("DB_USER_ID_KEY"), userId);
                }
            },

            getCurrentUserActiveLevel: function () {
                return this.getCurrentUser().then(function (user) {
                    return user.get("activeLevel");
                });
            },

            setCurrentUserActiveLevel: function (newIndex) {
                var dfd = new $.Deferred(),
                    db = this.get("db"),
                    index = _.isNumber(newIndex) ? newIndex : 1,
                    userStore, userRequest;

                userStore = db.transaction(this.get("DB_USERS_STORAGE"), "readwrite")
                    .objectStore(this.get("DB_USERS_STORAGE"));
                userRequest = userStore.get(this.getCurrentUserName());

                userRequest.onerror = function (e) {
                    dfd.reject({ code: Enum.GameErrorTypes.USER_ERROR });
                };

                userRequest.onsuccess = function (e) {
                    var user = e.target.result,
                        updateRequest;

                    user.activeLevel = index;

                    updateRequest = userStore.put(user);

                    updateRequest.onerror = function (e) {
                        dfd.reject({ code: Enum.GameErrorTypes.USER_ERROR });
                    };

                    updateRequest.transaction.oncomplete = function (e) {
                        dfd.resolve(index);
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
                
                storeIndex.onsuccess = function (e) {
                    var level = e.target.result;

                    if (level) {
                        dfd.resolve(LevelsPool.get().init(level));
                    } else {
                        dfd.reject({ code: Enum.GameErrorTypes.NO_LEVELS_LOADED });
                    }
                };
                storeIndex.onerror = function () {
                    dfd.reject({ code: Enum.GameErrorTypes.GENERIC });
                };

                return dfd;
            },

            fetchLevels: function () {
                var dfd = new $.Deferred(),
                    model = this;

                $.getJSON(this.get("url"))
                    .then(function (data) {
                        if (!data || !_.isArray(data.levels)) {
                            return dfd.reject({ code: Enum.GameErrorTypes.NO_LEVELS_LOADED });
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
                        dfd.reject({ code: Enum.GameErrorTypes.NO_LEVELS_LOADED });
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

            getAllLevels: function () {
                var model = this;

                return this.getCurrentUserActiveLevel().then(function (activeLevel) {
                    var dfd = new $.Deferred(),
                        db = model.get("db"),
                        levels = [],
                        objectCursor;

                    objectCursor = db.transaction(model.get("DB_LEVELS_STORAGE"), "readonly")
                        .objectStore(model.get("DB_LEVELS_STORAGE")).openCursor();

                    objectCursor.onsuccess = function (e) {
                        var cursor = e.target.result,
                            level;

                        if (cursor) {
                            level = cursor.value;
                            level.available = level.index <= activeLevel;
                            levels.push(LevelsPool.get().init(level));
                            cursor.continue();
                        } else {
                            dfd.resolve(levels);
                        }
                    };

                    objectCursor.onerror = function () {
                        dfd.reject({ code: Enum.GameErrorTypes.NO_LEVELS_LOADED });
                    };

                    return dfd;
                });
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
                    dfd.reject({ code: Enum.GameErrorTypes.NO_LEVELS_LOADED });
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