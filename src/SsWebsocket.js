/**
 * @Author : Simon Stien
 * @Website : http://www.isolud.com
 */

var SsWebsocket = function (ip = '127.0.0.1',port = 4242,routeKey = 'route',dataKey = 'data')
{

    this.ip = ip;
    this.port = port;
    this.routeKey = routeKey;
    this.dataKey = dataKey;
    this.isAlive = false;
    this.queue = [];

    /* return self */
    this.on = function(eventName,callback)
    {
        callbacks[eventName] = callbacks[eventName] || [];
        callbacks[eventName].push(callback);
        return this;
    };

    var callbacks = {};
    var wsEvents = {
        "OPEN":"wsOpen",
        "CLOSE":"wsClose",
        "PENDING":"wsPending",
        "ERROR":"wsError"
    };

    var dispatch = function(eventName, message){
        //Chain of commands
        var chain = callbacks[eventName];
        if(typeof chain !== 'undefined' && chain.length>0) {
            chain.forEach((item)=>
            {
                item(message);
            });
        }
    };


    var processQueue = ()=>
    {
        while (this.queue.length > 0) {
            var msg = this.queue.pop();
            this.send(msg.type,msg.data);
        }
    };


    this.connect = async ()=>
    {
        var ws;
        try {
            ws = await new WebSocket('ws://' + ip + ':' + port);
            return ws;
        }
        catch(e)
        {
            dispatch(wsEvents.ERROR,e);
        }
    };

    this.setHandler = ()=>
    {
        // Dispatching pending event on creation
        dispatch(wsEvents.PENDING,null);

        var wsTemp = this.connect();
        wsTemp.then((res)=>{

            this.handler = res;

            this.handler.onopen = ()=>
            {
                this.isAlive = true;
                processQueue();
                dispatch(wsEvents.OPEN,null);

            };

            this.handler.onmessage = (ev)=>
            {
                var json = JSON.parse(ev.data);
                dispatch(json[routeKey],json[dataKey]);
            };

            this.handler.onerror = (e)=>
            {
                dispatch(wsEvents.ERROR,e);
            };

            this.handler.onclose = ()=>
            {
                dispatch(wsEvents.CLOSE,null);
            };
        });


    };

    /* @return self */
    this.send = (route,data)=>
    {
        if(!this.isAlive)
        {
            this.setHandler();
            this.queue.push({"type": route,
            "data": data
            });
        }
        else
        {
            this.handler.send(JSON.stringify({
                "type": route,
                "data": data
            }));
        }

        return this; // Chainable
    };


};


export {SsWebsocket};