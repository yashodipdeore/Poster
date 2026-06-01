const runMiddleWare = (req, res, middleware, index) => {

  // Exit point
  if (index === middleware.length) {
    this.routes[req.method.toLowerCase() + req.url](req, res);
    return;
  }

  middleware[index](req, res, () => {
    runMiddleWare(req, res, middleware, index + 1);
  });

};


// Example
runMiddleWare(req, res, [
  (req, res, next) => {
    console.log('Middleware 1');
    next();
  },

  (req, res, next) => {
    console.log('Middleware 2');
    next();
  },

  (req, res, next) => {
    console.log('Middleware 3');
    next();
  }

], 0);