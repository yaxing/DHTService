var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var schedule = require('node-schedule');
var Mqtt = require('mqtt');
var sensor = require('node-dht-sensor');
var dateFormat = require('dateformat');

var api = require('./routes/api');
var stack = require('./routes/stack');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);
app.get('/', stack.home);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var mqttParam = {
    server: 'ssl://raspberry-pi.mqtt.iot.gz.baidubce.com:1884',
    options: {
        username: 'raspberry-pi/home',
        password: 'El1S/J7cT0Z6ciIzluOtQXcNHZSKzMsnJpjUP0Hilkc=',
        clientId: 'home-pi'
    },
    topic: 'r-pi-home/monitor-data'
};

var mqttClient = Mqtt.connect(mqttParam.server, mqttParam.options);
console.log('Connecting to broker: ' + mqttParam.server);

mqttClient.on('error', function(error) {
    console.error(error);
});

mqttClient.on('message', function(topic, data) {
    console.log('MQTT message received: ' + data);
    if (data.toString() === 'exit') process.exit();
});

mqttClient.on('connect', function() {
    console.log('Connected. Client id is: ' + mqttParam.options.clientId);
    mqttClient.subscribe(mqttParam.topic);
    console.log('Subscribed to topic: ' + mqttParam.topic)

    upload();
    var j = schedule.scheduleJob('* * * * *', function(){
        upload();
    });
});

module.exports = app;

function upload() {
    console.log("Reading Sensor and publishing data...");
    sensor.read(22, 4, function(err, temperature, humidity) {
        if (!err) {
            var json = JSON.stringify({ temp: temperature.toFixed(1), hum: humidity.toFixed(1) });
            mqttClient.publish(mqttParam.topic, json);
            console.log("Published data: " + json);
        }
        else {
            console.log(err);
        }
    });
}
