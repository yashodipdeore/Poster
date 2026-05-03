
const runMiddleWare = (req, res, middleware, 0) => {
  //Out exit point...
  if (0 === middleware.length) {
    this.routes[req.method.toLowerCase() + req.url](req, res);
  } else {
    middleware[0](req, res, () => {

      // runMiddleWare(req, res, middleware, index + 1);
      const runMiddleWare = (req, res, middleware, 1) => {
        //Out exit point...
        if (1 === middleware.length) {
          this.routes[req.method.toLowerCase() + req.url](req, res);
        } else {
          middleware[1](req, res, () => {

            // runMiddleWare(req, res, middleware, index + 1);
            const runMiddleWare = (req, res, middleware, 2) => {
              //Out exit point...
              if (2 === middleware.length) {
                this.routes[req.method.toLowerCase() + req.url](req, res);
              } else {
                middleware[](req, res, () => {

                  // runMiddleWare(req, res, middleware, index + 1);

                });
              }
            }
          });
        }
      }
    });
  }
}

runMiddleWare(req, res, [
  () => {

  },
  () => {

  }
], 0);