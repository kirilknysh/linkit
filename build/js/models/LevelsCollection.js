define(["lodash","backbone","js/utils","js/enum","js/models/LevelModel","js/models/LevelsPool"],function(e,o,n,t,s,l){return o.Collection.extend({model:s,addLevels:function(o){var n=this;e.forEach(o,function(e){n.add(e)})},getJSONLevels:function(){var e=[];return this.forEach(function(o){e.push(o.toJSON())}),e},unload:function(){for(;l.put(this.pop()););}})});