type Callback = (...args: any[]) => void;

class EventBus {
  //object containing callback arrays
  private topics: { [event: string]: Callback[] };

  constructor(...initialTopics: string[]) {
    this.topics = {};

    initialTopics.length > 0 &&
      initialTopics.forEach((topic) => (this.topics[topic] = []));
  }

  //subscribers subsribe to the event bus mentioning the kind of event they want to subscribe and the callback that should be trigerred
  public subscribe(event: string, fn: Callback) {
    if (!this.topics[event]) {
      this.topics[event] = [];
    }
    this.topics[event].push(fn);
  }

  public unsubsribe(event: string, fn: Callback) {
    if (!this.topics[event]) {
      console.error("Cannot find the callback to remove!");
      return;
    }
    this.topics[event] = this.topics[event].filter((cb) => cb !== fn);
  }

  //which topic to publish along with the necessary datalist
  public publish(event: string, ...args: any[]) {
    if (!this.topics[event]) {
      console.error("Cannot find the event in the eventBus");
      return;
    }
    this.topics[event].forEach((cb) => cb(...args));
  }
}

const bus = new EventBus();

function subscriber1(data: any) {
  console.log(`Subscriber 1 received: ${data}`);
}
function subscriber2(data: any) {
  console.log(`Subscriber 2 received: ${data}`);
}
function subscriber3(data: any) {
  console.log(`Subscriber 3 received: ${data}`);
}

bus.subscribe("news", subscriber1);
bus.subscribe("news", subscriber2);
bus.subscribe("entertainment", subscriber3);

function publishNews() {
  //all the subsribers subscribed to the news event will be notified
  bus.publish("news", "Breaking news!");
}

function publishEntertainment() {
  //all the subsribers subscribed to the entertainment event will be notified
  bus.publish("entertainment", "Latest movies and series");
}

publishNews();
publishEntertainment();
