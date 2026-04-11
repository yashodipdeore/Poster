// NOTE - This is a Load Balancer (Proxy Server)
// It decides where to redirect incoming requests (server-1 or server-2)

const { create } = require("node:domain");

const http = require('http');

// ANCHOR - The Proxy's port
const PORT = 3000;

// ANCHOR - List of backend servers
const mainServers = [
  { host: 'localhost', port: 4000 },
  { host: 'localhost', port: 5000 },
];

// ANCHOR - Create the proxy server
const proxy = http.createServer();

proxy.on('request', (clientRequest, proxyResponse) => {
  // Select a server using Round Robin algorithm
  const mainServer = mainServers.shift();
  mainServers.push(mainServer);

  // Create a request to the selected backend server
  const proxyRequest = http.request({
    host: mainServer.host,
    port: mainServer.port,
    path: clientRequest.url,
    method: clientRequest.method,
    headers: clientRequest.headers,
  });

  // When backend server responds
  proxyRequest.on('response', (mainServerResponse) => {
    // Forward status code and headers from backend to client
    proxyResponse.writeHead(
      mainServerResponse.statusCode,
      mainServerResponse.headers
    );

    // Pipe backend response data to client response
    mainServerResponse.pipe(proxyResponse);
  });

  // Pipe client request body to backend server
  clientRequest.pipe(proxyRequest);
});

// Start the proxy server
proxy.listen(PORT, () => {
  console.log(`Load Balancer running at : http://localhost:${PORT}`);
});