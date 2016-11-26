const http = require('http')  
const port = 3000;

// SUBSCRIPTION TOPICS
const DEVICE_ACTIVITY = "onoff";


/////// DEVICE STATE AND PATIENT ID /////
var PATIENT_ID = "null";
var DEVICE_CURRENT_STATE = false;
var PATIENT = "";
/////////////////////////////////////////


var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.8.102');



const requestHandler = (request, response) => {  
  console.log(request.url)
  response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
  console.log(client.options.clientId);
  PATIENT = client.options.clientId;
});
//////// SERVER CONNECTION END ////////////////




/////// Publish data to server start ////////////
client.publish('mqtt__topic', "some good mqtt message ",{qos: 0 , retain: false   }, function () {
  console.log('GOT CB_MQTT');
} )
/////// Publish data to server end /////////////


////// Start loop for data send to server /////////
var a = 0
setInterval(function () {
 if (DEVICE_CURRENT_STATE){
  client.publish('mqtt_loop', "{'temp':'23','humd':'72','pulse':'542', 'p_id':'"+PATIENT_ID+"'}" ,{qos:0, retain: false}, ()=> console.log('loop 200' + a) )
a++; 
}
} , 1000);
////// End Loop for data send to server //////////






/////// Subscribe for msg topic START ///////////////
client.subscribe(PATIENT); 
client.subscribe(DEVICE_ACTIVITY); 

client.on('message', function (topic, message) {
  // message is Buffer
  switch(topic.toString()){
    case DEVICE_ACTIVITY:
      
      console.log("Server Message for Device activity is : "+message.toString());    
      DEVICE_CURRENT_STATE = message.toString()=="true";
      console.log("Device current state is : "+DEVICE_CURRENT_STATE);
     
    break;
    case PATIENT:
      console.log("Server Message for Patient ID is : "+message.toString());
      PATIENT_ID = message.toString();
    break;

    default:
      console.log("Topic with no action : "+topic.toString());
    break;
  }
  // client.end(); //  if no more activity required
});
/////// Subscribe for msg topic END ///////////////


