import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

class DBHandler {
    private mongod = new MongoMemoryServer()
    
    /**
     * Connect to the in-memory database.
     */
    connect = async () => {
        const uri = await this.mongod.getConnectionString()
    
        const options = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
    
        await mongoose.connect(uri, options)
    }
    
    /**
     * Drop database, close the connection and stop mongod.
     */
    closeDatabase = async () => {
        await mongoose.connection.dropDatabase()
        await mongoose.connection.close()
        await this.mongod.stop()
    }
    
    /**
     * Remove all the data from all db collections.
     */
    clearDatabase = async () => {
        const collections = mongoose.connection.collections
        for (const key in collections) {
            const collection = collections[key]
            await collection.deleteMany({})
            await collection.dropIndexes()
        }
    }
}

export default DBHandler