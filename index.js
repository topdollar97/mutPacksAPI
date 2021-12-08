const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Pack = require("./models/packs");
const User = require("./models/userpulls");
const dbUrl = process.env.DB_URL

const bodyParser = require("body-parser");

app.use(express.urlencoded({ extended: true }))
app.use(express.json());


mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://mutpacks.herokuapp.com"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/users", async (req,res) =>{
  const users = await User.find({});
  res.status(200).json(
    users
  )
})

app.get("/packs",async (req,res) =>{
  const packs = await Pack.find({});
  res.status(200).json(
    packs
  )
})

app.post("/newUser", async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', 'https://mutpacks.herokuapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  let user = await User.findOne({author: req.body.author})
  if(user === null){
    const newUser = new User(req.body);
    await newUser.save();
    user = await User.findOne({author: req.body.author});
  }
  

  res.status(200).json(user)
  
})

app.post("/newPack", async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', 'https://mutpacks.herokuapp.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed

  if (req.body.author ==="112657973511157148478"){
    const newPack = new Pack(req.body);
    await newPack.save();
    res.status(200).json(
      newPack
    )
  } else{
    res.status(200).json(
      "ERROR"
    )
  }
  
})

app.get("/packs/:id", async (req,res)=>{

  const pack = await Pack.findById(req.params.id);

  res.status(200).json(
    pack
  )
})

app.post("/packs/:id", async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin', `https://mutpacks.herokuapp.com`);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed


  const pack = await Pack.findById(req.params.id);
  let user = await User.findOne({author: req.body.author});
  if(user ===null){
    const newUser = new User(req.body.author);
    await newUser.save();
    user = await User.findOne({author: req.body.author});
  }

  const newPulls = req.body;
  for (let ovr in newPulls){
    if(ovr !== "author"){
      if(pack.pulls[ovr]){
        pack.pulls[ovr] += newPulls[ovr]
      } else{
        pack.pulls[ovr] = newPulls[ovr]
      }
      if(!user.userPulls[pack.title]){
        user.userPulls[pack.title] ={}
      }
      if(user.userPulls[pack.title][ovr]){
        user.userPulls[pack.title][ovr] += newPulls[ovr]
      } else{
        user.userPulls[pack.title][ovr] = newPulls[ovr]
      }
    }
  };

  let newSum = 0
  let count = 0
  for (let pull in pack.pulls){
    count +=pack.pulls[pull];
    newSum += pack.pulls[pull] * pull
  }
  let newAvg = newSum/count
  pack.avgOverall = newAvg
  await Pack.findByIdAndUpdate(req.params.id, pack);
  await User.findOneAndUpdate({author: req.body.author}, user);

  res.status(200).send({
    pack,
    user}
  )
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>console.log("Server is up"))

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');