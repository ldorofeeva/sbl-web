const MongoClient = require('mongodb').MongoClient;
/**
 * Method that connects to a mongo instance based on the connection settings in the config file.  This is used implicitly inside the other methods but can be used explicitly.
 *
 * The expected way to use this explicitly would be the following:
 *
 * @example
 * ```js
 * const client = mongoClient()
 * await client.connect()
 * insertOne(<collection>, <document>, client)
 * findOne(<collection>, <query>, client)
 * await client.close()
 * ```
 *
 * @returns a mongo client
 */
const mongoClient = (options) =>
{
    const uri = `mongodb://${process.env.MONGO_URL}/${process.env.MONGO_DB}`;
    return new MongoClient(uri, options)
}

/**
 * Method that returns the first object from the collection and provided query.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to: https://www.mongodb.com/docs/manual/reference/method/db.collection.findOne/

 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param query dictionary specifying the search parameters.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns first Model instance from the query.
 */
const findOne = async(collectionName, query, options)=>
{
    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).findOne(query, options)
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}

/**
 * Method returning a list of Model results based on the provided collection and query.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to: https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param query dictionary specifying the search parameters.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns list of Model results based on the provided query.
 */
const find = async (collectionName, query, options) =>
{
    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).find(query, options).toArray()
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}

/**
 * Method that inserts a single document into the provided collection.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to: https://www.mongodb.com/docs/manual/reference/method/db.collection.insertOne/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param document dictionary with all necessary contents for the document to be inserted.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns the insert result.
 */
const insertOne = async (collectionName, document, options) => {

    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).insertOne(document, options)
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}

/**
 * Method that inserts a list of documents into the provided collection.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to: https://www.mongodb.com/docs/manual/reference/method/db.collection.insertMany/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param documents list of dictionaries with all necessary contents for the documents to be inserted.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns the insert result.
 */
const insertMany = async (collectionName, documents, options) => {

    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).insertMany(documents, options)
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}

/**
 * Method that updates a single document with provided update document based on the given filter.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to:  https://www.mongodb.com/docs/manual/reference/method/db.collection.updateOne/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param filter dictionary specifying the search parameters
 * @param update dictionary containing the document information that should be updated.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns the update result.
 */
const updateOne = async (collectionName, filter, update, options) => {

    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).updateOne(filter, update, options)
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}

/**
 * Method that updates a multiple documents with provided update document based on the given filter.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to:  https://www.mongodb.com/docs/manual/reference/method/db.collection.updateMany/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param filter dictionary specifying the search parameters
 * @param update dictionary containing the document information that should be updated.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns the update result.
 */
const updateMany = async (collectionName, filter, update, options) => {

    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).updateMany(filter, update, options)
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}


/**
 * Method that deletes the first document found that matches the provided filter.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to: https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteOne/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param filter dictionary specifying the search parameters.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns the delete result
 */
const deleteOne = async (collectionName, filter, options) => {

    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).deleteOne(filter, options)
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}


/**
 * Method that deletes all documents matching the provided filter.  The methods default to using the database configured in the settings and
 * manage the connection for interaction.  Optionally, you can provide a number of options specified by MongoDb, a different database, and your own connection
 * to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to: https://www.mongodb.com/docs/manual/reference/method/db.collection.deleteMany/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param filter dictionary specifying the search parameters.
 * @param options dictionary of extra options that can override database defaults.
)
 * @returns the delete result
 */
const deleteMany = async (collectionName, filter, options) => {

    const client = mongoClient()
    let result
    try {
        await client.connect()
        const database = client.db(dbName)
        const collection = database.collection(collectionName)

        result = await collection.deleteMany(filter, options)
    } finally {
        await client.close()
    }
    return result
}

/**
 * Method for performance advanced queries by providing a detailed aggregation pipleline.  Useful for when lookups, result aggregation, or grouping is necessary.
 * The methods default to using the database configured in the settings and manage the connection for interaction.  Optionally, you can provide a number of options
 * specified by MongoDb, a different database, and your own connection to the MongoDb instance.
 *
 * For more documentation on the MongoDb method and available options, go to: https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/
 * As the aggregation pipeline is sophisticated, further documentation on how to setup and use the different stages can be found
 * at: https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/
 *
 * @param collectionName case sensitive string of the collection the query should be based around.
 * @param pipeline a list of dictionaries defining the different stages of the aggregation pipeline for your query.
 * @param options dictionary of extra options that can override database defaults.
 * @returns a list of the returned results based on the provided aggregation pipeline.
 */
const aggregate = async (collectionName, pipeline, options) =>
{
    // const client = mongoClient()
    // let result
    // try {
    //     await client.connect()
    //
    //     const database = client.db(dbName)
    //     const collection = database.collection(collectionName)
    //     result = await collection.aggregate(pipeline, options)
    //
    // } finally {
    //     await client.close()
    // }
    // return result.toArray()
    const client = mongoClient()
    await client.connect()
    const database = client.db()
    let result
    try {
        result = await database.collection(collectionName).aggregate(pipeline, options).toArray()
    } catch (e) {
        console.log(e)
    }
    client.close()
    return result
}

exports.findOne = findOne;
exports.find = find;
exports.insertOne = insertOne;

exports.updateOne = updateOne;

exports.deleteOne = deleteOne;
exports.aggregate = aggregate;
// {
//     insertMany,
//     updateMany,
//     deleteMany,
//     aggregate
// }