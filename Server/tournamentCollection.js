const express = require('express')
const mongodb = require('mongodb')

const router = express.Router();

//Get Tournaments
router.get('/',async (req,res)=>{
    const tournaments = await loadTournamentsCollection()
    res.send(await tournaments.find({}).toArray());
});

// //Get Tournament by name
router.get('/:name',async (req,res)=>{
    const tournaments = await loadTournamentsCollection()
    res.send(await tournaments.find({name: req.params.name}).toArray());
});

//Add Tournament
router.post('/',async (req,res)=>{
    const tournaments = await loadTournamentsCollection()
    await tournaments.insertOne({
        name: req.body.name,
        maxPlayers: req.body.maxPlayers,
        winner: null,
        startTime: req.body.startTime,
    })
    res.status(201).send()
});

// Delete Tournament
router.delete('/:name', async (req,res)=>{
    const tournaments = await loadTournamentsCollection()
    await tournaments.deleteOne({name: req.params.name})
    res.status(200).send()
})


async function loadTournamentsCollection(){
    const client = await mongodb.MongoClient.connect(
        'mongodb+srv://admin:pass@cluster0-bzjjl.mongodb.net/test?retryWrites=true&w=majority',{   
        }
    )
    return client.db('VueChess').collection('Tournaments')
}

module.exports = router;