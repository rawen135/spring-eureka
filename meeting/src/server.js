const os = require('node:os');
const express = require('express');
const packageInfo = require('../package.json');
const Eureka = require('eureka-js-client').Eureka;

const app = express();
const port = Number(process.env.PORT || 8083);
const eurekaHost = process.env.EUREKA_HOST || 'localhost';
const eurekaPort = Number(process.env.EUREKA_PORT || 8761);
const baseUrl = `http://localhost:${port}`;

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'UP' });
});

app.get('/info', (_request, response) => {
  response.json({
    name: packageInfo.name,
    version: packageInfo.version,
  });
});

app.get('/', (_request, response) => {
  response.json({ service: 'MEETING', health: `${baseUrl}/health`, info: `${baseUrl}/info` });
});

const eurekaClient = new Eureka({
  instance: {
    app: 'MEETING',
    instanceId: `${os.hostname()}:meeting:${port}`,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: {
      '$': port,
      '@enabled': 'true',
    },
    vipAddress: 'meeting',
    homePageUrl: `${baseUrl}/`,
    statusPageUrl: `${baseUrl}/info`,
    healthCheckUrl: `${baseUrl}/health`,
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: eurekaHost,
    port: eurekaPort,
    servicePath: '/eureka/apps/',
  },
});

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Meeting écoute sur ${baseUrl}`);
  eurekaClient.start();
});

let stopping = false;
function shutdown() {
  if (stopping) return;
  stopping = true;
  eurekaClient.stop();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
