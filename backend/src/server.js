require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('========================================================');
  console.log(`🚀 PeoplePay360 Backend running on: http://localhost:${PORT}`);
  console.log(`📖 Interactive Swagger Docs:       http://localhost:${PORT}/api-docs`);
  console.log(`📡 API Health Check & Overview:    http://localhost:${PORT}/`);
  console.log('========================================================');
});
