/*Class-based Static property Singleton implementation
Characteristics:
1. All the state is encapsulated inside the class
2. Only class can create the instance via private constructor and static method.
3. We must use the Counter.getInstance to get the singleton instance, instead of constructor
4. Cannot make the object immutable using the Object.freeze() as state management is being done inside the class
5. Hence in this case, we cannot make the public methods 100% tamper-proof, we can freeze the prototypes, or use closures to encapsulate the state and methods
*/

class Counter {
  private static instance: Counter | null = null;
  private count = 0;

  //prevent the constructor from being called from outside the class
  private constructor() {}

  public static getInstance() {
    //if instance is null -> no Counter instance exists yet, so we instantiate a instance of the class Counter, else we return a already existing instance
    Counter.instance ??= new Counter();
    return Counter.instance;
  }

  public increment() {
    this.count++;
  }

  public decrement() {
    this.count--;
  }

  public getCount() {
    return this.count;
  }
}

const singletonCounter = Counter.getInstance();
export default singletonCounter;
