# Sky Color Generator

For those who is mimicking color changes within a day, this module does the calculation for you :wink:

You could set color for certain time points, and get back a color with any given time in a day.

### Usage


##### initianize the color generator

```js
var skyColor = new SkyColor()
skyColor.init(h * 60 + m)
```

##### set color for time you want
```js
//first parameter is time, it could be how many minutes in a day or a ISO 8601 format time
//second parameter is color, sorry it only supports an array of rgba color now

//set a blue-ish color for 7am in the morning
skyColor.set(420, [96, 168, 232, 0.5]);

//be careful 0am should have the same color as 24pm
skyColor.set(0, [160, 222, 255, 1]);
skyColor.set(1440, [160, 222, 255, 1]);
```

##### query color with given time
```js
//get back a rgba color string with a given time
//put this in an animation loop and you will get nice gradient effect :)
color = skyColor.get(h * 60 + m)
```

##### start a new day!
```js
//when a new day comes, please reset the color generator
skyColor.startDay()
```

##### check out the example if this still doesn't make sense

:sunglasses:
