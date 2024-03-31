const server = require("ws").Server;
const socket = new server({ port: 3000 });

try {
  socket.on("connection", (ws) => {
    socket.clients.forEach((client) =>
      client.send(JSON.stringify({ message: "User added", sender: "server" }))
    );

    ws.on("message", (message) => {
     
      const messageJ = JSON.parse(message.toString("utf8"));
      ws.personName = messageJ.name;
      socket.clients.forEach((client) => {
        if (client === ws) {
          return null;
        } else {
          const messageJson = JSON.parse(message.toString("utf-8"));
          return client.send(
            JSON.stringify({
              sender: ws.personName,
              message: messageJson.message,
            })
          );
        }
      });
    });
    ws.on("close", () => {
      socket.clients.forEach((client) =>
        client.send(
          JSON.stringify({ sender: "server", message: `${ws.personName} Left` })
        )
      );
    });
  });
} catch (error) {
  console.log(error);
}
