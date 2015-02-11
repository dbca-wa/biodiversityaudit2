define([
        'jquery',
        'recline',
        'lib/ckan',
        'lib/csv'
    ],
    function ($, recline, ckan, csv) {
        var testCSV = new recline.Model.Dataset({
            url: '../data/fauna.csv',
            backend: 'csv',
            delimiter: ',',
            quotechar: '"',
            encoding: 'utf8'
        });

        var fauna = new recline.Model.Dataset({
            url: 'http://internal-data.dpaw.wa.gov.au/dataset/f843f4ca-5473-4b49-b0db-a93247b7d9f0/resource/e9af8028-a790-4a5c-b713-84eb69298175',
            id: 'e9af8028-a790-4a5c-b713-84eb69298175',
            backend: 'ckan'
        });

        var client = new CKAN.Client('http://internal-data.dpaw.wa.gov.au');

        return {
            search_fauna1: function (query) {
                query = query || {};
                query['resource_id'] = 'e9af8028-a790-4a5c-b713-84eb69298175';
                console.log('query=',query);
                client.action('datastore_search', query, function (err, out) {
                    if (err) { console.log('Error:', err)}
                    else {
                        console.log('R=', out);
                    }
                });
            },

            search_fauna2: function (query) {
                query = query || {};
                query['resource_id'] = 'e9af8028-a790-4a5c-b713-84eb69298175';
                console.log('query=',query);
                client.datastoreQuery(query, function (err, out) {
                    if (err) { console.log('Error:', err)}
                    else {
                        console.log('R=', out);
                    }
                });
            },

            search_fauna3: function (query, success) {
                query = query || {};
                query['resource_id'] = 'e9af8028-a790-4a5c-b713-84eb69298175';
                success = success || function (data) {
                    console.log('R=', data);
                };
                console.log('query=',query);
                $.ajax({
                    url: 'http://internal-data.dpaw.wa.gov.au/api/3/action/datastore_search',
                    dataType: "json",
                    data: query,
                    success: success,
                    error: function (data) {
                        var msg = data.responseJSON.error.fields[0];
                        console.log("Error:", msg);
                    }
                })
            },


            client: client,
            fauna: fauna
        };
    });