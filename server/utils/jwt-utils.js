import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

function generateJwtSecret() {
  return crypto.randomBytes(32).toString('hex'); // 32 bytes = 256 bits (recommended minimum)
}

// const jwtSecret = generateJwtSecret();
const jwtSecret = process.env.JWT_SECRET;

export default jwtSecret;