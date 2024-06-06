// global variable declaration
let subscribe_list = [];
let client = null;
let is_connected = false;
let data = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
let data_old = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

//make the client
function makeClient(){
    if(client == null){
        startConnect();
    };
    
}

//set subscriptions from outside
function setSub(list){
    subscribe_list = list; 
}

//connect to broker
function startConnect(){
    clientID = 'negawatt-'+Date.now().toString();
    host = "broker.hivemq.com"  
    port = 8000; 
    userId  = '';  
    passwordId = '';  

    console.log("Connecting to " + host + " on port " +port);
    console.log("Using the client Id " + clientID)
 
    client = new Paho.Client(host, port, clientID);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        onSuccess: onConnect,
        userName: userId,
        cleanSession: true
    });
}

//when connected
function onConnect(){
    console.log("Connected");
    is_connected = true;
    subscribe_list.forEach(fun);

    function fun(value){
        client.subscribe(value);
        console.log(value);
    };
}

//when error
function onConnectionLost(responseObject){
    if(responseObject !=0){
        console.log(responseObject.errorMessage);
    }
}

//when msg arrived
function onMessageArrived(message){
    let topic = message.destinationName;
    let msg = message.payloadString;
    topic = topic.split('/');

    index1 = parseInt(topic[1]);
    index2 = parseInt(topic[2]);

    data[index1][index2] = msg;
}

//send message to a topic
function send_msg(topic, msg){
    if(is_connected){
        let final_msg = msg.toString();
        let message = new Paho.Message(final_msg);
        message.destinationName = topic;
        message.qos = 0;
        message.retained = false;
        client.send(message);
        console.log('sent '+msg+' to '+topic);
    };
}


function get_msg(tpc, dupli, oldval){
    let topic = tpc.split('/');
    index1 = parseInt(topic[1]);
    index2 = parseInt(topic[2]);

    let final = data[index1][index2];

    if(final != undefined){
        compare = final.toString();
        
        if(compare != data_old[index1][index2] || dupli == true){
            console.log('got msg'+final+' from '+tpc);
            data_old[index1][index2] = compare;
            return final;
        }else{
            return oldval;
        };

    }else{
            return oldval;
    };

}

function get_is_connected(){
    return is_connected;
}