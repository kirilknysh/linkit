define(["lodash","backbone","jquery","js/utils","js/enum","cryptojs-aes"],function(t,e,a,i,n,s){var r="encode Level$ secr3t",o=1,l=1,c="margin-left: {marginLeft}; margin-right: {marginRight}; width: {width};";return e.Model.extend({defaults:{index:0,basis:null,targets:null,solution:null,available:!0},init:function(e){var a,o=window.URL||window.webkitURL,l="";return t.forEach(e.basis,function(t){t.dataType===n.ItemDataType.IMAGE&&(t.data=o.createObjectURL(t.data))}),t.forEach(e.targets,function(t){t.dataType===n.ItemDataType.IMAGE&&(t.data=o.createObjectURL(t.data))}),l=s.AES.decrypt(e.solution,r).toString(s.enc.Utf8),a=i.levels.parseSolution(l),this.set("index",e.index),this.set("basis",t.shuffle(e.basis)),this.set("targets",t.shuffle(e.targets)),this.set("solution",a),this.set("available",e.available),this.setStyles(e.basis.length,e.targets.length),this},checkSolution:function(e){var a=!0,i=this.get("solution");return t.forEach(e,function(t,e){return a=i[e]===t}),a},setStyles:function(e,a){var i=this._getWidth(e,o,l),n=(this._getWidth(a,o,l),o+"%"),s=l+"%",r=i+"%";t.forEach(this.get("basis"),function(t){t.style=c.replace("{marginLeft}",n).replace("{marginRight}",s).replace("{width}",r)}),t.forEach(this.get("targets"),function(t){t.style=c.replace("{marginLeft}",n).replace("{marginRight}",s).replace("{width}",r)})},_getWidth:function(t,e,a){return(100-t*(e+a))/t},unload:function(){var e=window.URL||window.webkitURL;t.forEach(this.get("basis"),function(t){t.dataType===n.ItemDataType.IMAGE&&e.revokeObjectURL(t.data)}),t.forEach(this.get("targets"),function(t){t.dataType===n.ItemDataType.IMAGE&&e.revokeObjectURL(t.data)})}})});