type Context = {
  request: {
    [prop: string]: any;
  };
  response: {
    [prop: string]: any;
  };
};

/**
 * @param ctx data on which we want the pipeline to run
 * @param next function to run after the mutation of the data
 */

type Middleware = (ctx: Context, next: () => Promise<void>) => Promise<void>;

class MiddlewarePipeline {
  private readonly middlewares: Array<Middleware>;

  constructor() {
    this.middlewares = [];
  }

  public use(mw: Middleware) {
    this.middlewares.push(mw);
  }

  public async execeute(ctx: Context) {
    //recursively execute all the middleware functions synchronously
    const dispatch = async (index: number) => {
      if (index < this.middlewares.length) {
        const mw = this.middlewares[index];
        await mw(ctx, () => dispatch(index + 1)); //next() would be dispatch() called with the next index. dispatch() needs to be an async function as we need to await execution of mw functions, therefore it returns Promise<void>
      }
    };
    await dispatch(0);
  }
}

//------Example middlewares---------------------------

const logger: Middleware = async (ctx, next) => {
  console.log("Logger: Request received!");
  await next(); //passes the execution to the next middleware function
  console.log("Logger: Response sent!");
};

const authenticator: Middleware = async (ctx, next) => {
  // Creating an artificial delay with a promise to mimic authentication time taken
  await new Promise<void>((resolve, reject) => setTimeout(resolve, 4000));
  console.log("Authenticator: User authenticated!");
  await next();
};

const responder: Middleware = async (ctx, next) => {
  await new Promise<void>((resolve, reject) => setTimeout(resolve, 2000));
  ctx.response.status = 200;
  ctx.response.message = "Hello!";
  await next();
};

const pipeline = new MiddlewarePipeline();

//the order in which we add the functions to the middlewares array is important because it is executed in the exact same order
pipeline.use(logger);
pipeline.use(authenticator);
pipeline.use(responder);
//as all operations are happening on the ctx object, the ctx object is modified at each step in the pipeline

const ctx: Context = {
  request: { user: "John Doe" },
  response: {},
};

pipeline.execeute(ctx).then(() => {
  console.log("Final response:", ctx.response);
});
