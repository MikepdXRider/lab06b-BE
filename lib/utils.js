// Used in load-seed-data.js

const client = require('./client.js');

// takes in a tea type
const retrieveTeaTypeId = async (teaTypeStr) => {
  try{
    const teaTypes = await client.query('SELECT id FROM tea_types WHERE tea_types.tea_type = $1', [teaTypeStr]);
    return teaTypes.rows[0].id;
  } catch(e) {
    console.log(e);
  }
};

module.exports = retrieveTeaTypeId;