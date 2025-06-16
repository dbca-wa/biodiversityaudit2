define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/home.html",
], function ($, _, Backbone, template) {
	return Backbone.View.extend({
		el: "#content",

		render: function () {
			// FIXED: Changed _.template(template, {}) to _.template(template)({})
			this.$el.html(_.template(template)({}));
		},
	});
});
