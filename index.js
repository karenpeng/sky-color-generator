'use strict'

var moment = require('moment')

function SkyColor(){
  this.steps = [
    {'time': 0, 'color': [0, 0, 0, 0.7]},
    {'time': 360, 'color': [0, 0, 0, 0.5]},
    {'time': 420, 'color': [0, 0, 0, 0]},
    {'time': 1020, 'color': [0, 0, 0, 0]},
    {'time': 1080, 'color': [0, 0, 0, 0.5]},
    {'time': 1440, 'color': [0, 0, 0, 0.7]},
  ];
  this.leftBound = 0;
  this.rightBound = 1;
}

/**
 * Set color for certain point of time
 * @param {Number | String} time  how many minutes in a day or a ISO 8601 format time
 * @param {[Array]} color  An array of r, g, b, a color value
 */
SkyColor.prototype.set = function(time, color){
  var minutes, c

  if(typeof time === 'number' && time >= 0 && time <= 1440){
    minutes = time
  }

  else if(typeof time === 'string'){
    try{
      minutes = moment(time).getHours() * 60 + moment(time).getMinutes()
    }catch(e){
      throw new Error('sky-color-generator: invalid time')
      return
    }
   
  }else{
    throw new Error('sky-color-generator: invalid time')
    return
  }

  if(Array.isArray(color)){
    c = color
  }else{
    throw new Error('sky-color-generator: sorry color only supports rgba array now :(')
    return
  }

  for(var i = 0; i < this.steps.length; i++){
    var _obj = this.steps[i];
    if(_obj['time'] === minutes){
      _obj['color'] = c;
      return;
    }
  }

  this.steps.push({'time': minutes, 'color': c})
  this.steps.sort(function(a, b){
    return a['time'] - b['time'];
  });
} 

/**
 * Get color with a given time
 * @param {Number | String} time  how many minutes in a day or a ISO 8601 format time
 * @return {[Array]} color  An array of r, g, b, a color value
 */
SkyColor.prototype.get = function(time){

  var minutes;

  if(typeof time === 'number' && time >= 0 && time <= 1440){
    minutes = time
  }

  else if(typeof time === 'string'){
    try{
      minutes = moment(time).getHours() * 60 + moment(time).getMinutes()
    }catch(e){
      throw new Error('sky-color-generator: invalid time')
      return
    }
   
  }else{
    throw new Error('sky-color-generator: invalid time')
    return
  }

  if(minutes > this.steps[this.rightBound]['time']){
    this.leftBound++;
    this.rightBound++;
  }
  if(this.leftBound === this.rightBound){
    return 'rgba('+this.steps[this.leftBound]['color'].join(',') + ')';
  }
  return interpolate(this.steps[this.leftBound], this.steps[this.rightBound], minutes);

}

/**
 * Initianize the color generator with a given time
 * @param  {Number | String} time  how many minutes in a day or a ISO 8601 format time
 */
SkyColor.prototype.init = function(minute){
  var _b = searchRange(0, this.steps.length-1, this.steps, minute);
  this.leftBound = _b[0];
  this.rightBound = _b[1];
}

/**
 * Reset color generator when a new day comes
 */
SkyColor.prototype.startDay = function(){
  this.leftBound = 0;
  this.rightBound = 1;
}



function interpolate(l, r, target){
  var amt = (target - l['time'])/(r['time'] - l['time']);

  var _r = lerp(l['color'][0], r['color'][0], amt).toFixed();
  var _g = lerp(l['color'][1], r['color'][1], amt).toFixed();
  var _b = lerp(l['color'][2], r['color'][2], amt).toFixed();
  var _a = lerp(l['color'][3], r['color'][3], amt).toFixed(4);
  return 'rgba(' + _r + ',' + _g + ',' + _b + ',' + _a + ')';
};

function lerp(start, stop, amt) {
  return start + amt * (stop - start);
};

function searchRange(_start, _end, arr, target){
  var leftBound, rightBound;
  var start = _start;
  var end = _end;

  // for(var i = 0; i < arr.length; i++){
  //   if(arr[i]['time'] === target) return [i, i]
  //   if(arr[i]['time'] > target){
  //     rightBound = i;
  //     break;
  //   }
  // }

  // for(var i = arr.length-1; i >= 0; i--){
  //   if(arr[i]['time'] === target) return [i, i]
  //   if(arr[i]['time'] < target){
  //     leftBound = i;
  //     break;
  //   }
  // }
  // return [leftBound, rightBound];

  while(start + 1 < end){
    var mid = Math.floor((start + end) / 2);
    var h = arr[mid]['time'];

    if(h === target) return [mid, mid];
    else if(h < target) start = mid;
    else end = mid - 1;
  }

  var h1 = arr[start]['time'];
  var h2 = arr[end]['time'];
  if(h1 === target) return [start, start];
  else if(h2 === target) return [end, end];
  else if(h2 < target) leftBound = end;
  else if(h1 < target) leftBound = start;
  else leftBound = start - 1;

  start = leftBound;
  end = _end;
  while(start + 1 < end){
    mid = Math.floor((start + end) / 2);
    h = arr[mid]['time'];

    if(h === target) return [mid, mid];
    else if(h > target) end = mid;
    else start = mid + 1;
  }
  var h1 = arr[start]['time'];
  var h2 = arr[end]['time'];
  if(h1 === target) return [start, start];
  else if(h2 === target) return [end, end];
  else if(h1 > target) rightBound = start;
  else if(h2 > target) rightBound = end;
  else rightBound = end + 1; 

  return [leftBound, rightBound];
}



module.exports = SkyColor;