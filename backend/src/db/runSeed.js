require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function run() {
  const name = 'System Administrator Account';
  const email = 'admin@storeratings.com';
  const plainPassword = 'Admin@1234';
  const address = 'Veera Desai Road,Andheri West, Mumbai, Maharashtra 400053';
  const hashed = await bcrypt.hash(plainPassword, 10);

  await pool.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [name, email, hashed, address]
  );

  console.log('Admin account ready');
  console.log('email:', email);
  console.log('password:', plainPassword);
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
