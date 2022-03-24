var net = require('net');
var port = process.argv[3] || 2222;
var host = process.argv[2] || 'localhost';

const express = require('express');
const app = express();
const port1 = 3000;

function txrx(mensaje) {
    return new Promise((resolve, reject) => {
        const clients = net.connect({port, host}, () => {
            console.log('Connected to server!');
            console.log('Data sent to server: ' + mensaje);
            clients.write(mensaje);
        });
          
        clients.on('data', (data) => {
            console.log('Data receive from server: ' + data);
            if (data == 'Timed out!') {
                reject(data);
            }

            resolve(data);
            clients.end();
        });

        clients.on('error',function(error){
            console.log(error);
            reject(error);
        });
    
        clients.on('end', () => {
            console.log('Disconnected from server');
        });
    });
}
  
app.get('/:req_id', async (req, res) => {
    const start = Date.now();

    const data = await txrx(`Client.req_${req.params.req_id} -> ${Date.now().toString()} -> Server`)
        .catch((err) => res.status(500).send({'error': err.toString()})
    );
    const end = Date.now();
    res.status(200).send({'data': data.toString(), 'time': (end-start)})
})

app.listen(port1, () => {
  console.log(`Listening at http://localhost:${port1}`);
}) 

