const { text } = require("node:stream/consumers");
const Butter = require("../butter");
const { request } = require("node:http");
const { error } = require("node:console");


//SECTION --------------- Users & Posts Data ----------------//
//ANCHOR - Sessions data------//!SECTION
//{userId: 1, token: 23243143}
const SESSIONS = [];


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

//for authentication
server.beforeEach((req, res, next) => {
  console.log('this is the first middleware function');
  next();
});

server.beforeEach((req, res, next) => {
  setTimeout(() => {
    next();
    console.log('this is the second middleware function');
  }, 2000);
});


server.beforeEach((req, res, next) => {
  console.log('this is the third middleware function');
  next();
});





//SECTION --------------- Files Routes ------------------- //
server.route("get", "/", (req, res) => {
  console.log('This is the ' / ' route');
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", '/login', (req, res) => {
  res.sendFile('./public/index.html', 'text/html');
});

server.route("get", "/profile", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});



//SECTION ----------------- JSON Routes ------------------------ //

//SECTION ----------------- JSON Routes ------------------------ //

//ANCHOR ----- Login functionality json route ----//
//--- Log a user and give them a token------//
server.route('post', '/api/login', (req, res) => {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString('utf-8');
  });

  req.on('end', () => {
    body = JSON.parse(body);

    const username = body.username;
    const password = body.password;

    //check if the user exists
    const user = USERS.find(
      (user) => user.username === username
    );

    //check the password if user exists
    if (user && user.password === password) {

      //Generating token & Saving it to Sessions array
      const token = Math.floor(
        Math.random() * 100000000000
      ).toString();

      SESSIONS.push({
        userId: user.id,
        token: token
      });

      //passing token using cookies
      res.setHeader(
        'Set-Cookie',
        `token=${token}; Path=/;`
      );

      res.status(200).json({
        message: 'Logged in successfully !'
      });

    } else {

      res.status(401).json({
        message: 'Invalid username or password !'
      });

    }
  });
});



//ANCHOR ------ Log a user out -------//
server.route('delete', '/api/logout', (req, res) => {

  const cookies = req.headers.cookie || '';

  const token = cookies
    .split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')[1];

  const sessionIndex = SESSIONS.findIndex((session) => {
    return session.token === token;
  });

  if (sessionIndex !== -1) {

    //remove session
    SESSIONS.splice(sessionIndex, 1);

    //remove cookie
    res.setHeader(
      'Set-Cookie',
      'token=; Path=/; Max-Age=0;'
    );

    res.status(200).json({
      message: 'Logged out successfully !'
    });

  } else {

    res.status(401).json({
      error: 'Unauthorized'
    });

  }

});



//ANCHOR ------ User information Route ---------//
server.route('get', '/api/user', (req, res) => {

  const cookies = req.headers.cookie || '';

  const token = cookies
    .split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')[1];

  //verify token
  const session = SESSIONS.find((session) => {
    return session.token === token;
  });

  if (session) {

    const user = USERS.find((user) => {
      return user.id === session.userId;
    });

    res.status(200).json({
      username: user.username,
      name: user.name
    });

  } else {

    res.status(401).json({
      error: 'Unauthorized'
    });

  }

});



//ANCHOR - Updating user information route ---//
server.route('put', '/api/user', (req, res) => {

  const cookies = req.headers.cookie || '';

  const token = cookies
    .split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')[1];

  //verify token
  const session = SESSIONS.find((session) => {
    return session.token === token;
  });

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString('utf-8');
  });

  req.on('end', () => {

    body = JSON.parse(body);

    const name = body.name;
    const username = body.username;

    const user = USERS.find((user) => {
      return user.id === session.userId;
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (name) {
      user.name = name;
    }

    if (username) {
      user.username = username;
    }

    res.status(200).json({
      message: 'User updated successfully !',
      user: {
        id: user.id,
        name: user.name,
        username: user.username
      }
    });

  });

});



//ANCHOR ------- Posts route ---------//
// (send all the posts to the user)
server.route('get', '/api/posts', (req, res) => {

  const posts = POSTS.map((post) => {

    const user = USERS.find((user) => {
      return user.id === post.userId;
    });

    return {
      ...post,
      author: user.name
    };

  });

  res.status(200).json(posts);

});



//ANCHOR -------- Create post route---------//
server.route('post', '/api/posts', (req, res) => {

  const cookies = req.headers.cookie || '';

  const token = cookies
    .split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')[1];

  //verify token
  const session = SESSIONS.find((session) => {
    return session.token === token;
  });

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  let body = '';

  req.on('data', (chunk) => {
    body += chunk.toString('utf-8');
  });

  req.on('end', () => {

    body = JSON.parse(body);

    const title = body.title;
    const postBody = body.body;

    if (!title || !postBody) {
      return res.status(400).json({
        error: 'Title and body are required'
      });
    }

    const post = {
      id: POSTS.length + 1,
      title: title,
      body: postBody,
      userId: session.userId
    };

    POSTS.push(post);

    res.status(201).json({
      message: 'Post created successfully !',
      post
    });

  });

});


//ANCHOR - Updating user information route ---//
server.route('put', '/api/user', (req, res) => {

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



//ANCHOR -------- Create post route---------//
server.route('post', '/api/posts', (req, res) => {

});



//SECTION ----------- Making our server live------------//
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Server has started on port http://localhost:${PORT}`);
});
