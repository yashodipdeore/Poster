const Butter = require("../butter");


//SECTION --------------- Users & Posts Data ----------------//
//ANCHOR --- Users Data ------//
const USERS = [
  { id: 1, name: "Om Patil", username: "om123", password: "string" },
  { id: 2, name: "Meredith Green", username: "merit123", password: "string" },
  { id: 3, name: "Ben Adams", username: "ben123", password: "string" },
  { id: 4, name: "Emily Davis", username: "emily123", password: "string" },
  { id: 5, name: "Yashodip Deore", username: "Yashodip123", password: "string" },
];

//ANCHOR ---- Posts data -----//
const POSTS = [
  {
    id: 1,
    title: "The First Post",
    body: "This is the body of the post. It can be as long as you want, and it can contain multiple paragraphs. ",
    userId: 1,
  },
];



//SECTION ---- Creating server from Butter.js framework ---//
const server = new Butter();





//SECTION --------------- Files Routes ------------------- //
server.route("get", "/", (req, res) => {
  console.log("Server 1 is now handling this request !");

  res.sendFile("./public/index.html", "text/html");
});

server.route("get", '/login', (req, res) => {
  res.sendFile('./public/index.html', 'text/html');
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});




//SECTION ----------------- JSON Routes ------------------------ //

//ANCHOR ----- Login functionality json route ----//
server.route('post', '/api/login', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString('utf-8');
  });

  req.on('end', () => {
    body = JSON.parse(body);
    console.log(body);


    const username = body.username;
    const password = body.password;

    //check if the user exists
    const user = USERS.find(
      (user) => user.username === username
    );

    //check the password if user exists
    if (user && user.password === password) {
      //At this point, we know that the client is who they say they are
      res.status(200).json({ message: 'Logged in successfully !' });
    } else {
      res.status(401).json({ message: 'Invalid user name or password !' });
    };
  });
});


//ANCHOR - 

server.route("get", '/api/user', (req, res) => {

});



//ANCHOR ------- Posts route ---------//
// (send all the posts to the user)
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user.name;
    return post;
  });

  res.status(200).json(posts);
});




//SECTION ----------- Making our server live------------//
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server has started on port http://localhost:${PORT}`);
});
