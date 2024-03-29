const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const teas = require('./tea-data.js');
// import our seed sub-data:
const teaTypes = require('./tea-type-data.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const retrieveTeaTypeId = require('../lib/utils.js');
// const retrieveTeaTypeId = require('../lib/utils.js');
run();

async function run() {

  try {
    await client.connect();

    // Populates users table with users information.
    const users = await Promise.all(
      usersData.map(user => {
        const hash = bcrypt.hashSync(user.password, 8);
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, hash]);
      })
    );
    
    // Grabs first users first row. 
    const user = users[0].rows[0];
    
    // Populates tea_types sql table with tea_type values. 
    await Promise.all(
      teaTypes.map(teaType => {
        return client.query(`
                    INSERT INTO tea_types (tea_type)
                    VALUES ($1);
                `,
        [teaType.tea_type]);
      })
    );
    
    // Populates teas sql table with teas information.
    await Promise.all(
      teas.map(async tea => {
        // ❗ import a function from utils.js here which takes in the tea.type, makes a query to SQL DB for tea_types.id where tea_types.tea_type = tea.type. Return the ID and save it to a variable.
        const teaTypeId = await retrieveTeaTypeId(tea.type_id);
        return client.query(`
                    INSERT INTO teas (tea_name, type_id, description, north_america_native, url, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [tea.tea_name, teaTypeId, tea.description, tea.north_america_native, tea.url, user.id]);
      })
    );
    
    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
