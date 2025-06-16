define([
	"underscore",
	"backbone",
	"dataSources",
	"models/speciesModel",
], function (_, Backbone, dataSources, speciesModel) {
	return Backbone.Collection.extend({
		model: speciesModel,
		source: dataSources.fauna,

		initialize: function () {
			this.source.onReady(_.bind(this.createAll, this));
		},

		createAll: function (recordCollection, recordArray) {
			var modelFields = new this.model().fields;
			var groupByField = modelFields.id;

			// Fixed version - split the chaining
			var groupedRecords = _.groupBy(recordArray, function (r) {
				return r.get(groupByField);
			});

			var species = _.map(groupedRecords, function (records) {
				var firstRecord = records[0];
				var attributes = _.pick(
					firstRecord.attributes,
					_.values(modelFields)
				);
				attributes.records = records;
				return attributes;
			});

			this.reset(species);
		},
	});
});
