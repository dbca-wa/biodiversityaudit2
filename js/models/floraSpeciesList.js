define([
    'dataSources',
    'models/faunaSpeciesList'
], function (dataSources, FaunaSpeciesList){

    return FaunaSpeciesList.extend({
        source: dataSources.flora
    });


});