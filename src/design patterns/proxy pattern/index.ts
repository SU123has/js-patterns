const person = {
  name: "John Doe",
  age: 30,
  nationality: "American",
};

//using mapped sets for type-safety
type PersonProp = keyof typeof person;
type PersonValue<P extends PersonProp> = (typeof person)[P];

//creating a procy object using the built-in proxy object provided by JS.
const personProxy = new Proxy(person, {
  get: (target: typeof person, prop: PersonProp): any => {
    if (!target[prop]) {
      console.log("This property doesnt seem to exist to the target object!");
    } else {
      console.log(`The value of ${prop} is ${Reflect.get(target, prop)}`);
      return Reflect.get(target, prop);
    }
  },

  set: <P extends PersonProp>(
    target: typeof person,
    prop: PersonProp,
    value: PersonValue<P>
  ): boolean => {
    if (prop === "age" && typeof value === "number" && value < 0) {
      console.log(
        `Sorry, you can only pass positive numberic values for the age.`
      );
      return false;
    } else if (
      prop === "name" &&
      typeof value === "string" &&
      value.length < 2
    ) {
      console.log("Please provide a valid name!");
      return false;
    } else {
      console.log(
        `Changed the ${prop} from ${Reflect.get(target, prop)} to ${value}`
      );
      Reflect.set(target, prop, value);
      return true;
    }
  },
});

// test -> all should show error messages in the console

// personProxy.someNonExistentProperty
// personProxy.age='random'
// personProxy.name="S"
