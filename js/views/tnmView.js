define([
	"jquery",
	"underscore",
	"backbone",
	"bootstrap",
	"text!templates/tnm.html",
	"app/tableFacade",
	"views/tnm/T1View",
	"views/tnm/T3View",
	"views/tnm/T4View",
	"views/tnm/T5View",
], function (
	$,
	_,
	Backbone,
	bootstrap,
	template,
	tables,
	T1View,
	T3View,
	T4View,
	T5View
) {
	return Backbone.View.extend({
		el: "#content",

		render: function () {
			var parentId = "accordion";
			var t1View, t2View, t3View, t4View, t5View;
			// FIXED: Changed _.template(template, {}) to _.template(template)({})
			this.$el.html(_.template(template)({}));

			t1View = new T1View();
			t1View.render(parentId);

			t3View = new T3View();
			t3View.render(parentId);

			t4View = new T4View();
			t4View.render(parentId);

			t5View = new T5View();
			t5View.render(parentId);
		},
	});
});
