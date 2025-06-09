class Observable {
  //Observers is an array of callbacks which can take arbitrary number of args
  private observers: Array<(...args: any[]) => void>;

  constructor() {
    //initializing an empty observers list
    this.observers = [];
  }

  public subscribe(fn: (...args: any[]) => void): void {
    this.observers.push(fn);
  }

  public unsubscribe(fn: (...args: any[]) => void): void {
    this.observers = this.observers.filter((observerCb) => observerCb !== fn);
  }

  //we can pass arbitrary number of data to the callbacks
  public notify(...args: any[]): void {
    this.observers.forEach((observerCb) => observerCb(...args));
  }
}

const observable = new Observable();

function observer1(data: any) {
  console.log(`Observer 1 received:${data}`);
}

function observer2(data: any) {
  console.log(`Observer 2 received:${data}`);
}

observable.subscribe(observer1);
observable.subscribe(observer2);

function emitNotification(data: any) {
  observable.notify(data);
}

emitNotification("Hello observers!");

observable.unsubscribe(observer1);

emitNotification("This message is only received by observer 2");

//Future improvement: we can have an interface for the observers and instead of subscribing the callbacks, we can subscribe to the observer object, then we can have the Observable call a specified update method on observer whenever its need to send notification. -> much closer to real world implementation.
