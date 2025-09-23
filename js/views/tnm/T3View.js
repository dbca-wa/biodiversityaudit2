define([
	"jquery",
	"jqueryScrollTo",
	"underscore",
	"backbone",
	"app/tableFacade",
	"app/filters",
	"dataSources",
	"models/tnm/T3Model",
	"views/tnm/regionInputView",
	"views/tnm/T1View",
	"text!templates/tnm/T3Template.html",
	"text!templates/tnm/T3SummaryTemplate.html",
	"text!templates/tnm/T3DetailsTemplate.html",
], function (
	$,
	scrollTo,
	_,
	Backbone,
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
		id: "T3",
		el: "#content_panel_T3",
		title: "Past pressures and future threats by biodiversity asset.",
		description:
			"This question addresses the landscape level pressures which currently affect threatened species and ecological communities and the addition of future threats provides direction on planning needs (numbers in blue are the count). In most cases, the list of past pressures and future threats is quite similar, with the important exception of development projects which are planned/possible but have not occurred yet.",

		columns: [
			{
				data: "trend",
				render: function (data) {
					return data.rendered || data;
				},
			},
			{
				data: "flora.past",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "flora.future",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "fauna.past",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "fauna.future",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "communities.past",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "communities.future",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
		],

		getModelForRegion: function (regionCode) {
			return new Model(regionCode);
		},

		/*
         Reformat data from model to accommodate the table rows definition
         */
		buildSummaryRows: function (records) {
			// Fixed version - split the chaining for data
			var data = [];
			data = _.union(data, _.keys(records.fauna["past"]));
			data = _.union(data, _.keys(records.fauna["future"]));
			data = _.union(data, _.keys(records.flora["past"]));
			data = _.union(data, _.keys(records.flora["future"]));
			data = _.union(data, _.keys(records.communities["past"]));
			data = _.union(data, _.keys(records.communities["future"]));

			var setCellData = _.bind(this.setCellData, this);

			// Fixed version - split the map chaining
			return _.map(data, function (trend) {
				var row = {
					flora: {
						past: { count: "" },
						future: { count: "" },
					},
					fauna: {
						past: { count: "" },
						future: { count: "" },
					},
					communities: {
						past: { count: "" },
						future: { count: "" },
					},
				};
				var flora = records.flora,
					fauna = records.fauna,
					communities = records.communities;
				row.trend = trend;
				row.trend.rendered = trend;
				if (trend in flora.past) {
					setCellData(row, "flora", "past", trend, flora);
				}
				if (trend in flora.future) {
					setCellData(row, "flora", "future", trend, flora);
				}
				if (trend in fauna.past) {
					setCellData(row, "fauna", "past", trend, fauna);
				}
				if (trend in fauna.future) {
					setCellData(row, "fauna", "future", trend, fauna);
				}
				if (trend in communities.past) {
					setCellData(row, "communities", "past", trend, communities);
				}
				if (trend in communities.future) {
					setCellData(
						row,
						"communities",
						"future",
						trend,
						communities
					);
				}
				return row;
			});
		},
	});
});
