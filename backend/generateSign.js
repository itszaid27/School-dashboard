const dotenv = require("dotenv");
const jwt = require("jsonwebtoken")

dotenv.config(); 

const SCHOOL_ID = process.env.SCHOOL_ID;
const PG_KEY = process.env.PG_KEY;

function generateSign(collectRequestId) {
  if (!SCHOOL_ID || !PG_KEY) {
    throw new Error("Missing SCHOOL_ID or PG_KEY in environment variables");
  }

  const payload = {
    school_id: SCHOOL_ID,
    collect_request_id: collectRequestId,
  };

  return jwt.sign(payload, PG_KEY, { algorithm: "HS256" });
}


const collectRequestId = process.argv[2];
if (!collectRequestId) {
  console.error("Usage: node generateSign.js <collect_request_id>");
  process.exit(1);
}

console.log("Generated Sign:", generateSign(collectRequestId));