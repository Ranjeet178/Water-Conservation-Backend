var express = require('express');
var app = express();  // Variable to get the Req and Res.
var cors = require('cors');
var bodyParser=require('body-parser'); 
var mongoose =require('mongoose');
var jwt = require('jwt-simple');

const port = 3000;
var User = require('./models/user.js');
var posts = [
    {message: 'Hi Parthiban'},
    {greetings: 'How are you'}
]


app.use(cors());

app.use(bodyParser.json());


app.get('/posts', (req,res) =>{
    res.send(posts);  
    
});


//Display Users from Backend

app.get('/users', async(req, res) =>{
    try{
        let users = await User.find({}, '-password -__v');
        res.send(users);
         }
         catch (error){
             console.log(error);
             res.sendStatus(200);
         }
})
app.get('/profile/:id', async(req,res)=> {
    try{
    let user= await User.findById(req.params.id,'-password -__v')
    res.send(user);
    }catch(error){
console.log(error);
res.sendStatus(500);
    }
})

app.get('/donut/:id', async(req,res)=> {
    try{
    //console.log(req);
    //var iotreading = mongoose.model("iotreading", new Schema({}), "iotreadings");
    var consumption = conn.collection('iotreadings').aggregate([
            {$match: {"_id": req.params.id, "MSG_TIMESTAMP": {"$gte": new Date("2019-10-01 00:00"),"$lt": new Date("2019-10-05 00:15")}}},
            {$group: {"_id": {
                "APARTMENT_NAME": "$APARTMENT_NAME",
                "FLAT_NO": "$FLAT_NO"
            }, Consumption: { $sum: "$WATER_CON_VOL" } } }, {$project: { _id:0, Consumption: 1}}
            ]);
    
    //var user = mongoose.model("user", new Schema({}), "users");
    var threshold = conn.collection('users').aggregate([
            {$match : {"_id": req.params.id}},
            {$lookup: {
                from: "thresholds",
                localField:"APARTMENT_NAME",
                    foreignField:"APARTMENT_NAME",
                as: "threshold"}},
            { $unwind: "$threshold" },
            { $project : {_id:0, "final_threshold":
                     { $multiply: [ "$OCCUPANTS", "$threshold.PER_HEAD_THRESHOLD" ] }}}
            ]);
    console.dir(consumption);
    console.log(threshold.final_threshold);
    //let user = consumption; //JSON.parse((JSON.stringify(consumption) + JSON.stringify(threshold)).replace(/}{/g,","))
    //console.log(user);
    //res.send(user);
    }catch(error){
console.log(error);
res.sendStatus(500);
    }
})

app.post('/register', (req,res) =>{
       let userData = req.body;
        console.log(userData);

    let user = new User(userData);
    user.save((err,result) =>{
        if(err){
            console.log('There is trouble adding User Parthi.');
        }else{
            res.sendStatus(200);
        }
    })

});

//Token - End Point

app.post('/login', async(req,res) =>{
    let userData = req.body;
    let user = await User.findOne({email:userData.email});
    if (!user){
        return res.status(401).send({message: 'Email or Password invalid'})
    }
    if(userData.password !=user.password){
        return res.status(401).send({message: 'Password is invalid'})
    }
    let payload = {"id": user.email}
    let token = jwt.encode(payload, '23456')
    res.send(user);
    //res.status(200).send({payload});
});



//mongoose.connect('mongodb://Nodeuser:Nodeuser@mongodb-iot-ocp.apps02-london.amosdemo.io/IoT', { useNewUrlParser: true, useUnifiedTopology: true },(err) =>{
mongoose.connect('mongodb://localhost:27017/iot',(err) =>{
if(!err){
   console.log('Connected to Database');
}    else
    console.log("Failed");
});
var conn = mongoose.connection;

app.listen(port);