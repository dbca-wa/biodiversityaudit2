/*
Create a ibra-min.json file from the ibra.geojson by keeping only the minimal information needed
 */

var fs = require('fs');
var _ = require('../../js/lib/lodash.js');
var ibra_full = JSON.parse(fs.readFileSync('../../data/ibra7.geojson', 'utf8'));

var ibra_min = _(ibra_full.features).map( function (feat) {
    return _.pick(feat.properties, ['SUB_CODE', "SUB_NAME", 'REG_CODE', 'REG_NAME']);
}).value();


fs.writeFileSync('../../data/ibra-min.json', JSON.stringify(ibra_min, 'utf8'));
