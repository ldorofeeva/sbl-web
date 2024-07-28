const {
    findAllController, deleteOneController, updateOneController, createNewController
} = require('./simple-reusable-controllers')


const getAll = async (req, res, next) => {
    return await findAllController('malts', req, res, next)
};

const createNew = async (req, res, next) => {
    return await createNewController('malts', req, res, next)

};

const updateItemByName = async (req, res, next) => {
    return await updateOneController('malts', 'name', req, res, next)
};

const deleteItemByName = async (req, res, next) => {
    return deleteOneController('malts', 'name', req, res, next)
};

exports.getAll = getAll;
exports.createNew = createNew;
exports.updateItemByName = updateItemByName;
exports.deleteItemByName = deleteItemByName;