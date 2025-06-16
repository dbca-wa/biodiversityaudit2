define([
	"underscore",
	"backbone",
	"config",
	"text!templates/about.html",
], function (_, Backbone, config, template) {
	return Backbone.View.extend({
		el: "#content",

		render: function () {
			var data = {
				methodology_pdf: config.urls.methodology_pdf,
			};
			// FIXED: This one was already correct - _.template(template)(data)
			this.$el.html(_.template(template)(data));
		},
	});
});
