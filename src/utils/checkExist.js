/**
 * check record exists or not
 * @param {*} model
 * @param {*} fieldName
 * @param {*} value
 * @returns Boolean true/false
 */
const checkExist = async (model, fieldName, value) => {
    const findData = await model.findOne({ fieldName: value });
    return findData;
};
module.exports = { checkExist };
