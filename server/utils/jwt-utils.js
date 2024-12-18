import crypto from 'crypto';

function generateJwtSecret() {
  return crypto.randomBytes(32).toString('hex'); // 32 bytes = 256 bits (recommended minimum)
}

const jwtSecret = generateJwtSecret();

export default jwtSecret;