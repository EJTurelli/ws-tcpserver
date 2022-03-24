/*
Basado en https://gist.github.com/sid24rane/2b10b8f4b2f814bd0851d861d3515a10 
*/
var net = require('net');
var port = process.argv[2] || 2222; 
var timeout = 30000;        
var delay = 1500;           // Tiempo que demorará el server en responder.
var maxConnections = 10;    // Cantidad máxima de conecciones concurrentes admitidas.

var server = net.createServer();

server.on('close',function(){
    console.log('Server closed !');
});

server.on('connection',function(socket){

    //var no_of_connections =  server.getConnections(); // sychronous version
    server.getConnections(function(error,count){
        console.log('Number of concurrent connections to the server : ' + count);
    });

    socket.setEncoding('utf8');

    socket.setTimeout(timeout,function(){
        console.log('Socket timed out');
    });

    socket.on('data',function(data){
        console.log('Data receive from client: ' + data);

        // Genero una demora para emular un funcionamiento en producción y generar conecciones concurrentes
        setTimeout(() => {
            // Invierto los componentes del mensaje y lo retorno
            const resp = data.toString().split(' ').reverse().join(' ');
            console.log('Data sent to client: ' + resp);
            var is_kernel_buffer_full = socket.write(resp);
            if(!is_kernel_buffer_full){
                socket.pause();
            }          
        }, delay);


    });

    socket.on('drain',function(){
        socket.resume();
    });

    socket.on('error',function(error){
        console.log('Error : ' + error);
    });

    socket.on('timeout',function(){
        console.log('Socket timed out !');
        socket.end('Timed out!');
    });

    socket.on('end',function(){
        console.log('Socket ended from other end!');
    });

    socket.on('close',function(error){
        console.log('Socket closed!');
        if(error){
            console.log('Socket was closed coz of transmission error');
        }
    }); 

});

server.on('error',function(error){
    console.log('Error: ' + error);
});

server.on('listening',function(){
    console.log(`Server is listening in port ${port}!`);
});

server.maxConnections = maxConnections;

server.listen(port);
