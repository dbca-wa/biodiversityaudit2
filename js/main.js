require.config({
	// Define some shortcut aliases
	paths: {
		jquery: "lib/jquery.min",
		jqueryui: "lib/jquery-ui.min",
		jqueryScrollTo: "lib/jquery.scrollTo.min",
		// underscore: "lib/lodash.min",
		underscore: "lib/underscore-min",
		backbone: "lib/backbone-min",
		leaflet: "lib/leaflet",
		leaflet_ajax: "lib/leaflet.ajax",
		datatables: "lib/jquery.dataTables",
		datatablesBootstrap: "lib/dataTables.bootstrap5",
		recline: "lib/recline.dataset",
		CSVBackend: "lib/csv",
		CKANBackend: "lib/ckan",
		bootstrap: "../css/bootstrap/js/bootstrap.bundle.min",
		templates: "../templates",
		config: "config",
		dataSources: "models/dataSources",
	},

	shim: {
		underscore: {
			exports: "_",
		},
		jqueryui: {
			deps: ["jquery"],
		},
		jqueryScrollTo: {
			deps: ["jquery"],
		},
		bootstrap: {
			deps: ["jquery"],
		},
		backbone: {
			deps: ["underscore", "jquery"],
			exports: "Backbone",
			init: function (_, $) {
				// Add Lodash 4 compatibility for Backbone
				if (typeof _ !== "undefined" && !_.any) {
					_.mixin({
						any: _.some,
						all: _.every,
						contains: _.includes,
						invoke: _.invokeMap,
						object: _.zipObject,
						findWhere: function (collection, properties) {
							return _.find(collection, properties);
						},
						where: function (collection, properties) {
							return _.filter(collection, properties);
						},
					});
				}
				return this.Backbone;
			},
		},
		CSVBackend: {
			deps: ["jquery", "underscore"],
			exports: "CSVBackend",
		},
		CKANBackend: {
			deps: ["jquery", "underscore"],
			exports: "CKAN",
		},
		recline: {
			deps: [
				"jquery",
				"underscore",
				"backbone",
				"CSVBackend",
				"CKANBackend",
			],
			exports: "recline",
			init: function ($, _, Backbone, CSVBackend, CKAN) {
				// Make sure global references are available
				window._ = _;
				window.jQuery = window.$ = $;
				window.Backbone = Backbone;
				return this.recline;
			},
		},
		leaflet_ajax: {
			deps: ["leaflet"],
		},
		datatablesBootstrap: {
			deps: ["datatables", "bootstrap"],
		},
	},
});

require(["router", "dataSources"], function (Router, dataSources) {
	Router.initialize();

	// start the data fetching
	dataSources.fetchAll();

	// @todo: remove when prod
	window.sources = dataSources;
});
