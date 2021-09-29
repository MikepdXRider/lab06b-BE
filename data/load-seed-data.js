const bcrypt = require('bcryptjs');
const client = require('../lib/client');
// import our seed data:
const teas = require('./data.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
run();

async function run() {

  try {
    await client.connect();

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
      
    const user = users[0].rows[0];

    await Promise.all(
      teas.map(tea => {
        return client.query(`
                    INSERT INTO teas (name, cool_factor, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `,
        [tea.tea, tea.type, tea.description, tea.north_america_native, tea.url, user.id]);
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
