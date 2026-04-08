/**
 * seed.js — Insert demo users with properly hashed passwords.
 * Run once after importing schema.sql:
 *   node seed.js
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const users = [
  { first_name: 'Salman',    last_name: 'Admin',    email: 'mmsalmanmmskk@gmail.com',  password: 'Admin@123', role: 'ADMIN',             department: 'Computer Engineering' },
  { first_name: 'Pravar',    last_name: 'Sines',    email: 'Pravarsines@gmail.com',    password: 'hod@123',   role: 'HOD',               department: 'Computer Engineering' },
  { first_name: 'Kisothana', last_name: 'Bala',     email: 'kisothanabala@gmail.com',  password: 'kiso@85',   role: 'LECTURER',          department: 'Computer Engineering' },
  { first_name: 'Ajanthan',  last_name: 'WC',       email: 'ajanthanwc@gmail.com',     password: 'To@123',    role: 'TECHNICAL_OFFICER', department: 'Computer Engineering' },
  { first_name: 'Pooja',     last_name: 'Yogarasa', email: 'poojayogarasa@gmail.com',  password: 'Stu@123',   role: 'STUDENT',           department: 'Computer Engineering' },
  { first_name: 'Poojah',    last_name: 'Yogarasa', email: 'poojahyogarasa22@gmail.com', password: 'Stu@345', role: 'STUDENT',           department: 'Computer Engineering' },
];

async function seed() {
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 10);
    await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO users (first_name, last_name, email, password, role, department, is_active)
         VALUES (?, ?, ?, ?, ?, ?, 1)
         ON DUPLICATE KEY UPDATE
           first_name = VALUES(first_name),
           last_name  = VALUES(last_name),
           password   = VALUES(password),
           role       = VALUES(role),
           department = VALUES(department),
           is_active  = 1`,
        [u.first_name, u.last_name, u.email, hash, u.role, u.department],
        (err, result) => {
          if (err) return reject(err);
          if (result.affectedRows === 1) {
            console.log(`✅ Inserted: ${u.email} (${u.role})`);
          } else {
            console.log(`🔄 Updated:  ${u.email} (${u.role})`);
          }
          resolve();
        }
      );
    });
  }
  console.log('\n✅ Seed complete.');
  db.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  db.end();
  process.exit(1);
});
