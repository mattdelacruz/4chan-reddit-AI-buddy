const fs = require('fs');
require('dotenv').config();

const content = `
const OPENAI_API_KEY = "${process.env.OPENAI_API_KEY}";
export default OPENAI_API_KEY;
`;
fs.writeFileSync('content/apiKey.js', content);