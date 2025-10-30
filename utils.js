const { getDB } = require("./connections/mongodb");
const dayjs = require('dayjs')

const insertData = async (collectionName, data) => {
  data = {
    ...data,
    insertedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    updatedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  };
  const result = await getDB().collection(collectionName).insertOne(data);
  return result;
};

const findData = async (
  collectionName,
  filter,
  sort = {},
  skip = 0,
  limit = 0
) => {
  const result = await getDB()
    .collection(collectionName)
    .find(filter)
    .sort(sort)
    .skip(Number(skip))
    .limit(Number(limit))
    .toArray();
  return result;
};

const findAndUpdateData = async (collectionName, filter, data) => {
  const updateDate = {
    $set: {
      ...data,
      updatedAt: new Date().toISOString(),
    },
  };
  const result = await getDB()
    .collection(collectionName)
    .findOneAndUpdate(filter, updateDate);
  return result;
};

const countData = async (collectionName, data) => {
  const result = await getDB().collection(collectionName).countDocuments(data);
  return result;
};

module.exports = {
  insertData,
  findData,
  findAndUpdateData,
  countData,
};
