const admin = require("firebase-admin");

const readFileSync = require("fs").readFileSync;
const dotenv = require("dotenv");

dotenv.config();

const serviceAccount = JSON.parse(
  readFileSync("./config/serviceAccountKey.json", "utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
