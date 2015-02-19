define([
        'jquery',
        'underscore',
        'backbone',
        'recline',
        'lib/csv',
        'config'
    ],
    function ($, _, Backbone, recline, csv, config) {

        var faunaCSVUrl = config.urls.fauna_csv;
        var faunaDataset = new recline.Model.Dataset({
            url: faunaCSVUrl,
            backend: 'csv'
        });
        var faunaDeferred = initFauna();

        function setFields(dataset) {
            // the first row contains the field label
            dataset.query({size:1, q:''});
            var labels = dataset.records.at(0);
            dataset.fields.each(function (f) {
                f.set('label', labels.get(f.get('id')));
            });
        }

        function initFauna() {
            var df = new $.Deferred();
            var ddf = faunaDataset.fetch()
                .done(setFields)
                .done(queryAll)
                .done(function (dataset) {
                df.resolve(dataset.records.clone())
            });
            return df;
        }

        function queryAll(dataset) {
            dataset.query({size: dataset.recordCount, from: 1, q: ''});
        }

        return {
            faunDef: faunaDeferred,
            getFaunaDataset: function () {return faunaDataset;},
            getAllFaunaRecords: function (success) {
                faunaDeferred.done(success)
            }
        };


    });