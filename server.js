const http = require('http')  
const port = 3000;

var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.8.102');

const requestHandler = (request, response) => {  
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

client.publish('mqtt__topic', "some good mqtt message ",{qos: 0 , retain: false   }, ()=> console.log('GOT CB_MQTT'))
var a = 0
setInterval(() => client.publish('mqtt_loop', "count "+ a++ ,{qos:0, retain: false}, ()=> console.log('loop 200' + a) ), 100);
server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})