const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );           
                CREATE TABLE tea_types (
                    id SERIAL PRIMARY KEY,
                    tea_type VARCHAR(512) NOT NULL
                );           
                CREATE TABLE teas (
                    id SERIAL PRIMARY KEY NOT NULL,
                    tea_name VARCHAR(512) NOT NULL,
                    type_id INTEGER NOT NULL REFERENCES tea_types(id),
                    description VARCHAR(512) NOT NULL,
                    north_america_native BOOLEAN NOT NULL,
                    url VARCHAR(512) NOT NULL,
                    owner_id INTEGER NOT NULL REFERENCES users(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}

