var express = require('express');
var router = express.Router();
var sensor = require('node-dht-sensor');

/* GET home page. */
router.get('/', function(req, res, next) {
	sensor.read(22, 4, function(err, temperature, humidity) {
        if (!err) {
            console.log('temp: ' + temperature.toFixed(1) + '°C, ' + 'humidity: ' + humidity.toFixed(1) + '%');
            res.render('index',  { title: 'Sweet Home', temp: temperature.toFixed(1), hum: humidity.toFixed(1) });
        }
        else {
            console.log(err);
	    err = {status:"500", stack:"", message:err};
	    next(err);
        }
    });
});

module.exports = router;
