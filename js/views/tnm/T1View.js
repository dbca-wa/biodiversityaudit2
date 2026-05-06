define([
	"jquery",
	"jqueryScrollTo",
	"underscore",
	"backbone",
	"bootstrap",
	"datatablesBootstrap",
	"app/tableFacade",
	"app/filters",
	"dataSources",
	"models/tnm/T1Model",
	"views/tnm/regionInputView",
	"text!templates/tnm/T1Template.html",
	"text!templates/tnm/T1SummaryTemplate.html",
	"text!templates/tnm/T1DetailsTemplate.html",
], function (
	$,
	scrollTo,
	_,
	Backbone,
	bootstrap,
	datatablesBootstrap,
	tables,
	filters,
	dataSources,
	Model,
	RegionInputView,
	mainTemplate,
	summaryTemplate,
	detailsTemplate
) {
	return Backbone.View.extend({
		id: "T1",
		el: "#content_panel_T1",
		title: "Trend by biodiversity asset (measures of change in condition over time).",
		description:
			"This question cumulatively addresses questions regarding which biodiversity assets have increased/decreased/remained static and why and provides counts and totals (from which it is possible to then display graphically and or as proportions) for either whole of State or individual subregions.  For species, the most informative metrics are numbers of populations and mature individuals whereas for ecological communities these are number of occurrences and area of occupancy.",

		columns: [
			{
				data: "trend",
				render: function (data) {
					return data.rendered || data;
				},
			},
			{
				data: "flora.population",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "flora.mature",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "fauna.population",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "fauna.mature",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "communities.occurrence",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
			{
				data: "communities.aoo",
				render: function (data) {
					return data.rendered || data.count;
				},
			},
		],

		summaryCellTemplate: _.template(
			'<a title="click to view details." id="<%= id %>"><%= val %></a></span>'
		),

		initialize: function () {},

		updateT1Headers: function ($table) {
			console.log("updateT1Headers called");

			// Find the table element if not provided
			if (!$table || $table.length === 0) {
				$table = $("#summary_table_T1");
			}

			// Look for headers in both scroll head and main table
			var $scrollHead = $table
				.closest(".dataTables_scroll")
				.find(".dataTables_scrollHead thead");
			var $mainHead = $table.find("thead");

			var $targetHead = $scrollHead.length > 0 ? $scrollHead : $mainHead;

			if ($targetHead.length > 0) {
				var $thElements = $targetHead.find("th");
				console.log(
					"updateT1Headers - Found th elements:",
					$thElements.length
				);

				if ($thElements.length >= 7) {
					console.log("updateT1Headers - Setting headers");

					$thElements.eq(0).html("Trend");
					$thElements
						.eq(1)
						.html(
							'<div style="line-height: 1.1; font-size: 0.85em;"><div style="font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 2px; padding-bottom: 2px;">Threatened Flora</div><div>Number of populations</div></div>'
						);
					$thElements
						.eq(2)
						.html(
							'<div style="line-height: 1.1; font-size: 0.85em;"><div style="font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 2px; padding-bottom: 2px;">Threatened Flora</div><div>Number of mature individuals</div></div>'
						);
					$thElements
						.eq(3)
						.html(
							'<div style="line-height: 1.1; font-size: 0.85em;"><div style="font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 2px; padding-bottom: 2px;">Threatened Fauna</div><div>Number of populations</div></div>'
						);
					$thElements
						.eq(4)
						.html(
							'<div style="line-height: 1.1; font-size: 0.85em;"><div style="font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 2px; padding-bottom: 2px;">Threatened Fauna</div><div>Number of mature individuals</div></div>'
						);
					$thElements
						.eq(5)
						.html(
							'<div style="line-height: 1.1; font-size: 0.85em;"><div style="font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 2px; padding-bottom: 2px;">Threatened Ecological Communities</div><div>Number of occurrences</div></div>'
						);
					$thElements
						.eq(6)
						.html(
							'<div style="line-height: 1.1; font-size: 0.85em;"><div style="font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 2px; padding-bottom: 2px;">Threatened Ecological Communities</div><div>Area of occupancy</div></div>'
						);

					console.log("updateT1Headers - Headers set successfully");
					return true;
				}
			}

			console.log("updateT1Headers - Failed to set headers");
			return false;
		},

		render: function (parent) {
			var child = _.template(this.getMainTemplate())({
				parent: parent,
				id: this.id,
				title: this.title,
				description: this.description,
			});
			var inputView;
			$("#" + parent).append(child);
			inputView = new RegionInputView({ el: "#region_input_" + this.id });
			inputView.render();
			inputView.setSelectCallback(_.bind(this.renderSummary, this));
		},

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

		renderSummary: function (regionCode) {
			var template = _.template(this.getSummaryTemplate())({
				id: this.id,
			});
			this.getSummaryContentElement().html(template);
			this.clearDetails();
			var model = this.getModelForRegion(regionCode);
			var tableOptions = {
				paging: false,
				searching: false,
				destroy: true,
				scrollX: true,
				responsive: false,
				autoWidth: true,
				retrieve: true,
				ordering: false,
				initComplete: function (settings, json) {
					console.log("T1: Table initialization complete");
					// DataTables 2.x automatically handles scroll body headers for width calculation
				},
			};
			var buildRows = _.bind(this.buildSummaryRows, this);
			var renderDetails = _.bind(this.renderDetails, this);
			var table = tables.initTable(
				this.getSummaryTableElement(),
				tableOptions,
				this.columns
			);
			// bind the links to the renderDetails method
			table.on("draw.dt", function (e) {
				$(e.target)
					.find("td a")
					.on("click", function (e) {
						renderDetails(e.target.id, model);
					});
			});
			model.onReady(function (records) {
				var rows = buildRows(records);
				table.clear();
				table.populate(rows);
			});
		},

		setCellData: function (row, data, type, trend, source) {
			row[data][type] = source[type][trend];
			row[data][type].rendered = this.summaryCellTemplate({
				id: [data, type, trend].join("_"),
				val: row[data][type].count || "",
			});
		},

		/*
         Reformat data from model to accommodate the table rows definition
         */
		buildSummaryRows: function (records) {
			// Fixed version - split the chaining for trends
			var trends = [];
			trends = _.union(trends, _.keys(records.fauna["population"]));
			trends = _.union(trends, _.keys(records.fauna["mature"]));
			trends = _.union(trends, _.keys(records.flora["population"]));
			trends = _.union(trends, _.keys(records.flora["mature"]));
			trends = _.union(trends, _.keys(records.communities["occurrence"]));
			trends = _.union(trends, _.keys(records.communities["occurrence"]));

			var setCellData = _.bind(this.setCellData, this);

			// Fixed version - split the map chaining
			return _.map(trends, function (trend) {
				var row = {
					flora: {
						population: { count: "" },
						mature: { count: "" },
					},
					fauna: {
						population: { count: "" },
						mature: { count: "" },
					},
					communities: {
						occurrence: { count: "" },
						aoo: { count: "" },
					},
				};
				var flora = records.flora,
					fauna = records.fauna,
					communities = records.communities;
				row.trend = trend;
				row.trend.rendered = trend;
				if (trend in flora.population) {
					setCellData(row, "flora", "population", trend, flora);
				}
				if (trend in flora.mature) {
					setCellData(row, "flora", "mature", trend, flora);
				}
				if (trend in fauna.population) {
					setCellData(row, "fauna", "population", trend, fauna);
				}
				if (trend in fauna.mature) {
					setCellData(row, "fauna", "mature", trend, fauna);
				}
				if (trend in communities.occurrence) {
					setCellData(
						row,
						"communities",
						"occurrence",
						trend,
						communities
					);
				}
				if (trend in communities.aoo) {
					setCellData(row, "communities", "aoo", trend, communities);
				}
				return row;
			});
		},

		getSummaryContentElement: function () {
			return $("#summary_content_" + this.id);
		},

		getSummaryTableElement: function () {
			return $("#summary_table_" + this.id);
		},

		getDetailsContentElement: function () {
			return $("#details_content_" + this.id);
		},

		getDetailsTableElement: function () {
			return $("#details_table_" + this.id);
		},

		renderSpecies: function (models) {
			var columnDefs = [
					{
						title: "Taxon",
						data: "id",
					},
					{
						title: "Common Name",
						data: "name",
					},
				],
				tableOptions = {
					destroy: true,
				},
				table = tables.initTable(
					this.getDetailsTableElement(),
					tableOptions,
					columnDefs
				),
				rows = _.map(models, function (m) {
					return {
						id: m.id(),
						name: m.name(),
					};
				});
			table.clear();
			table.populate(rows);
		},

		renderCommunities: function (models) {
			var columnDefs = [
					{
						title: "Community ID",
						data: "id",
					},
					{
						title: "Community Name",
						data: "name",
					},
				],
				tableOptions = {
					destroy: true,
				},
				table = tables.initTable(
					this.getDetailsTableElement(),
					tableOptions,
					columnDefs
				),
				rows = _.map(models, function (m) {
					return {
						id: m.id(),
						name: m.name(),
					};
				});
			table.clear();
			table.populate(rows);
		},

		clearDetails: function () {
			this.getDetailsContentElement().html("");
		},

		buildDetailsLabel: function (trend, data, type) {
			return "" + trend + " for " + data;
		},

		/*
         id should be something like fauna_population_<trend>
         */
		renderDetails: function (id, model) {
			var split = id.split("_"),
				data = split[0],
				type = split[1],
				trend = split[2],
				renderSpecies = _.bind(this.renderSpecies, this),
				renderCommunities = _.bind(this.renderCommunities, this),
				getDetailsTableElement = _.bind(
					this.getDetailsTableElement,
					this
				),
				label = this.buildDetailsLabel(trend, data, type),
				template = _.template(this.getDetailsTemplate())({
					id: this.id,
					label: label,
				});

			this.getDetailsContentElement().html(template);
			model.onReady(function (records) {
				var models = records[data][type][trend].models;
				if (data === "fauna" || data === "flora") {
					renderSpecies(models);
				}
				if (data === "communities") {
					renderCommunities(models);
				}
				$.scrollTo(getDetailsTableElement(), 0);
			});
		},
	});
});
