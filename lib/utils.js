// const request = require('superagent');

// // Used in load-seed-data.js
// // takes in a tea type
// const retrieveTeaTypeId = async (teaTypeStr) => {
//   // request tea-types data from back-end
//   const response = await request.get('/tea-types');

//   //  grab tea types array from response
//   const tea_typesArr = response.body;

//   // loops as many times as there are values in tea types array
//   for (let i = 0; i < tea_typesArr.length; i++){
//     // if the tea type string matches the current tea types array items value, return the current tea tpes array items associate id.
//     if (teaTypeStr === tea_typesArr[i].tea_type) console.log(tea_typesArr[i].id);
//   }
// };

// module.exports = retrieveTeaTypeId;