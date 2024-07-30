import { io } from "../app";


io.on('connection' , (socket)=>{
    console.log(socket.id);
    socket.on('custom-event', (arg1, arg2, arg3)=>{
        console.log(arg1, arg2 ,arg3) })
    // socket.on('send-message',customMessage=>{
    //     socket.broadcast.emit("reciive-message" , message) ;
    // })  this is used to send the emssage to everyone expcet the one how send it out

    //to emmit a message to one persone use the socket.to(the id of the socket to which you wanna send)
    //in ordre to send the message to a group of people frist send a message to the serve so he can join u in a rromm by the socket.emit("customevent" , value)
    //then catch it in the backend using socket.on and the do socket.join(room) and now if u emmit something to that room every one that is in that room will receive the message each room is identified by its id
    //also emit can accept another argument which is a callback function that is called by the backend and defined in the client and that s very good and it should be past as the last argument

    //So to access the websockets in thee admin panel add the url of your server which isthe localhost without anyroutes.
    socket.on('disconnect', ()=>{
        console.log('user disconnected');
    }) ;

    //a namescpace in sockets is basically a division of how your sockets are being processed by the backend it can devide ur app into different parts each part can have its one middlwares rooms and and event handlers.
    //and to use namespaces it is very ez to do you need just to add / and the name space to connect to that name space , to create one use io.of("/namespace ").
    //to use middlware in socket io  you can simply use them allvalues are stored in socket , and to access them use socket.handshake.auth.token  and to add to them add values to the io("url/namespace" ,{ auth : {token  : "test"}})

    //Namespace Definition: Namespaces are defined first using io.of('<namespace>') to create a namespace object.

    // Middleware Registration: Middleware functions (use methods) are registered next. These middleware functions intercept incoming events and can perform tasks like authentication, logging, or data modification before passing control to the event handlers (on methods).

    // Event Handlers (on Methods): Event handlers (on methods) are defined last. These handlers specify how to respond to specific events emitted by clients or other parts of your application.

    //if you aare disconnecting from ur socket socket.io will store all your message and the time u connect the messages will be seneded to remove this behavior you can use socket.volatile.emit so socket will forget about all our message.
}) 
