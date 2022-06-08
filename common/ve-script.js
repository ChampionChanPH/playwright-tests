const { MongoClient, ServerApiVersion } = require('mongodb')
const data = require("../common/common-details.json")

const password = data.devMongoDb
const userId = "auth0|61fb93d73a1c94006a97447a"

// const uri = `mongodb+srv://prosple:${password}@dev.qxgpg.mongodb.net/?retryWrites=true&w=majority`
const uri = `mongodb://prosple:${password}@dev-shard-00-00.qxgpg.mongodb.net:27017,dev-shard-00-01.qxgpg.mongodb.net:27017,dev-shard-00-02.qxgpg.mongodb.net:27017/dev?ssl=true&replicaSet=atlas-13p0if-shard-0&authSource=admin&retryWrites=true&w=majority`

async function connect() {
    // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
    const client = new MongoClient(uri)
    try {
        await client.connect()
        const db = client.db("dev")
        const ve = db.collection("virtualexperiences")
        await ve.deleteMany({ "userId": userId })
        // const cursor = await ve.find({ "userId": userId })
        // const result = await cursor.toArray()
        // console.table(result)
        // result.forEach(r => console.log(r))
    } catch (e) {
        console.error(`ERROR - ${e}`)
    } finally {
        client.close()
    }
}

connect()