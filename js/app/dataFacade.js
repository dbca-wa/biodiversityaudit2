define([
        'recline',
        'lib/csv'
    ],
    function (recline, csv) {
        var ref_ids = {
            fauna_master_human_headers: 'd66bf8af-9456-4b4b-a60c-3dbaa788bcfc',
            fauna_master_machine_headers: 'ab5bd599-73cc-4dbc-94f2-6d35ee24d1c6',
            fauna_headers_mapping: 'f3368ce6-0de5-4a9d-98df-6de0d5f69196'
        };
        var search_url_base = 'http://internal-data.dpaw.wa.gov.au/api/3/action/datastore_search',
            sql_url_base = 'http://internal-data.dpaw.wa.gov.au/api/3/action/datastore_search_sql';

//        var dataset = new recline.Model.Dataset({
//            url: '../data/fauna.csv',
//            backend: 'csv',
//            delimiter: ',',
//            quotechar: '"',
//            encoding: 'utf8'
//        });

        return {
            search_fauna: function (params, success) {
                params = params || {};
                params['resource_id'] = ref_ids['fauna_master_human_headers'];
                success = success || function (data) {
                    console.log(data);
                };
                $.ajax({
                    url: search_url_base,
                    dataType: "json",
                    data: params,
                    success: success,
                    error: function (data) {
                        var msg = data.responseJSON.error.fields[0];
                        console.log("Error = ", msg);
                    }
                })
            }

        };


    });