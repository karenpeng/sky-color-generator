var moment = require('moment')
var fakeTime = moment("2015-11-01T00:00:00.000Z")

var SkyColor = require('./../index')
var skyColor = new SkyColor()

function init(){
  skyColor.set(0, [160, 222, 255, 1]);
  skyColor.set(360, [112, 189, 245, 1]);
  skyColor.set(420, [96, 168, 232, 0.5]);
  skyColor.set(1020, [96, 168, 232, 0.5]);
  skyColor.set(1080, [112, 189, 245, 1]);
  skyColor.set(1440, [160, 222, 255, 1]);

  var h = fakeTime.hours()
  var m = fakeTime.minutes()
  skyColor.init(h * 60 + m)
  var color = skyColor.get(h * 60 + m)
  console.log(color)
}

function loop(){
  fakeTime.add(1, 'minutes')
  var h = fakeTime.hours()
  var m = fakeTime.minutes()
  var minutes = h * 60 + m
  if(minutes == 0){
    skyColor.startDay()
  }
  var color = skyColor.get(h * 60 + m)
  console.log(color)
}


init()
setInterval(function(){
  loop()
})