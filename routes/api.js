var express = require('express');
var router = express.Router();
var sensor = require('node-dht-sensor');

/* GET home page. */
router.get('/data', function(req, res, next) {
	sensor.read(22, 4, function(err, temperature, humidity) {
        if (!err) {
            console.log('temp: ' + temperature.toFixed(1) + '°C, ' + 'humidity: ' + humidity.toFixed(1) + '%');
            res.json({ temp: temperature.toFixed(1), hum: humidity.toFixed(1), time: new Date().toLocaleString() });
        }
        else {
            console.log(err);
	    res.json({status:"500", message:err});
        }
    });
});

module.exports = router;
