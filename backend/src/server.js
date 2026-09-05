require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🚀 PeoplePay360 Backend running on: http://localhost:${PORT}`);
  console.log(`📡 API Health Check & Docs: http://localhost:${PORT}/`);
  console.log('========================================================');
});
