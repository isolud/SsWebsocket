# SsWebsocket
ES7+ Javascript Websocket lib with messages queue and chainable events


### Usage

```
import {SsWebsocket} from './path/to/SsWebsocket/src/SsWebsocket.js';
SsWebsocket(ip,port,routeKey,dataKey)
```

##### Instanciate using default values :
```
var sock = new SsWebsocket();
```
##### Default parameters : 
```
ip = '127.0.0.1'
port = 4242
routeKey = 'route'
dataKey = 'data'
secure = false // false = ws://, true = wss://
```
##### Instanciate with custom values :
```
var sock = new SsWebsocket('domain.com',8080,'myRouteKey','myDataKey',true);
```

##### Catching Events :

```
sock.on('youreventname',(data)=>{//do something;console.log(data);});
```
##### Reserved Events :
```
 // Returned when websocket connection is ready
 sock.on('wsOpen')
  
 // Returned when websocket connection is in pending state
 sock.on('wsPending')
  
 // Returned when websocket connection is in closed state
 sock.on('wsClose')
  
 //Returned when websocket connection is in error state
 sock.on('wsError')
```
##### Sending data to websocket server :

```
sock.send('path/to/route',{"key":"value"});
```

##### Chaining :

```
  sock.send('path/to/route',{"key":"value"})
  .on('eventName',(data)=>{//do something})
  .on('eventName',(data)=>{//do something})
  ;

```
### Note

Messages sent while websocket is not ready yet are queued, which means you don't need to wait for websocket to be ready, data sent while websocket is in pending state will be sent once 
the websocket will be in open state.


