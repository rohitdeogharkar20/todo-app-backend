const {
    getDB
} = require('./connections/mongodb')

const insertData = async(collectionName, data) =>{
    data = {
        ...data,
        insertedAt : new Date() ,
        updatedAt : new Date()
    }
    const result = await getDB().collection(collectionName).insertOne(data)
    return result
}

const findData = async (collectionName, filter, sort = {}, skip = 0, limit = 0) => {
    const result = await getDB().collection(collectionName).find(filter).sort(sort).skip(Number(skip)).limit(Number(limit)).toArray()
    return result
}

const findAndUpdateData = async(collectionName, filter, data) => {
    const updateDate = {
        $set : {
            ...data,
            updatedAt : new Date()
        }
    }
    const result = await getDB().collection(collectionName).findOneAndUpdate(filter, updateDate)
    return result
}

const countData = async (collectionName, data) =>{
    const result = await getDB().collection(collectionName).countDocuments(data)
    return result
}

const getUserTodo = async (collectionName, username) => {
    
    const result = await getDB().collection(collectionName).aggregate([
        {
            $match : {
                username : username,
                deleteStatus : 0,
                // $or : [ { startAt : { $gt : new Date().toISOString() } }, { startAt : ""} ]
            },
        },
        {
            $addFields : {
                sortDate : {
                    $cond : [
                        { $or : [ { $eq : ["$startAt", ""] }, { $not : ["$startAt"] } ] },
                        new Date ("9999-12-31T23:59:59Z"),
                        "$startAt"
                    ]
                }
            }
        },
        {
            $sort : {
                sortDate : 1,
                insertedAt : 1
            }
        }
    ]).toArray();

    return result;
}

module.exports = {
    insertData,
    findData,
    findAndUpdateData,
    countData,
    getUserTodo
}