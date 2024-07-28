const {
    findAllController, deleteOneController, updateOneController, createNewController
} = require('./simple-reusable-controllers')


const getAll = async (req, res, next) => {
    return await findAllController('hops', req, res, next)
};

const createNew = async (req, res, next) => {
    return await createNewController('hops', req, res, next)

};

const updateItemByName = async (req, res, next) => {
    return await updateOneController('hops', 'name', req, res, next)
};

const deleteItemByName = async (req, res, next) => {
    return deleteOneController('hops', 'name', req, res, next)
};

exports.getAll = getAll;
exports.createNew = createNew;
exports.updateItemByName = updateItemByName;
exports.deleteItemByName = deleteItemByName;