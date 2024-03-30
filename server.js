const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");
const { error } = require("console");
const { title } = require("process");

const todos = [
  {
    title: "今天要刷牙",
    id: uuidv4(),
  },
  {
    title: "今天要吃早餐",
    id: uuidv4(),
  },
];

const requestListener = (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  if (req.url == "/todos" && req.method == "GET") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title != undefined) {
          const todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        errorHandle(res);
      }
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    res.writeHead(200, headers);
    todos.length = 0;
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on('end', () => {
      try {
        const todo = JSON.parse(body).title
        const id = req.url.split('/').pop()
        const index = todos.findIndex(ele => ele.id === id)
        console.log(todo, id)
        if(todo !== undefined && index !== -1) {
          todos[index].title = todo
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(error)
        }
        res.end()
      } catch {
        errorHandle(res)
      }
    })
  } else if (req.url == "/todos" && req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((ele) => ele.id == id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT ||　3005);
