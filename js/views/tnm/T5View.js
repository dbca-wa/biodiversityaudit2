define([
	"jquery",
	"jqueryScrollTo",
	"underscore",
	"backbone",
	"bootstrap",
	"app/tableFacade",
	"app/filters",
	"dataSources",
	"models/tnm/T5Model",
	"views/tnm/regionInputView",
	"views/tnm/T1View",
	"text!templates/tnm/T5Template.html",
	"text!templates/tnm/T5SummaryTemplate.html",
	"text!templates/tnm/T5DetailsTemplate.html",
], function (
	$,
	scrollTo,
	_,
	Backbone,
	bootstrap,
	tables,
	filters,
	dataSources,
	Model,
	RegionInputView,
	T1View,
	mainTemplate,
	summaryTemplate,
	detailsTemplate
) {
	return T1View.extend({
		id: "T5",
		el: "#content_panel_T5",
		title: "Evaluation, direct management and indirect management.",
		description: "",

		columns: [
			{
				data: "trend",
				render: function (data) {
					return data.rendered || data;
				},
			},
			{
				data: "flora.management",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "fauna.management",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "communities.management",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "wetlands.management",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
		],

		getModelForRegion: function (regionCode) {
			return new Model(regionCode);
		},

		getMainTemplate: function () {
			return mainTemplate;
		},

		getSummaryTemplate: function () {
			return summaryTemplate;
		},

		getDetailsTemplate: function () {
			return detailsTemplate;
		},

		/*
         Reformat data from model to accommodate the table rows definition
         */
		buildSummaryRows: function (records) {
			// Fixed version - split the chaining for data
			var data = [];
			data = _.union(data, _.keys(records.fauna["management"]));
			data = _.union(data, _.keys(records.flora["management"]));
			data = _.union(data, _.keys(records.communities["management"]));
			data = _.union(data, _.keys(records.wetlands["management"]));

			var setCellData = _.bind(this.setCellData, this);

			// Fixed version - split the map chaining
			return _.map(data, function (value) {
				var row = {
					flora: {
						management: { count: "" },
					},
					fauna: {
						management: { count: "" },
					},
					communities: {
						management: { count: "" },
					},
					wetlands: {
						management: { count: "" },
					},
				};
				var flora = records.flora,
					fauna = records.fauna,
					communities = records.communities,
					wetlands = records.wetlands;
				row.trend = value;
				row.trend.rendered = value;
				if (value in flora.management) {
					setCellData(row, "flora", "management", value, flora);
				}
				if (value in fauna.management) {
					setCellData(row, "fauna", "management", value, fauna);
				}
				if (value in communities.management) {
					setCellData(
						row,
						"communities",
						"management",
						value,
						communities
					);
				}
				// ALSO FIXED: was using 'communities' instead of 'wetlands'
				if (value in wetlands.management) {
					setCellData(row, "wetlands", "management", value, wetlands);
				}
				return row;
			});
		},
	});
});
