define(["lodash","backbone","jquery","text!html/postRender.html"],function(e,t,n,i){return t.View.extend({getPostRenderIndicator:e.template(i),initialize:function(){this.$el.addClass(e.compact(this.getCssClasses()).join(" "))},prepareData:function(){return!0},render:function(){return e.isFunction(this.template)&&this.$el.html(this.template(this.getTemplateData())),this.$el.append(this.getPostRenderIndicator()),this.$el},getTemplateData:function(){return this.model&&e.isFunction(this.model.toJSON)?this.model.toJSON():{}},show:function(){var e=new n.Deferred;return this.$el.one("animationend webkitAnimationEnd",e.resolve).addClass("show"),e},hide:function(){var e=new n.Deferred;return this.$el.one("animationend webkitAnimationEnd",e.resolve).addClass("hide"),e},getCssClasses:function(){return["view",this.name]}})});