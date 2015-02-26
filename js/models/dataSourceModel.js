define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.Model.extend({

        defaults: {
            dataset: null
        },

        initialize: function () {
            _.bindAll(this, 'fetch');
        },

        /*
         fetch all the records and prepare for use
         */
        fetch: function (force) {
            // the first row of the data contains the column name.
            // we set the field.label with this value.
            function setFields(dataset) {
                var df = new $.Deferred();
                var labels = dataset.records.at(0);
                dataset.fields.each(function (f) {
                    f.set('label', labels.get(f.get('id')));
                });
                df.resolve(dataset);
                return df.promise();
            }

            // Query all the rows but the first one
            function queryAll(dataset) {
                return dataset.query({size: dataset.recordCount, from: 1, q: ''});
            }

            var deferred = new $.Deferred(),
                dataset = this.get('dataset');
            if (!this.readyDeferred || force) {
                dataset.fetch()
                    .done(function () {
                        setFields(dataset)
                            .done(function () {
                                queryAll(dataset)
                                    .done(function () {
                                        // all done, clone the records to avoid mutation with the dataset
                                        deferred.resolve(dataset.records.clone());
                                    });
                            });
                    });
                this.readyDeferred = deferred;
            }
            else {
                deferred = this.readyDeferred;
            }
            return deferred;
        },

        /*
         Convenient method to register a callback when the data is ready
         */
        onReady: function (success, err) {
            var deferred =  this.readyDeferred || this.fetch();
            deferred.promise().then(function (collection) {
                success(collection, collection.models);
            }, err)
        }

    });

});