define([
	"jquery",
	"jqueryScrollTo",
	"underscore",
	"backbone",
	"text!templates/regions.html",
	"app/map",
	"models/regionModel",
	"views/region/regionView",
], function ($, ScrollTo, _, Backbone, template, map, RegionModel, RegionView) {
	// Sanitize untrusted input to prevent DOM-based XSS
	function escapeHtml(str) {
		if (typeof str !== "string") return str;
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#x27;");
	}

	function handleRegionClick(properties, type) {
		var model = new RegionModel(properties);
		var view = new RegionView({ model: model });
		view.$el = $("#region_content");
		view.render(type);
		$.scrollTo(view.$el, 200);
	}

	return Backbone.View.extend({
		el: "#content",

		render: function (type, id) {
			var regionProperties;
			// FIXED: Changed _.template(template, {}) to _.template(template)({})
			this.$el.html(_.template(template)({}));
			map.init_map("map", handleRegionClick);
			// show region?
			if (id) {
				// warning! if region data is shown before the ibra json data are loaded, we won't have access to it's
				// name or the url for the profile
				regionProperties = map.getRegionsProperties()[id] || {
					REG_NAME: escapeHtml(id),
					SUB_CODE: escapeHtml(id),
				};
				handleRegionClick(regionProperties, type);
			}
		},
	});
});
