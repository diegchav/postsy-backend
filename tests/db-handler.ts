import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

class DBHandler {
    private mongod = new MongoMemoryServer({
        instance: {
            storageEngine: 'wiredTiger'
        },
        binary: {
            version: '4.2.5'
        }
    })
    
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
     * Disconnect the in-memory database.
     */
    disconnect = async () => {
        await mongoose.connection.close()
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
        }
    }

    /**
     * Drop all indexes from all db collections.
     */
    dropIndexes = async () => {
        const collections = mongoose.connection.collections
        for (const key in collections) {
            const collection = collections[key]
            await collection.dropIndexes()
        }
    }

    /**
     * Get collection given a name.
     */
    getCollection = (name: string) => {
        const collection = mongoose.connection.collection(name)
        return collection
    }
}

export default DBHandler