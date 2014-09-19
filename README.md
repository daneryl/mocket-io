Mocket.IO
=========
A partial mock of Socket.IO for use with Incubator projects

##Usage

    var io = require("mocket-io").io;

    var socket = io.connect();
    var handler = sinon.spy();
    socket.on("event", handler);
    socket.emit("event", "message");

    expect(handler.called).to.be.true;

###Rooms

    var handler = sinon.spy();
    socket.on("roomEvent", handler);
    socket.join("room A");
    socketB.to("room A").emit("roomEvent", "message");
    
    expect(handler.called).to.be.true;