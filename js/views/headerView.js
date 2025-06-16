define([
	"jquery",
	"underscore",
	"backbone",
	"text!templates/header.html",
], function ($, _, Backbone, template) {
	return Backbone.View.extend({
		el: "#header",

		initialize: function () {
			this.render();
		},

		render: function () {
			// FIXED: Changed _.template(template, {}) to _.template(template)({})
			this.$el.html(_.template(template)({}));
		},
	});
});
