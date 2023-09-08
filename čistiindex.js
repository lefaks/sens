const url = require("url");
const ws = require("ws");
/*-----------------------------------------------------------------------------------------------------*/
const wss1 = new ws.WebSocketServer({ noServer: true });
const wss2 = new ws.WebSocketServer({ noServer: true });

const korisnici = new Set();


wss1.on("connection", function connection(socket) {     
    
console.log("web socket server 1::Korisnik se spojio ");
const useRef = {
socket: socket, 
connectioDate: Date.now(), 
};


console.log("Adding to set");
korisnici.add(useRef);
});

/* za drugu konekciju */

wss2.on("connection", function connection(ws) {


console.log("Web socket server br. 2:: web socket konekcija");
ws.on("message", function message(data) {
//to tako funkcionira   
const now = Date.now(); 

const dataJSO = JSON.parse(data); //  nema axiosa da parsira JSON u Javascript odma
let message = { date: now, sensorData: dataJSO.value };
const jsonMessage = JSON.stringify(message);
sendMessage(jsonMessage);
});
});

/* mjesto prepoznavanja putanja */ 

server.on("upgrade", function upgrade(request, socket, head) {             

const { pathname } = url.parse(request.url);                   
console.log(`Path name ${pathname}`);

if (pathname === "/request") {                              /*idemo na ws server 1*/

wss1.handleUpgrade(request, socket, head, function done(ws) {  

wss1.emit("connection", ws, request); 
});

} else if (pathname === "/sendSensorData") {

wss2.handleUpgrade(request, socket, head, function done(ws) {

wss2.emit("connection", ws, request); 

});
} else {

socket.destroy();

}
});

server.listen(5000);

const sendMessage = (message) => {
for (const korisnik of korisnici) {
korisnik.socket.send(message);        
}

};

/******************************************************************************************************************* */