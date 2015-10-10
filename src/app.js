/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var v2 = require('vector2');



var loading = new UI.Card({
  title: 'HF Bands',
  subtitle: 'hamqsl.com',
    body: 'Fetching data...'
});

var conds = new UI.Window();

conds.add(new UI.Rect({position: new v2(0,0), size: new v2(144,166)}));

conds.add(new UI.Text({
    font: "gothic-18-bold",
    textAlign: "left",
    text: "Band",
    position: new v2(0,0),
    size: new v2(144,18),
    color: 'black'
}));

conds.add(new UI.Text({
    font: "gothic-18-bold",
    textAlign: "center",
    text: "Day",
    position: new v2(15,0),
    size: new v2(144,18),
    color: 'black'
}));

conds.add(new UI.Text({
    font: "gothic-18-bold",
    textAlign: "right",
    text: "Night",
    position: new v2(0,0),
    size: new v2(144,18),
    color: 'black'
}));



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
    var pos = 18;
    for (var c in cond_fill) {
        console.log(JSON.stringify(c));
        conds.add(new UI.Text({
            font: "gothic-18",
            textAlign: "left",
            text: c,
            position: new v2(0,pos),
            size: new v2(144,18),
            color: 'black'
        }));
        conds.add(new UI.Text({
            font: "gothic-18",
            textAlign: "center",
            text: cond_fill[c].day,
            position: new v2(15,pos),
            size: new v2(144,18),
            color: 'black'
        }));
        conds.add(new UI.Text({
            font: "gothic-18",
            textAlign: "right",
            text: cond_fill[c].night,
            position: new v2(0,pos),
            size: new v2(144,18),
            color: 'black'
        }));
        pos += 18;
    }
    conds.add(new UI.Text({
        font: "gothic-18",
        textAlign: "center",
        text: "Sig Noise: " + propinfo.solar.solardata.signalnoise,
        position: new v2(0,pos),
        size: new v2(144,18),
        color: 'black'
    }));
    pos += 18;
    conds.add(new UI.Text({
        font: "gothic-18",
        textAlign: "center",
        text: "MUF: " + propinfo.solar.solardata.muf + "MHz",
        position: new v2(0,pos),
        size: new v2(144,18),
        color: 'black'
    }));
    pos = 132;
    conds.add(new UI.Text({
        font: "gothic-14",
        textAlign: "left",
        text: "Data: N0NBH",
        position: new v2(0,pos),
        size: new v2(144,14),
        color: 'black'
    }));
    conds.add(new UI.Text({
        font: "gothic-14",
        textAlign: "right",
        text: "hamqsl.com",
        position: new v2(0,pos),
        size: new v2(144,14),
        color: 'black'
    }));
    conds.show();
    loading.hide();
}

loading.on('show',function() {
    get_data();
});

loading.show();

