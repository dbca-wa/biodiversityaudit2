define([
        'jquery',
        'underscore',
        'backbone',
        'recline',
    ],
    function ($, _, Backbone, recline) {

        var deferred = new $.Deferred();

        // the first row of the data contains the column name.
        // we set the field.label with this value.
        function _setFields(dataset) {
            var df = new $.Deferred();
            var labels = dataset.records.at(0);
            dataset.fields.each(function (f) {
                f.set('label', labels.get(f.get('id')));
            });
            df.resolve(dataset);
            return df.promise();
        }

        // Query all the rows but the first one
        function _queryAll(dataset) {
            return dataset.query({size: dataset.recordCount, from: 1, q: ''});
        }

        function init(dataset) {
            dataset.fetch()
                .done(function () {
                    _setFields(dataset)
                        .done(function () {
                            _queryAll(dataset)
                                .done(function () {
                                    deferred.resolve(dataset.records.clone());
                                });
                        });
                });
            return deferred;
        }

        return {
            deferred: deferred,
            init: init,
            onReady: function (success, err) {
                deferred.then(function (collection) {
                    success(collection, collection.models);
                }, err)
            }
        };


    });