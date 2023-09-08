// server  npm start

const sql= require('mssql/msnodesqlv8');
var express= require('express');
var app =  express();         // instancirao je app.        // isto je i server nekako uve u život; 
const bodyParser= require('body-parser'); // to               nije baaš unutar responsa, to je više req.body.json 
const cors=require("cors");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const corsOptions ={
   origin:'*', 
   credentials:true,            
   optionSuccessStatus:200,
}                                                                       // imamo metode odgovora ali ne i metode zahtjeva ? 
                                 



const hostname= '127.0.0.1'; 
const port =  5000; 
//nema nigdi createServer



var config={    // ne koristimo user i pass
    database:'Ozon'  , 
    server: 'DESKTOP-NCKUIN5\\SQLEXPRESS',       // double -obrnuti slash \\
    driver: 'msnodesqlv8', 
    options:{
            trustedConnection:true    //š

    }
}; 


app.use(bodyParser.json()); 
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    res.send("Hello World!");
  }); 

 app.get("/prikaz", (req,res) =>{
  
sql.connect(config,function(err){      
 if(err)console.log(err);

 var request= new sql.Request();

request.query('SELECT * from ozon ',function(err,recordSet){

if(err) console.log(err);
return res.send(recordSet);         // u nizu je drugi niz KAKOO SE TO DOGODILO 
     
})  // QUERY KRAJ!     ---> nije greška u ovom 
 
  
                                      
})
 });

 //ne bi da se meni ode stoji 
/*-------------------------------------------------------------------------------------------------------  */
 app.get("/prikaz/:q", urlencodedParser, (req,res)=>{
    sql.connect(config,function(err){    
        if(err)console.log(err);
      let request= new sql.Request(); 
  
         
                console.log('To je u termu ušli smo u ovu funkciju');
                console.log(req.params.q);
      request.query(`SELECT * from ozone WHERE year = '${req.params.q}' `,function(err,recordSet){
  
        if(err) res.json(err);
        return res.send(JSON.stringify(recordSet));       
    })                
  
  })

}); 

 /*-------------------------------------------------------------------------------------------------------------*/
app.listen(port,()=>{console.log( `Server se pokrenuo i radi na http://${hostname}:${port}/`)})


