const config = require('./config/env');
const app = require('./app');

app.listen(config.port, () => {
  console.log(
    `Backend server listening on port ${config.port} (${config.nodeEnv})`
  );
});