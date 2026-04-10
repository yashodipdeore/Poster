const Butter = require("../butter");

const USERS = [
  { id: 1, name: "Om Patil", username: "om123", password: "string" },
  { id: 2, name: "Meredith Green", username: "merit123", password: "string" },
  { id: 3, name: "Ben Adams", username: "ben123", password: "string" },
  { id: 4, name: "Emily Davis", username: "emily123", password: "string" },
  { id: 5, name: "Yashodip Deore", username: "Yashodip123", password: "string" },
];

const POSTS = [
  {
    id: 1,
    title: "The First Post",
    body: "This is the body of the post. It can be as long as you want, and it can contain multiple paragraphs. ",
    userId: 1,
  },
];

const PORT = 8000;

const server = new Butter();

// ------ Files Routes ------ //

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

// ------ JSON Routes ------ //

// Send the list of all the posts that we have
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.name;
    return post;
  });

  res.status(200).json(posts);
});

server.listen(PORT, () => {
  console.log(`Server has started on port http://localhost:${PORT}`);
});
