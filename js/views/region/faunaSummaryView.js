define([
	"jquery",
	"jqueryScrollTo",
	"underscore",
	"backbone",
	"../../app/tableFacade",
	"app/filters",
	"views/tableView",
	"text!templates/region/summaryDefaultTemplate.html",
	"text!templates/region/detailsDefaultTemplate.html",
	"text!templates/region/threatsSummaryTemplate.html",
], function (
	$,
	scrollTo,
	_,
	Backbone,
	tables,
	filters,
	TableView,
	summaryTemplate,
	detailsTemplate,
	threatsCellTemplate
) {
	return Backbone.View.extend({
		el: "#faunaTab",

		idTemplate: _.template(
			'<span class="taxa"><a title="click to view asset information." href="#assets/species/<%- id %>"><%= id %></a></span>'
		),
		nameTemplate: _.template("<span><%= name %></span>"),
		distTemplate: _.template("<span><%= value %></span>"),
		threatsTemplate: _.template(threatsCellTemplate),
		trendsTemplate: _.template('<a  id="trends_<%= id %>">details</a>'),
		statusTemplate: _.template("<%= status %>"),
		managementTemplate: _.template(
			'<a id="management_<%= id %>">details</a>'
		),

		columnDefinitions: [
			{
				title: "Taxon",
				width: "15vw",
				data: "id",
				render: function (data) {
					return data.rendered;
				},
			},
			{
				title: "Common Name",
				width: "20vw",
				data: "name",
				render: function (data) {
					return data.rendered;
				},
			},
			{
				title: "Distribution",
				width: "20vw",
				data: "dist",
				render: function (data) {
					return data.rendered;
				},
			},
			{
				title: "Threats",
				width: "12vw",
				data: "threats",
				render: function (data) {
					return data.rendered;
				},
			},
			{
				title: "Status WA",
				width: "11vw",
				data: "status",
				render: function (data) {
					return data.rendered;
				},
			},
			{
				title: "Trends",
				data: "trends",
				width: "11vw",
				render: function (data) {
					return data.rendered;
				},
			},
			{
				title: "Management Options",
				width: "11vw",
				data: "management",
				render: function (data) {
					return data.rendered;
				},
			},
		],

		buildSummaryThreats: function (records) {
			var pastCount = 0,
				futureCount = 0;
			_.each(records, function (r) {
				var past = r.get("PASTPRESSURES_CAT");
				var fut = r.get("FUTURETHREATS_CAT");
				if (filters.notEmpty(past)) {
					past = past.toLowerCase();
					if (_.contains(past, "unknown")) {
						pastCount = "??";
					} else if (_.contains(past, "no known")) {
						pastCount = 0; //'No known';
					} else {
						pastCount += 1;
					}
				}
				if (filters.notEmpty(fut)) {
					fut = fut.toLowerCase();
					if (_.contains(fut, "unknown")) {
						futureCount = "unknown";
					} else if (_.contains(fut, "no known")) {
						futureCount = 0; //'No known';
					} else {
						futureCount += 1;
					}
				}
			});

			return {
				pastCount: pastCount,
				futureCount: futureCount,
			};
		},

		getStatusWA: function (records) {
			// Fixed version - split the chaining
			var filter = _.filter(records, function (r) {
				return filters.notEmpty(r.get("STATUSWA"));
			});

			if (filter.length > 0) {
				return filter[0].get("STATUSWA");
			} else {
				return ""; //'?????';
			}
		},

		getDistribution: function (records) {
			// Fixed version - split the chaining
			var filter = _.filter(records, function (r) {
				return filters.notEmpty(r.get("DIST"));
			});

			if (filter.length > 0) {
				return filter[0].get("DIST");
			} else {
				return ""; //'?????';
			}
		},

		buildSummaryRow: function (records, id) {
			var id_ = {
					rendered: this.idTemplate({ id: id }),
				},
				name = {
					rendered: this.nameTemplate({
						name: records[0].get("NAMECOMMON"),
					}),
				},
				dist = {
					rendered: this.distTemplate({
						value: this.getDistribution(records),
					}),
				},
				threats = {
					rendered: this.threatsTemplate(
						_.extend({ id: id }, this.buildSummaryThreats(records))
					),
				},
				trends = {
					rendered: this.trendsTemplate({ id: id }),
				},
				status = {
					rendered: this.statusTemplate({
						status: this.getStatusWA(records),
					}),
				},
				management = {
					rendered: this.managementTemplate({ id: id }),
				};

			return {
				id: id_,
				name: name,
				dist: dist,
				threats: threats,
				trends: trends,
				status: status,
				management: management,
			};
		},

		initialize: function () {
			_.bindAll(this, "render");
		},

		render: function () {
			if (this.model) {
				this.renderSummary();
			}
		},

		renderSummary: function () {
			this.setSummaryContent(this.buildSummaryContent());
			var tableSelector = this.getSummaryTableElement();
			var table = tables.initTable(
				tableSelector,
				{},
				this.columnDefinitions
			);
			var buildRow = _.bind(this.buildSummaryRow, this);

			// Fixed version - split the chaining
			var rows = _.map(this.model, function (v, k) {
				return buildRow(v, k);
			});

			var renderDetails = _.bind(this.renderDetails, this);
			//bind details links
			table.on("draw.dt", function (e) {
				$(e.target)
					.find("td a:contains('details')")
					.on("click", function (e) {
						var split = e.target.id.split("_");
						renderDetails(split[0], split[1]);
					});
			});
			table.populate(rows);
		},

		buildSummaryContent: function () {
			var values = { label: this.label || "" };
			return _.template(summaryTemplate)(values);
		},

		renderDetails: function (type, id) {
			var records = this.model[id];
			if (type == "threats") {
				this.renderThreatDetails(id, records);
			} else if (type === "trends") {
				this.renderTrendsDetails(id, records);
			} else if (type === "management") {
				this.renderManagementDetails(id, records);
			} else {
				console.error("No details for type:", type);
			}
			$.scrollTo(this.getDetailsContentElement(), 0);
		},

		setSummaryContent: function (html) {
			var container = this.$el.find("#summary_content");
			container.html(html);
			return container;
		},

		getSummaryContentElement: function () {
			return this.$el.find("#summary_content");
		},

		getSummaryTableElement: function () {
			return this.getSummaryContentElement().find("#summary_table");
		},

		getDetailsContentElement: function () {
			return this.$el.find("#details_content");
		},

		getDetailsTableElement: function () {
			return this.getDetailsContentElement().find("#details_table");
		},

		setDetailsContent: function (html) {
			var container = this.getDetailsContentElement();
			container.html(html);
			return container;
		},

		// , 'NOTES1' = additional notes in regions > threats > details
		renderThreatDetails: function (id, records) {
			var tableFields = [
				"PASTPRESSURES_CAT",
				"PASTPRESSURES_SPECIFY",
				"FUTURETHREATS_CAT",
				"FUTURETHREATS_SPECIFY",
				"RECOVERYPLANCOMMENCE",
			];
			var tableElement = this.getDetailsTableElement();
			var tableView = new TableView({
				el: tableElement.selector,
				model: records,
				fields: tableFields,
				filters: [
					{
						field: "__one__",
						predicate: filters.notEmpty,
					},
				],
			});
			var compiled = _.template(detailsTemplate);
			var table;
			this.setDetailsContent(compiled({ type: "Threats", id: id }));
			table = tableView.render();
			// reverse order to put blank line at the end
			table.order([0, "desc"]).draw();
		},

		renderTrendsDetails: function (id, records) {
			function getValue(column, def) {
				var vals = getValues(column);
				var result = vals[0] || def || "";
				if (vals.length > 1) {
					console.error(
						"More than one value for ",
						column,
						vals,
						".Species:",
						id
					);
				}
				return result;
			}

			function getValues(column) {
				// Fixed version - split the chaining
				var mapped = _.map(records, function (r) {
					return r.get(column);
				});

				return _.filter(mapped, function (val) {
					return filters.notEmpty(val);
				});
			}

			function buildESURow() {
				return {
					type: "ESU",
					raw: getValue("KNOWNESU_NUM"),
					trans: "N/A",
					trend: getValue("KNOWNESU_TREND"),
					reliability: getValue("KNOWNESU_TRENDRELIAB"),
					// notes: getValue('KNOWNESU_NOTES'),
					IUCN: "N/A",
				};
			}

			function buildPopRow() {
				return {
					type: "Pop",
					raw: getValue("KNOWNPOPS_NUM"),
					trans: getValue("KNOWNPOPS_TRANS"),
					trend: getValue("KNOWNPOPS_TREND"),
					reliability: getValue("KNOWNPOPS_TRENDRELIAB"),
					// notes: getValue('KNOWNPOPS_NOTES'),
					IUCN: getValue("KNOWNPOPS_CAT"),
				};
			}

			function buildIndRow() {
				return {
					type: "# Ind",
					raw: getValue("MATIND_RAW"),
					trans: "N/A",
					trend: getValue("MATIND_TREND"),
					reliability: getValue("MATIND_TRENDRELIAB"),
					// notes: getValue('MATIND_NOTES'),
					IUCN: getValue("MATIND_CAT"),
				};
			}

			function buildEOORow() {
				return {
					type: "EOO",
					raw: getValue("EOOAREA_RAW"),
					trans: "N/A",
					trend: getValue("EOOAREA_TREND"),
					reliability: "N/A",
					// notes: getValue('EOOAREA_NOTES'),
					IUCN: getValue("EOOAREA_CAT"),
				};
			}

			function buildAOORow() {
				return {
					type: "AOO",
					raw: getValue("AOOAREA_RAW"),
					trans: "N/A",
					trend: getValue("AOOAREA_TREND"),
					reliability: "N/A",
					// notes: getValue('AOOAREA_NOTES'),
					IUCN: getValue("AOOAREA_CAT"),
				};
			}

			var columnDefs = [
				{
					title: "Trend Characteristic",
					data: "type",
					width: "5%",
					orderable: false,
				},
				{
					title: "Raw #",
					width: "5%",
					data: "raw",
				},
				{
					title: "# Translocated",
					width: "5%",
					data: "trans",
				},
				{
					title: "Trend",
					width: "10%",
					data: "trend",
				},
				{
					title: "Trend Reliability",
					width: "20%",
					data: "reliability",
				}, //,
				// {
				//     title: 'Notes',
				//     data: 'notes'
				// }
			];
			var compiled = _.template(detailsTemplate);
			this.setDetailsContent(compiled({ type: "Trends", id: id }));
			var table = tables.initTable(
				this.getDetailsTableElement(),
				{
					paging: false,
					info: false,
					searching: false,
					ordering: false,
				},
				columnDefs
			);

			table.populate([
				buildESURow(),
				buildPopRow(),
				buildIndRow(),
				buildEOORow(),
				buildAOORow(),
			]);

			// add foot note
			var html =
				"ESU: Evolutionary Significant Units &nbsp;&nbsp;&nbsp;" +
				"Pop: Populations &nbsp;&nbsp;&nbsp;" +
				"#Ind: Number of Mature Individuals &nbsp;&nbsp;&nbsp;" +
				"EOO: Extent Of Occurrence  &nbsp;&nbsp;&nbsp;" +
				"AOO: Area Of Occupancy";
			this.$el.find("#details_footer").html(html);
		},

		renderManagementDetails: function (id, records) {
			function getNotEmptyValues(column) {
				// Fixed version - split the chaining
				var mapped = _.map(records, function (r) {
					return r.get(column);
				});

				return _.filter(mapped, function (val) {
					return filters.notEmpty(val);
				});
			}

			function renderAsList(values) {
				var compiled = _.template(
					"<ul><% _.forEach(values, function(value) { %><li><%- value %></li><% }); %></ul>"
				);
				return compiled({ values: values });
			}

			function buildResearchRow() {
				return {
					type: "Research",
					category: getNotEmptyValues("MANREQ_RESEARCH_CAT"),
					comment: getNotEmptyValues("MANREQ_RESEARCH_SPECIFY"),
				};
			}

			function buildEvalRow() {
				return {
					type: "Evaluation",
					category: getNotEmptyValues("MANREQ_EVALUATION_CAT"),
					comment: getNotEmptyValues("MANREQ_EVALUATION_SPECIFY"),
				};
			}

			function buildPlanningRow() {
				return {
					type: "Conservation Planning",
					category: getNotEmptyValues("MANREQ_CONSPLAN_CAT"),
					comment: getNotEmptyValues("MANREQ_CONSPLAN_SPECIFY"),
				};
			}

			function buildDirectRow() {
				return {
					type: "Direct Intervention",
					category: getNotEmptyValues("MANREQ_DIRECT_CAT"),
					comment: getNotEmptyValues("MANREQ_DIRECT_SPECIFY"),
				};
			}

			function buildIndirectRow() {
				return {
					type: "Indirect Intervention",
					category: getNotEmptyValues("MANREQ_INDIRECT_CAT"),
					comment: getNotEmptyValues("MANREQ_INDIRECT_SPECIFY"),
				};
			}

			function buildOtherRow() {
				return {
					type: "Other",
					category: getNotEmptyValues("MANREQ_OTHER_CAT"),
					comment: getNotEmptyValues("MANREQ_OTHER_SPECIFY"),
				};
			}

			var columnDefs = [
				{
					title: "Type",
					data: "type",
					width: "15%",
				},
				{
					title: "Category",
					data: "category",
					render: function (data) {
						return renderAsList(data);
					},
				},
				{
					title: "Potential Strategies",
					data: "comment",
					render: function (data) {
						return renderAsList(data);
					},
				},
			];

			var compiled = _.template(detailsTemplate);
			this.setDetailsContent(compiled({ type: "Management", id: id }));
			var table = tables.initTable(
				this.getDetailsTableElement(),
				{
					paging: false,
					info: false,
					searching: false,
					ordering: false,
				},
				columnDefs
			);

			table.populate([
				buildResearchRow(),
				buildEvalRow(),
				buildPlanningRow(),
				buildDirectRow(),
				buildIndirectRow(),
				buildOtherRow(),
			]);
		},
	});
});
