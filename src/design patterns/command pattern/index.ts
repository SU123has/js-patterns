// class OrderManager {
//   private orders: Array<string>;

//   constructor() {
//     this.orders = [];
//   }

//   public placeOrder(order: string, id: string) {
//     this.orders.push(id);
//     return `You have successfully ordered ${order} (${id})`;
//   }

//   public trackOrder(id: string) {
//     if (this.orders.includes(id)) {
//       return `Your order ${id} will arrive in 20 minutes.`;
//     } else {
//       return "Order not found!";
//     }
//   }

//   public cancelOrder(id: string) {
//     if (this.orders.includes(id)) {
//       this.orders = this.orders.filter((orderId) => orderId !== id);
//       return `Order ${id} successfully cancelled!`;
//     } else {
//       return "Order not found!";
//     }
//   }
// }

// const manager = new OrderManager();

// manager.placeOrder("Thai pad", "1234");
// manager.trackOrder("1234");
// manager.cancelOrder("1234");

//Command pattern: invoking the methods like this have downsides as if we want to change them in future it would require change in every other places. So we can decouple the methods from the object that executes it, in this way we can change the functions independently, and it wouldnt break the rest of the code.

class OrderManager {
  private readonly orders: Array<string>;
  private readonly history: Command[];
  private redoStack: Command[];
  private readonly queue: Command[];

  constructor() {
    this.orders = [];
    this.history = [];
    this.redoStack = [];
    this.queue = [];
  }
  //this method will execute any command given, we must pass orders array to it along with any additional arguments

  //execute -> add to history, empty the redo stack
  public execute(command: Command, ...args: Array<any>): void {
    const result = command.executeCommand(this.orders, ...args);
    this.history.push(command);
    this.redoStack = [];
    console.log(result);
    console.log(`Orders array: ${this.orders}`);
  }

  //undo -> add to redo stack, remove from history stack
  public undo(...args: Array<any>) {
    const command = this.history.pop();
    if (command?.undoCommand) {
      const result = command.undoCommand(this.orders, ...args);
      this.redoStack.push(command);
      console.log(`Undo: ${result}`);
    } else {
      console.log("Nothing to undo or undo not supported.");
    }
    console.log(`Orders array: ${this.orders}`);
  }

  //redo -> again add back to history stack, remove from redo stack
  public redo(...args: Array<any>) {
    const command = this.redoStack.pop();
    if (command) {
      const result = command.executeCommand(this.orders, ...args);
      this.history.push(command);
      console.log(`Redo: ${result}`);
    } else {
      console.log("Nothing to redo");
    }
    console.log(`Orders array: ${this.orders}`);
  }

  //queue/batch -> push all the commands into an array, and execute them atonce
  public queueCommand(command: Command): void {
    this.queue.push(command);
  }

  public executeQueue(...args: Array<any>) {
    while (this.queue.length > 0) {
      const command = this.queue.shift()!; //execute the first command and remove from the array
      this.execute(command, ...args);
    }
  }
}

class Command {
  public executeCommand: (orders: Array<string>, ...args: Array<any>) => string;
  public undoCommand?: (orders: Array<string>, ...args: Array<any>) => string;

  constructor(
    execute: (orders: Array<string>, ...args: Array<any>) => string,
    undo?: (orders: Array<string>, ...args: Array<any>) => string
  ) {
    //`execute` is the function we want to execute
    this.executeCommand = execute;
    this.undoCommand = undo;
  }
}

//Creating the decoupled functions
//here we create Command objects instead of directly passing the callbacks as objects can encapusulate not just the function, but also other metadata, undo logic, logging, etc. Also since all the command objects will have standard method ie executeCommand, they will have same interface, making it east to store, queue or batch them. With callbacks each can have a different function signature.

function placeOrder(order: string, id: string): Command {
  return new Command(
    (orders): string => {
      orders.push(id);
      return `You have successfully ordered ${order} (${id})`;
    },
    (orders): string => {
      const index = orders.indexOf(id);
      if (index !== -1) {
        orders.splice(index, 1);
        return `Undo: Order ${id} removed.`;
      } else {
        return "Undo: Order not found!";
      }
    }
  );
}

function trackOrder(id: string): Command {
  return new Command((orders): string => {
    if (orders.includes(id)) {
      return `Your order ${id} will arrive in 20 minutes.`;
    } else {
      return "Order not found!";
    }
  });
}

function cancelOrder(id: string): Command {
  return new Command(
    (orders): string => {
      const index = orders.indexOf(id);
      if (index !== -1) {
        orders.splice(index, 1);
        return `Order ${id} successfully cancelled!`;
      } else {
        return "Order not found!";
      }
    },
    (orders): string => {
      orders.push(id);
      return `Undo: Order ${id} restored.`;
    }
  );
}

const manager = new OrderManager();

manager.execute(placeOrder("Thai Pad", "1234"), "additionalArguments");
manager.execute(trackOrder("1234"));
manager.execute(cancelOrder("1234"));
manager.undo(); //undo the cancel
manager.redo(); //redo the cancel order

//through command pattern, execution of undo/redo/batching updates becomes a lot cleaner and decoupled, since each action is represented by an object
