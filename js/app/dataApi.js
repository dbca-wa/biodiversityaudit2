define([
    'recline',
    'lib/csv'
],
function (recline, csv) {
    var dataset = new recline.Model.Dataset({
        url: '../data/fauna.csv',
        backend: 'csv',
        delimiter: ',',
        quotechar: '"',
        encoding: 'utf8'
    });

//    dataset.fetch().done(function(dataset) {
//        console.log(dataset.records);
//    });

    return {
        ds: dataset
    };


});