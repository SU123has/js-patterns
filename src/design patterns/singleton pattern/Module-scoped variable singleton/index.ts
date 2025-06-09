/*Module-scoped variable Singleton implementation:
Characteristics:
1. Count and instance are not properties of a class, but of module, and since this module is imported into other modules, only one instance is shared across all the other modules
2. We enforce singleton by throwing an error in case the instance is already allocated (not null)
3. We must use the new keyword to create a singleton, but only once.
4. We can freeze the Object instance, as state management is being done in the module, instead of the class.

****************BEST APPROACH***************************

*/

let count = 0;
let instance: Counter | null;

class Counter {
  constructor() {
    if (instance) {
      throw new Error("Counter class is already instantiated!");
    }
    //freezing the Object to prevent accidental modifications of the singleton by the consuming code
    instance = Object.freeze(this);
  }

  public getInstance() {
    return this;
  }

  public increment() {
    count++;
  }

  public decrement() {
    count--;
  }

  public getCount() {
    return count;
  }
}

const singletonCounter = new Counter();
export default singletonCounter;
