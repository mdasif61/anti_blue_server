const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const cors=require('cors');

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Anti Blue Running')
})

// anti_blue
// jgi0IZZldAAraD6i


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kuomool.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    
    await client.connect();
    
    const glassCollection=client.db('anti_blue_glasses').collection('glasses')
    const deliveryCollection=client.db('anti_blue_glasses').collection('delivery')

    app.get('/products',async(req,res)=>{
        const result=await glassCollection.find({}).toArray()
        res.send(result)
    })
    app.get('/order/:id',async(req,res)=>{
        const id=req.params.id;
        const query={_id:new ObjectId(id)}
        const result=await glassCollection.findOne(query);
        res.send(result)
    })

    app.get('/delivery/:text',async(req,res)=>{
        const text=req.params.text
        if(text==='Regular delivery' || text==='Express delivery'){
            const query={method:req.params.text};
            const result=await deliveryCollection.find(query).toArray();
            return res.send(result)
        }else if(text==='All delivery'){
            const result=await glassCollection.find({}).toArray();
            res.send(result)
        }
    })

    app.post('/delivery',async(req,res)=>{
        const data=req.body;
        const result=await deliveryCollection.insertOne(data);
        res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log('anti blue running port : ', port)
})