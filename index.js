

const express=require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors=require('cors')
const ObjectId=require('mongodb').ObjectId


const app=express()
const port=5000

//  user: mydbuser1
// pass: jZ2iHH1VxjGQUOEf

// middleware
app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://mydbuser1:jZ2iHH1VxjGQUOEf@cluster0.pptx3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const database = client.db("food");
    const userCollection = database.collection("users");
    
    // get API
    app.get('/users',async(req,res)=>{
      const cursor=userCollection.find({})
      const users= await cursor.toArray()
      res.send(users)
    })

    // single user get
    app.get('/users/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:ObjectId(id)}
      const user=await userCollection.findOne(query)
      console.log("Load user with id",id);
      res.send(user)
    })

    // post API
    app.post('/users', async(req,res)=>{
      const newUser=req.body
      const result= await userCollection.insertOne(newUser)
      console.log("got new user",req.body);
      // res.send('hit the post')
      console.log("Added user",result);
      res.json(result)
    })

    // Delete API
    app.delete('/users/:id', async(req,res)=>{
      const id=req.params.id
      const query={_id:ObjectId(id)}
      const result=await userCollection.deleteOne(query)
      console.log("Deleting user eith id",id);
      res.json(result)
    })
    

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Running')
})

app.listen(port,()=>{
    console.log("Running port",port);
})