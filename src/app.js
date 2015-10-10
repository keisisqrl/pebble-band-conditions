/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

var fail = null;



var loading = new UI.Card({
  title: 'HF Bands',
  subtitle: 'hamqsl.com',
    body: 'Fetching data...'
});

var conds = new UI.Window();

loading.show();

function get_data() {
    ajax(
        {
            url: 'http://xml2json.herokuapp.com/?url=http://www.hamqsl.com/solarxml.php',
        },
        function(data, status, request){
            console.log("ready to parse");
            var parsed = JSON.parse(data.substring(1,data.length-1));
            console.log("JSON parse complete");
            render_data(parsed);
        },
        function(error, status, request){
            console.log('Status ' + status + ': ' + error.substring(1,error.length-1)); 
        }
    );
    console.log('ajax done');
}

function reduce_conditions(acc, single_cond,_,_ ) {
    console.log(JSON.stringify(single_cond));
    if (!acc[single_cond.name]) {acc[single_cond.name] = {};}
    acc[single_cond.name][single_cond.time] = [single_cond.__content__];
    return acc;
}

function render_data(propinfo) {
    console.log("in render_data");
    var conditions = propinfo.solar.solardata.calculatedconditions.band;
    console.log("conditions processed");
    console.log(JSON.stringify(conditions));
    var cond_fill = conditions.reduce(reduce_conditions, {});
    console.log(JSON.stringify(cond_fill));
}

get_data();

