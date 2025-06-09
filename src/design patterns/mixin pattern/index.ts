//defining the mixins
const CanFly = {
  move(this: any) {
    console.log(`${this.name} flies through the air.`);
  },
  fly(this: any) {
    console.log(`${this.name} is flying.`);
  },
};

const CanSwim = {
  move(this: any) {
    console.log(`${this.name} swims in the water.`);
  },
  swim(this: any) {
    console.log(`${this.name} is swimming!`);
  },
};

const CanSing = {
  sing(this: any) {
    console.log(`${this.name} is singing!`);
  },
};

//utility function to check for property/method conflicts before applying the mixin, instead of using the Object.assign()
/**
 *
 * @param target  target object where mixins are to added.
 * @param mixins  array of mixins to be added.
 */

function safeMixin(target: any, ...mixins: Array<Record<string, any>>) {
  for (const mixin of mixins) {
    for (const key of Object.keys(mixin)) {
      if (key in target) {
        throw new Error(`Conflict: ${key} already exists on target!`);
      } else {
        target[key] = mixin[key];
      }
    }
  }
}

//defining the classes
class Duck {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Penguin {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

class Parrot {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

//@ts-ignore
// safeMixins(Duck.prototype, CanSwim, CanFly); //Error!

const DuckMixins = {
  ...CanFly,
  ...CanSwim,
  move(this: any) {
    //Csutom resolution: call both the move functions\
    //need to bind the function with the this, as when I use the donald.move(), it will the custom function which is defined above that will be called instead of the one defined in mixins, JS passes the this context to the custom function, but inside the custom function we need to bind the context of this to the mixin's functions too.
    CanFly.move.call(this);
    CanSwim.move.call(this);
  },
};

safeMixin(Duck.prototype, DuckMixins); //no error

safeMixin(Parrot.prototype, CanSing); //no error

const donald = new Duck("Donald");
//asserting as any to avoid TS errors
(donald as any).fly();
(donald as any).swim();
(donald as any).move();

const polly = new Parrot("Polly");
(polly as any).sing();
