[![](https://nodei.co/npm/console-debug.png?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/console-debug)   
[![](https://david-dm.org/michaeldegroot/console-debug.svg "deps") ](https://david-dm.org/michaeldegroot/console-debug "david-dm")
[![](https://travis-ci.org/michaeldegroot/console-debug.svg?branch=master "testing") ](https://travis-ci.org/michaeldegroot/console-debug "travis-ci")
[![](https://coveralls.io/repos/michaeldegroot/console-debug/badge.svg?branch=master&service=github)](https://coveralls.io/github/michaeldegroot/console-debug?branch=master)
![](https://img.shields.io/badge/Node-%3E%3D4.0-green.svg)
![](https://img.shields.io/npm/dt/console-debug.svg)
![](https://img.shields.io/npm/l/console-debug.svg)


___
# What it does
Replaces your console object with a more stylish and practical way of displaying notices,warn,info,debug,log and errors.  
It automagically shows you the line number and filename where the command was executed, along with a timestamp.  
There is also the ability to catch uncaughtExceptions, disable the output colors, and log to file.  
You can also setup filters if you want to hide certain debug message types.  

![DEMO](http://i.imgur.com/fEVquh4.gif)
___
# Changelog
[https://github.com/michaeldegroot/console-debug/commits/master](https://github.com/michaeldegroot/console-debug/commits/master)
___
#  Getting Started

##### 1. Start by installing the package:
    npm install console-debug

##### 2. Load the code
```js
var Debug = require('console-debug')

var console = new Debug({
	uncaughtExceptionCatch: false,                   // Do we want to catch uncaughtExceptions?
	consoleFilter:          ['LOG', 'WARN'],         // Filter these console output types
	logToFile:              true,                    // if true, will put console output in a log file folder called 'logs'
	logFilter:              ['LOG','DEBUG','INFO'],  // Examples: Filter these types to not log to file
	colors:                 true                     // do we want pretty pony colors in our console output?
})
````




##### 3. Do awesome stuff!
```js
console.log("I am a log!")
console.warn("I am a warn!")
console.error("I am a error!")
console.debug("I am a debug!")
console.info("I am a info!")

// can also display objects
obj = {
	test1: [1,2,3,4],
	test3: ["ohai","there"],
	test4: true
}
console.log(obj)
````
___
# Contact
You can contact me at specamps@gmail.com
