# console-server
Inpired on the great 'debug' module and derived from 'console-debug' module. This logging module was created to simplify logging by employing good features with no configuration needed.

## Features

```
const logger = require('console-server');
logger.info('test one!');
```

* Use .debug(), .info(), .warn() and .error() for passing contents to be logged
* Formatters and raw objects can be used, just like with the default 'console'
 
```
logger.info('using', {name:'stutz'})
//using {name: 'stutz'}
```

 ```
 logger.debug('%s is its name', 'cariota')
 //cariota is its name
 ```

* You can pass objects as log arguments

 ```
 let obj = {title:'chief'};
 logger.debug(obj)
 //{title:'chief'} 
 ```

* Colors are enabled by default if process is open on a terminal (tty) and disabled otherwise. To force colors enabled/disabled, set environment property ```LOGGER_USE_COLORS='false'```

* Log level is 'DEBUG' by default. To force log level, set environment property ```LOGGER_LEVEL``` to the desired log level. 
 * ```LOGGER_LEVEL=info``` (enables info, warn and error) or  
 * ```LOGGER_LEVEL=warn``` (enables only warn and error)

## Usage examples
```
const console = require('console-server');

console.debug('oh, my');

console.info('just some information from our fellows...');

console.warn('there is a clif just a few steps fr...');

console.error('we couldn\'t advise that poor guy along the clif in time...');
```

Output:

![demo1](demo1.png "Demo output")