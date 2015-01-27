 /* Ajax JS queries call the CKAN-hosted Fauna CSV, process data and populate answer fields 
       * http://docs.ckan.org/en/latest/maintaining/datastore.html#ckanext.datastore.logic.action.datastore_search
       * TODO read all CSV once, then filter and process for each query
       */
    
      /* The CKAN resource ID of the Fauna CSV */
      var res_id = 'd66bf8af-9456-4b4b-a60c-3dbaa788bcfc';
  
      /* The CKAN API URL */
      var ckan_url = 'http://internal-data.dpaw.wa.gov.au/api/3/action/datastore_search';
      var ckan_sql_url = 'http://internal-data.dpaw.wa.gov.au/api/action/datastore_search_sql?sql=';
      var ckan_csv_url = 'http://internal-data.dpaw.wa.gov.au/datastore/dump/' + res_id;
      var fauna_csv_url = 'http://internal-data.dpaw.wa.gov.au/dataset/f843f4ca-5473-4b49-b0db-a93247b7d9f0/' +
                          'resource/d66bf8af-9456-4b4b-a60c-3dbaa788bcfc/download/' + 
                          'Biodiversity-Audit-II-Condition-of-Biological-Assets-version-MASTER-FAUNA-v17-xlsm.csv';
      
       
      /* One JQL query expressed through CKAN datastore_search parameters */
      var data_33 = {resource_id: res_id, 
        limit:10000,
        q:'JAF02'
        //filters (dictionary) – matching conditions to select, e.g {"key1": "a", "key2": "b"} 
        //q (string or dictionary) – full text query. 
        //   If q is a string, it’ll search on all fields on each row. 
        //   If q is a dictionary as {"key1": "a", "key2": "b"}, it'll search on each specific field (optional)
        //limit (int) – maximum number of rows to return (optional, default: 100)
        //distinct (bool) – return only distinct rows (optional, default: false)
        //fields (list or comma separated string) – fields to return (optional, default: all fields in original order)
        //sort (string) – comma separated field names with ordering e.g.: "fieldname1, fieldname2 desc"
      };
      
      /* Approach 1: One AJAX call to CKAN's datastore_search populates a total number and a data DOM element */
      $.ajax({
        url: ckan_url,
        data: data_33,
        jsonp : false,
        jsonpCallback: 'jsonCallback',
        success: function(data) {
          $("#a33")[0].innerHTML = (data.result.total);
          //TODO render data
        }
      });
      
      
      var data_57 = {resource_id: res_id, limit:10000,
        q:'Western Autralia',
        //fields:'Scale, Scientific name',
        limit: 10000,
      };
      
      /* Approach 1: Question 57 as datastore_search query */
      $.ajax({
        url: ckan_url,
        data: data_57,
        jsonp : false,
        jsonpCallback: 'jsonCallback',
        success: function(data) {
          $("#a57")[0].innerHTML = (data.result.total);
        }
      });
     
     /* Approach 2: Question 57 as CKAN Datastore SQL API call 
     var sql_57 = 'SELECT%20*%20from%20%'+ res_id + '%22%20WHERE%20Scale%20LIKE%20%27Western%20Australia%27';
     $.ajax({
        url: ckan_sql_url + sql_57,
        // fails with status 500 on CORS not allowed
        jsonp : false,
        jsonpCallback: 'jsonCallback',
        success: function(data) {
          $("#a57")[0].innerHTML = (data.result.total);
        }
      });*/
     
     /* Approach 3: Let's just shlorp the whole Fauna CSV once and process client-side. 
     $.ajax({
        url: ckan_csv_url,
        jsonp : false,
        jsonpCallback: 'jsonCallback',
        success: function(data) {
          //$("#fauna")[0].innerHTML = data;
        }
      }); */
        
      /* Approach 4: ReclineJS reads CSV from CKAN resource URL */
      recline.Backend.DataProxy.timeout = 10000; // patience you must have if big the data is
      var faunacsv = new recline.Model.Dataset({url: fauna_csv_url, rows: 10000, backend: 'csv'});
      // once data is fetched it will be stored in a local MemoryStore so further querying will not involve the DataProxy
      
/* To enable the ReclineJS dataviewer at #faunadata, enable the next line */
      //faunacsv.fetch();
      
      // Choose from simple Grid view:
      //var grid = new recline.View.Grid({ model: faunacsv });
      //$('#faunadata').append(grid.el);
      
      // or advanced Multiview:
      var views = [
        {
          id: 'grid',
          label: 'Grid',
          view: new recline.View.SlickGrid({
            model: faunacsv,
            state: {
              gridOptions: {
                editable: false,
                // Enable support for row add
                enabledAddRow: false,
                // Enable support for row delete
                enabledDelRow: false,
                // Enable support for row Reoder 
                enableReOrderRow:false,
                autoEdit: false,
                enableCellNavigation: true
              },
              columnsEditor: [
                { column: 'date', editor: Slick.Editors.Date },
                { column: 'title', editor: Slick.Editors.Text }
              ]
            }
          })
        }
        /*,
        { 
          // it's only text data, there's not much to plot 
          id: 'graph',
          label: 'Graph',
          view: new recline.View.Graph({ model: faunacsv })
        },
        {
          // there is already a leaflet map on this page
          id: 'map',
          label: 'Map',
          view: new recline.View.Map({  model: faunacsv })
        }*/
      ];
     
/* To enable the RelineJS dataviewer for #faunadata, enable the next line */
     //var multiView = new recline.View.MultiView({ model: faunacsv, el: $('#faunadata'), views: views });
