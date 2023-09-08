





var express= require('express');
var app =  express();
const http = require("http"); // sa require radiii
const url = require("url");
const ws = require("ws");
const cors= require("cors");

//const mssql= require("mssql/msnodesqlv8");
// ok axios se ne stavlja na serveru ...
const bodyParser = require("body-parser");

const server = http.createServer();                           // ovo je isto napravljeno na serveru -> triba nam i obični valjda

const wss1 = new ws.WebSocketServer({ noServer: true });
const wss2 = new ws.WebSocketServer({ noServer: true });

//  its not necessary   ~it is necessary
const korisnici = new Set(); // its necessary za kasnije

const hostname = "127.0.0.1";
const port = 5000;

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
}; //

var config = {
  database: "Ozon", // kad sam ovo napisala jbt
  server: "DESKTOP-NCKUIN5SQLEXPRESS",
  driver: "msnodesqlv8",
  options: {
    trustedConnection: true,
  },
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/prikaz", (req, res) => {
  sql.connect(config, function (err) {
    if (err) console.log(err);
    let request = new sql.Request();

    request.query("SELECT * from ozon ", function (err, recordSet) {
      if (err) res.json(err);
      return res.send(recordSet); 
    }); 
   
  });
});

/* za prvu  konekciju --putanju -- /request  

*/
wss1.on("connection", function connection(socket) {                     // omg     - on je sam sebi napravia event 
                                                                        //event servera  , ne socketa - što se događa kad se ostvari konekcija
  console.log("ws server 1-- Korisnik na računalu se spojio ");
  const socketObjekt = {
    socket: socket, 
    connectioDate: Date.now(), 
  };


  console.log("Adding to set");
  korisnici.add(socketObjekt);
});

/* za drugu konekciju    /sendSensorData  path
 mjesto gdje dobivamo očitanja sa senzora   od ESP8266
 Po primitku očitanja , broadcastaju se svim listenerima klijenata ? */

wss2.on("connection", function connection(ws) {
  

  console.log("Ws server br.2- web socket konekcija sa ESP8266  ");
  ws.on("message", function message(data) {
    
    const now = Date.now(); 

    const dataJSObjekt = JSON.parse(data);                                      //  nema axiosa da parsira JSON u Javascript odma
    let message = { date: now, sensorData: dataJSObjekt.value };                // kako znam da dolazi u tom obliku
    const jsonMessage = JSON.stringify(message);                                // nazvali smo sensorData
    sendMessage(jsonMessage);
  });
});

/* mjesto na kojem kreiramo dvi putanje */

// on funkcija za regularni server
server.on("upgrade", function upgrade(request, socket, head) {               //  ovo je http server! ?
 
    const { pathname } = url.parse(request.url);                             // ovaj gore request
        console.log(`Path name ${pathname}`);

  if (pathname === "/klijentApp") {                                          /*idemo na ws server 1*/
   
         wss1.handleUpgrade(request, socket, head, function done(ws) {      // done(ws) ?

        wss1.emit("connection", ws, request);                              //emitiramo event      KOMEEE???
    });

  } else if (pathname === "/dataSaSenzora") {

    wss2.handleUpgrade(request, socket, head, function done(ws) {

     wss2.emit("connection", ws, request); 

    });
  } else {

    socket.destroy();

  }
});

server.listen(5000);

const sendMessage = (message) => {
  for (const korisnik of korisnici) {          // član iz onih memoriranih socketa - njemu se šalje 
    korisnik.socket.send(message);            //  na tu istu konekciju
  }                                              // pošlji bilo što test
            //ako je šalje server - ide prema klijentu
};

 







