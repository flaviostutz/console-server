

# What it does

###### Replaces your console object with a more stylish and practical way of displaying notices,warn,info,debug,log and errors. It automagically shows you the line number and filename where the command was executed, along with a timestamp. There is also the ability to catch uncaughtExceptions, disable the output colors, and log to file. You can also setup filters if you want the console or log to file not showing a certain debug message type. ######


# How does it look?

    console.log("I am a log!");
    console.warn("I am a warn!");
    console.error("I am a error!");
    console.debug("I am a debug!");
    console.info("I am a info!");
![Example1](http://s15.postimg.org/cvkyicxzf/output.png)

    Idonotexists();
![Example2](http://s29.postimg.org/co4sovpk7/uncaught.png)


#  How do I use it?

## 1. Start by installing the package:
    npm install console-debug

## 2. Put this in your nodejs server file

    var Debug = require('console-debug');
    
    var console = new Debug({
		uncaughtExceptionCatch: false, // Do we want to catch uncaughtExceptions?
		filter: [], // Examples: 'LOG', 'WARN', 'ERROR', 'DEBUG', 'INFO'
		logToFile: true, // if true, will put console output in a log file folder called 'logs'
		colors: true // do we want pretty pony colors in our console output?
	}); 




	
## 3. Now you can do stuff like:

    console.log("I am a log!");
    console.warn("I am a warn!");
    console.error("I am a error!");
    console.debug("I am a debug!");
    console.info("I am a info!");
    console.log(obj); // can also display objects
	
	

# Contact
    You can contact me at specamps@gmail.com

	
