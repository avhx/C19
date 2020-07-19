var express = require('express');
var admin = require("firebase-admin");
var cron = require("node-cron");
const https = require("https");
/*
var RdsServer = require('@rds/sdk/dist/lib/rds-server').RdsServer;
var RdsCatalog = require('@rds/sdk/dist/lib/rds-catalog').RdsCatalog;
var RdsDataProduct = require('@rds/sdk/dist/lib/rds-data-product').RdsDataProduct;
*/

var serviceAccount = require("./knoxcov.json");
var countyList = require("./counties.json").county;

/*
import { RdsServer, RdsCatalog, RdsDataProduct, HttpResponse } from '@rds/sdk';

const server = new RdsServer('https://knxhx.richdataservices.com/rds');
const catalog = new RdsCatalog(server, 'mobility');
const dataProduct = new RdsDataProduct(catalog, 'google_mobility_us_county');

dataProduct.select()
	.then((res) => {
           console.log(res);
	}, (err) => {
        console.log(err);
    });
*/

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://knoxcov-401fd.firebaseio.com"
});

var firestore = admin.firestore();

cron.schedule("0 * * * *", function() {
    console.log('hit');
});

var app = express()

app.post('/api/forceInvoke', function(req, res) {
    const content = req.body;
    if(content != undefined) {
        if(content.action != undefined && content.recompute_type != undefined) {
            // recompute the given stats ...
            res.send({response: 'recomputing given recompute_type '+content.recompute_type});
        } else {
            res.send({response: 'error! content sent is invalid or undefined'});
        }res.send({response: 'error! content sent is invalid or undefined'});
    }
});

function grabRDSData(catalog, catalog_type, query=undefined) {
    //return the JSON object with stuff
    var _promise = new Promise((resolve, reject) => {
        var urlBuilder = 'https://knxhx.richdataservices.com/rds/api/query/'+catalog+'/'+catalog_type+'/select?';
    
        if(query != undefined) {
            for (const key in query) {
                if (query.hasOwnProperty(key)) {
                    const param = query[key];
                    urlBuilder += key.toString() + '=' + param.toString() + '&'
                }
            }
        }
        console.log('URL Built:', urlBuilder);

        https.get(
          urlBuilder,
            (resp) => {
                let data = "";
                
                // A chunk of data has been recieved.
                resp.on("data", (chunk) => {
                    data += chunk;
                });      

                // The whole response has been received. Print out the result.
                resp.on("end", () => {
                    resolve(JSON.parse(data));
                });
            }
        )
        .on("error", (err) => {
            console.log("Error: " + err.message);
            reject(err);
        });
    });

    return _promise;
}

function generateMobilityStruct() {
    console.log('Generating stats from mobility dataset...');

    // Apply data to firestore documents:
    var countyCollection = firestore.collection('county');

    countyList.forEach(county => {
        // Reference county code and call up RDS:
        const countyID = county[1];
        const data = grabRDSData('mobility', 'google_mobility_us_county', query={
            'collimit': 25,
            'coloffset': 0,
            'count': true,
            'offset': 0,
            'limit': 100,
            'where': '(us_county_fips='+countyID+') AND (date_stamp>=2020-06-01)',
        });

        data.then((rdsData) => {
            // Manipulate rdsData:
            var _payload = rdsData.records;
            var newpayload = _payload[_payload.length-1]
            console.log(newpayload);

            const doc = countyCollection.doc(county[0].toLowerCase());
            doc.get().then((_doc) => {
                if(_doc.exists) {
                    // update:
                    if(newpayload != undefined) {
                        doc.update({'mobility': {'retail_recreation_pct': newpayload[3], 'grocery_pharamacy_pct': newpayload[4],'park_pct': newpayload[5], 'transit_pct': newpayload[6], 'worplace_pct': newpayload[7], 'residential_pct': newpayload[8]}})
                    } else {
                        doc.update({'mobility': {'retail_recreation_pct': null, 'grocery_pharamacy_pct': null,'park_pct': null, 'transit_pct': null, 'worplace_pct': null, 'residential_pct': null}});
                    }
                } else {
                    // force set instead:
                    if(newpayload != undefined) {
                        doc.set({'mobility': {'retail_recreation_pct': newpayload[3], 'grocery_pharamacy_pct': newpayload[4],'park_pct': newpayload[5], 'transit_pct': newpayload[6], 'worplace_pct': newpayload[7], 'residential_pct': newpayload[8]}})
                    } else {
                        doc.set({'mobility': {'retail_recreation_pct': null, 'grocery_pharamacy_pct': null,'park_pct': null, 'transit_pct': null, 'worplace_pct': null, 'residential_pct': null}});
                    }
                }
            });
        });
    });
}

function generateTNRaceStruct() {
    // data = {labels: [X AXIS STUFF], datasets: [{data: [Y AXIS STUFF]}, data2: [Y AXIS STUFF]], options: {RANDOM SHIT}}
    // Apply data to firestore documents:
    var stateCollection = firestore.collection('tn');
    const data = grabRDSData('tn_doh', 'us_tn_doh_race', query={
        'collimit': 25,
        'coloffset': 0,
        'count': true,
        'offset': 0,
        'limit': 600,
    });

    data.then((rdsData) => {
        // Manipulate rdsData:
        var _payload = rdsData.records;
        // total counts:
        var _labels = {} //treat as set
        var payloadTotalCounts = {} // dictionary: key -> race val -> [1000,1020,...]
        var payloadPercent = {} // dictionary: key -> race val -> [0.1,0.2,...]

        for (let i = 0; i < _payload.length; i++) {
            const date = _payload[i][0];
            let race = _payload[i][1];

            if(race == 2) {
                race = 'white';
            } else if(race == 1) {
                race = 'black';
            } else if(race == 0) {
                race = 'asian';
            } else if(race == 9) {
                race = 'unknown';
            } else if(race == 4) {
                race = 'indian';
            } else if(race == 5) {
                race = 'pacific'
            }
            else {
                race = 'other';
            }

            const count = _payload[i][2];
            const percent = _payload[i][3];
            
            if(_labels[date] == undefined) {
                _labels[date] = -1;
            }

            if(payloadTotalCounts[race] == undefined) {
                payloadTotalCounts[race] = [count];
            } else {
                payloadTotalCounts[race].push(count);
            }

            if(payloadPercent[race] == undefined) {
                payloadPercent[race] = [percent];
            } else {
                payloadPercent[race].push(percent);
            }
        }

        const true_labels = Object.keys(_labels);

        var construct_count = {
            labels: true_labels,
            datasets: [
                {
                    data: payloadTotalCounts['white'],
                    label: 'White',
                    borderColor: "#3e95cd",
                    fill: false
                },
                {
                    data: payloadTotalCounts['black'],
                    label: 'Black',
                    borderColor: "#8e5ea2",
                    fill: false
                },
                {
                    data: payloadTotalCounts['asian'],
                    label: 'Asian',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadTotalCounts['indian'],
                    label: 'American Indian or Alaska Native',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadTotalCounts['pacific'],
                    label: 'Native Hawaiian or Other Pacific Islander',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadTotalCounts['other'],
                    label: 'Other/Multiracial',
                    borderColor: "#e8c3b9",
                    fill: false
                },
                {
                    data: payloadTotalCounts['unknown'],
                    label: 'Unknown (Pending)',
                    borderColor: "#c45850",
                    fill: false
                }
            ],
            options: {
                title: {
                    display: true,
                    text: 'Tennessee COVID-19 Infection Count Race Demographic Breakdown'
                }
            }
        }

        var construct_percent = {
            labels: true_labels,
            datasets: [
                {
                    data: payloadPercent['white'],
                    label: 'White',
                    borderColor: "#3e95cd",
                    fill: false
                },
                {
                    data: payloadPercent['black'],
                    label: 'Black',
                    borderColor: "#8e5ea2",
                    fill: false
                },
                {
                    data: payloadPercent['asian'],
                    label: 'Asian',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadPercent['indian'],
                    label: 'American Indian or Alaska Native',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadPercent['pacific'],
                    label: 'Native Hawaiian or Other Pacific Islander',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadPercent['other'],
                    label: 'Other/Multiracial',
                    borderColor: "#e8c3b9",
                    fill: false
                },
                {
                    data: payloadPercent['unknown'],
                    label: 'Unknown (Pending)',
                    borderColor: "#c45850",
                    fill: false
                }
            ],
            options: {
                title: {
                    display: true,
                    text: 'Tennessee COVID-19 Infection Count Race Demographic Breakdown'
                }
            }
        }

        const doc = stateCollection.doc('stats');
        doc.get().then((_doc) => {
            if(_doc.exists) {
                // update:
                if(_payload != undefined) {
                    doc.update({'race_data': construct_count, 'race_data_percent': construct_percent});
                } else {
                    doc.update({'race_data': null, 'race_data_percent': null});
                }
            } else {
                // force set instead:
                if(_payload != undefined) {
                    doc.set({'race_data': construct_count, 'race_data_percent': construct_percent});
                } else {
                    doc.set({'race_data': null, 'race_data_percent': null});
                }
            }
        });
    });
}

function generateTNAgeStruct() {
    // data = {labels: [X AXIS STUFF], datasets: [{data: [Y AXIS STUFF]}, data2: [Y AXIS STUFF]], options: {RANDOM SHIT}}
    // Apply data to firestore documents:
    var stateCollection = firestore.collection('tn');
    const data = grabRDSData('tn_doh', 'us_tn_doh_age', query={
        'collimit': 25,
        'coloffset': 0,
        'count': true,
        'offset': 0,
        'limit': 2000,
    });

    data.then((rdsData) => {
        // Manipulate rdsData:
        var _payload = rdsData.records;

        // total counts:
        var _labels = {} //treat as set
        var payloadTotalCounts = {} // dictionary: key -> race val -> [1000,1020,...]
        var payloadDeathCounts = {}
        
        payloadTotalCounts[99] = [0,0]
        payloadDeathCounts[99] = [0,0]

        for (let i = 0; i < _payload.length; i++) {
            const date = _payload[i][0];
            const age = Number(_payload[i][1]);
            const count = _payload[i][2];
            const death = _payload[i][6];
            
            if(_labels[date] == undefined) {
                _labels[date] = -1;
            }

            if(payloadTotalCounts[age] == undefined) {
                payloadTotalCounts[age] = [count];
                // if(age == 81 && _payload[i+1][2] != 99 && _payload[i+1] != undefined) {payloadTotalCounts[99].push(0)}
            } else {
                payloadTotalCounts[age].push(count);
                // if(age == 81 && _payload[i+1][2] != 99 && _payload[i+1] != undefined) {payloadTotalCounts[99].push(0)}
            }

            if(payloadDeathCounts[age] == undefined) {
                payloadDeathCounts[age] = [death];
                // if(age == 81 && _payload[i+1][6] != 99 && _payload[i+1] != undefined) {payloadDeathCounts[99].push(0)}
            } else {
                payloadDeathCounts[age].push(death);
                // if(age == 81 && _payload[i+1][6] != 99 && _payload[i+1] != undefined) {payloadDeathCounts[99].push(0)}
            }
        }

        const true_labels = Object.keys(_labels);

        var construct_count = {
            labels: true_labels,
            datasets: [
                {
                    data: payloadTotalCounts[00],
                    label: '0-10',
                    borderColor: "#3e95cd",
                    fill: false
                },
                {
                    data: payloadTotalCounts[11],
                    label: '11-20',
                    borderColor: "#8e5ea2",
                    fill: false
                },
                {
                    data: payloadTotalCounts[21],
                    label: '21-30',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadTotalCounts[31],
                    label: '31-40',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadTotalCounts[41],
                    label: '41-50',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadTotalCounts[51],
                    label: '51-60',
                    borderColor: "#e8c3b9",
                    fill: false
                },
                {
                    data: payloadTotalCounts[61],
                    label: '61-70',
                    borderColor: "#c45850",
                    fill: false
                },
                {
                    data: payloadTotalCounts[71],
                    label: '71-80',
                    borderColor: "#c45850",
                    fill: false
                },
                {
                    data: payloadTotalCounts[81],
                    label: '81 or older',
                    borderColor: "#c45850",
                    fill: false
                },
                {
                    data: payloadTotalCounts[99],
                    label: 'Unknown',
                    borderColor: "#c45850",
                    fill: false
                }
            ],
            options: {
                title: {
                    display: true,
                    text: 'Tennessee COVID-19 Infection Count by Age'
                }
            }
        }

        var construct_count_death = {
            labels: true_labels,
            datasets: [
                {
                    data: payloadDeathCounts[00],
                    label: '0-10',
                    borderColor: "#3e95cd",
                    fill: false
                },
                {
                    data: payloadDeathCounts[11],
                    label: '11-20',
                    borderColor: "#8e5ea2",
                    fill: false
                },
                {
                    data: payloadDeathCounts[21],
                    label: '21-30',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadDeathCounts[31],
                    label: '31-40',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadDeathCounts[41],
                    label: '41-50',
                    borderColor: "#3cba9f",
                    fill: false
                },
                {
                    data: payloadDeathCounts[51],
                    label: '51-60',
                    borderColor: "#e8c3b9",
                    fill: false
                },
                {
                    data: payloadDeathCounts[61],
                    label: '61-70',
                    borderColor: "#c45850",
                    fill: false
                },
                {
                    data: payloadDeathCounts[71],
                    label: '71-80',
                    borderColor: "#c45850",
                    fill: false
                },
                {
                    data: payloadDeathCounts[81],
                    label: '81 or older',
                    borderColor: "#c45850",
                    fill: false
                }, 
                {
                    data: payloadDeathCounts[99],
                    label: 'Unknown',
                    borderColor: "#c45850",
                    fill: false
                }
            ],
            options: {
                title: {
                    display: true,
                    text: 'Tennessee COVID-19 Death Count by Age'
                }
            }
        }

        const doc = stateCollection.doc('stats');
        doc.get().then((_doc) => {
            if(_doc.exists) {
                // update:
                if(_payload != undefined) {
                    doc.update({'age_data': construct_count, 'age_death_data': construct_count_death});
                } else {
                    doc.update({'age_data': null, 'age_death_data': null});
                }
            } else {
                // force set instead:
                if(_payload != undefined) {
                    doc.set({'age_data': construct_count, 'age_death_data': construct_count_death});
                } else {
                    doc.set({'age_data': null, 'age_death_data': null});
                }
            }
        });
    });
}

function generateCaseHistoryStruct() {
    // Apply data to firestore documents:
    var countyCollection = firestore.collection('county');

    countyList.forEach(county => {
        // Reference county code and call up RDS:
        const countyID = county[1];
        const data = grabRDSData('tn_doh', 'us_tn_doh_county', query={
            'collimit': 25,
            'coloffset': 0,
            'count': true,
            'offset': 0,
            'limit': 200,
            'where': '(us_county_fips='+countyID+')'
        });

        data.then(
            (rdsData) => {
                const _rds = rdsData.records;
                var _labels = {};
                var _total_cases = [];
                var _new_cases = [];
                var _total_confirmed = [];
                var _tested = [];
                var _tested_new = [];
                var _total_active = [];
                var _new_active = [];
                var _total_death = [];
                var _new_death = [];

                _rds.forEach(rds => {
                    const date = rds[0];
                    var total_cases =  rds[3];
                    if(total_cases == null) {total_cases = 0;}
                    var new_cases = rds[4];
                    if(new_cases == null) {new_cases = 0;}
                    var total_confirmed = rds[5];
                    if(total_confirmed == null) {total_confirmed = 0;}
                    var tested = rds[19];
                    if(tested == null) {tested = 0;}
                    var tested_new = rds[20];
                    if(tested_new == null) {tested_new = 0;}
                    var total_active= rds[9];
                    if(total_active == null) {total_active = 0;}
                    var new_active = rds[11];
                    if(new_active == null) {new_active = 0;}
                    var total_death = rds[13];
                    if(total_death == null) {total_death = 0;}
                    var new_death = rds[14];
                    if(new_death == null) {new_death = 0;}
                    
                    if(_labels[date] == undefined) {
                        _labels[date] = -1;
                    }
                    _total_cases.push(total_cases);
                    _new_cases.push(new_cases);
                    _total_confirmed.push(total_confirmed);
                    _tested.push(tested);
                    _tested_new.push(tested_new);
                    _total_active.push(total_active);
                    _new_active.push(new_active);
                    _total_death.push(total_death);
                    _new_death.push(new_death);
                });

                const new_label = Object.keys(_labels);

                const doc = countyCollection.doc(county[0].toLowerCase());
                doc.get().then((_doc) => {
                    if(_doc.exists) {
                        // update:
                        doc.update({
                            'date_labels': new_label,
                            'total_cases': _total_cases,
                            'new_cases': _new_cases,
                            'total_confirmed': _total_confirmed,
                            'tested': _tested,
                            'tested_new': _tested_new,
                            'total_active': _total_active,
                            'new_active': _new_active,
                            'total_death': _total_death,
                            'new_death': _new_death
                        });
                    } else {
                        // force set instead:
                        doc.set({
                            'date_labels': new_label,
                            'total_cases': _total_cases,
                            'new_cases': _new_cases,
                            'total_confirmed': _total_confirmed,
                            'tested': _tested,
                            'tested_new': _tested_new,
                            'total_active': _total_active,
                            'new_active': _new_active,
                            'total_death': _total_death,
                            'new_death': _new_death
                        });
                    }
                });
            }
        )
    });
}

function initialize() {
    //generateMobilityStruct();
    //generateTNRaceStruct();
    //generateTNAgeStruct();
    generateCaseHistoryStruct();
}

app.listen(8080, function() {
    console.log('Express server is running on port 8080...');
    initialize();
});