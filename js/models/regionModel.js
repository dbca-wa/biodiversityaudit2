define(["jquery", "underscore", "backbone", "config", "dataSources"], function (
	$,
	_,
	Backbone,
	config,
	dataSources
) {
	return Backbone.Model.extend({
		id: function () {
			return this.get("SUB_CODE");
		},

		name: function () {
			return this.get("REG_NAME");
		},

		initialize: function () {
			this.set("spatial_profile_url", this.getSpatialProfileURL());
			dataSources.fauna.onReady(_.bind(this.setFaunaRecords, this));
			dataSources.flora.onReady(_.bind(this.setFloraRecords, this));
			dataSources.communities.onReady(
				_.bind(this.setCommunitiesRecords, this)
			);
			dataSources.wetlands.onReady(_.bind(this.setWetlandsRecords, this));
		},

		/*
         Construct the URL for the regional profile PDF.
        E.g. http://static.dbca.wa.gov.au/static/biodiversityaudit/Sub-Region-Profile-Reporting-Tables-LSD02.pdf
        DBCA CDN: config.ckan.static_url
        Base filename: Sub-Region-Profile-Reporting-Tables-
        spatial_profile_basename: DBCA CDN + Base filename (as per config.js)
        Schema: DBCA CDN + Base filename + "SUB_CODE" + ".pdf"
         */
		// getSpatialProfileURL: function () {
		// parse the popup attribute for a href that contains the ckan url
		// var node = $('<div>' + this.get('popup') + '</div>');
		// var href = node.find('a[href*="').attr('href');
		// return config.urls.spatial_profile_basename + this.id() + ".pdf";
		// },

		getSpatialProfileURL: function () {
			const subCode = this.id();
			console.log("Looking up PDF for:", subCode);
			console.log("config.region_pdfs:", config.region_pdfs);
			console.log("config.ckan.static_url:", config.ckan.static_url);

			const pdfInfo = config.region_pdfs[subCode];
			console.log("Found pdfInfo:", pdfInfo);

			if (pdfInfo && pdfInfo.url) {
				const fullUrl = `https:${config.ckan.static_url}/${pdfInfo.url}`;
				console.log("Returning new URL:", fullUrl);
				return fullUrl;
			} else if (pdfInfo && pdfInfo.fallback_file) {
				// Return local data folder URL (test mode or fallback)
				return `../data/pdfs/${pdfInfo.fallback_file}.pdf`;
			} else {
				// Last resort fallback to local data folder
				return `../data/pdfs/sub-region-profile-reporting-tables-${subCode.toLowerCase()}.pdf`;
			}
		},

		setFaunaRecords: function (collection, allRecords) {
			var regionCode = this.get("SUB_CODE");

			// Fixed: split the chaining
			var filteredRecords = _.filter(allRecords, function (r) {
				return r.get("SCALE") === regionCode;
			});

			var myRecordsBySpecies = _.groupBy(filteredRecords, function (r) {
				return r.get("NAMESCIEN");
			});

			this.set("fauna", myRecordsBySpecies);
		},

		setFloraRecords: function (collection, allRecords) {
			var regionCode = this.get("SUB_CODE");

			// Fixed: split the chaining
			var filteredRecords = _.filter(allRecords, function (r) {
				return r.get("SCALE") === regionCode;
			});

			var myRecordsBySpecies = _.groupBy(filteredRecords, function (r) {
				return r.get("NAMESCIEN");
			});

			this.set("flora", myRecordsBySpecies);
		},

		setCommunitiesRecords: function (collection, allRecords) {
			var regionCode = this.get("SUB_CODE");

			// Fixed: split the chaining
			var filteredRecords = _.filter(allRecords, function (r) {
				return r.get("SCALE") === regionCode;
			});

			var recordsByCommunity = _.groupBy(filteredRecords, function (r) {
				return r.get("COMMUNITYID");
			});

			this.set("communities", recordsByCommunity);
		},

		setWetlandsRecords: function (collection, allRecords) {
			var regionCode = this.get("SUB_CODE");

			// Fixed: split the chaining
			var filteredRecords = _.filter(allRecords, function (r) {
				return r.get("SCALE") === regionCode;
			});

			var myRecordsBySpecies = _.groupBy(filteredRecords, function (r) {
				return r.get("???????"); // ??? What?
			});

			this.set("wetlands", myRecordsBySpecies);
		},
	});
});
