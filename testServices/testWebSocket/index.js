const { Server } = require('ws');
 
const sockserver = new Server({ port: 8000});
const connections = new Set();
sockserver.on('connection', (ws) => {
   console.log('New client connected!');
   connections.add(ws)
   ws.on('message', (data) => {
       const message = JSON.parse(data);
       connections.forEach((client) => {
           client.send(JSON.stringify(message));
       })
   });
 
   ws.on('close', () => {
       connections.delete(ws);
       console.log('Client has disconnected!');
   });
});
