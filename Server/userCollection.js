const express = require('express')
const mongodb = require('mongodb')

const router = express.Router();

//Get Users
router.get('/',async (req,res)=>{
    const users = await loadUsersCollection()
    res.send(await users.find({}).toArray());
});

//Get User by username
router.get('/:username',async (req,res)=>{
    const users = await loadUsersCollection()
    res.send(await users.find({username: req.params.username}).toArray());
});

// Get User by email and pass (Authentication)
router.get('/user/:user',async (req,res)=>{
    const users = await loadUsersCollection()
    const user = req.params.user
    res.send(await users.find({email: JSON.parse(user).email, password: JSON.parse(user).password}).toArray());
});

//Add Users
router.post('/',async (req,res)=>{
    const users = await loadUsersCollection()
    await users.insertOne({
        username: req.body.username,
        type: req.body.type,
        email: req.body.email,
        password: req.body.password,
        wins: 0,
        losses: 0,
    })
    res.status(201).send()
});

// Delete User
router.delete('/:id', async (req,res)=>{
    const users = await loadUsersCollection()
    await users.deleteOne({_id: new mongodb.ObjectID(req.params.id)})
    res.status(200).send()
})


async function loadUsersCollection(){
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://admin:pass@cluster0-bzjjl.mongodb.net/test?retryWrites=true&w=majority',{   
        }
    )
    return client.db('VueChess').collection('Users')
}

module.exports = router;