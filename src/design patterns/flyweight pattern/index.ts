/**
 * Imagine a text editor where each character on the screen is an object. If you store font, size, color, etc., in every character object, memory usage explodes for large documents. Instead, you can share formatting objects (the flyweights) among characters with the same style.
 */

class CharaterFormat {
  public readonly font: string;
  public readonly size: number;
  public readonly color: string;

  constructor(font: string, size: number, color: string) {
    this.font = font;
    this.size = size;
    this.color = color;
  }
}

class FlyweightFactory {
  //storing the formats in an object with string font_size_color as key
  private readonly formats: Record<string, CharaterFormat>;
  public static count: number; //this property will be shared among all the instances
  constructor() {
    this.formats = {};
    FlyweightFactory.count = 0;
  }

  public getFormat(font: string, size: number, color: string) {
    const key = `${font}_${size}_${color}`;
    if (!this.formats[key]) {
      this.formats[key] = new CharaterFormat(font, size, color);
      FlyweightFactory.count++;
    }

    return this.formats[key]; //returns a object having font, size, color properties -> instrinsic state
  }
}

//extrinsic state
class Character {
  private readonly char: string;
  private readonly format: CharaterFormat;

  constructor(char: string, format: CharaterFormat) {
    this.char = char;
    this.format = format;
  }

  public display() {
    console.log(
      `Char: ${this.char}, Font: ${this.format.font}, Size: ${this.format.size}, Color: ${this.format.color}`
    );
  }
}

//----------usage--------------------------

const flyweightFactory = new FlyweightFactory();

const format1 = flyweightFactory.getFormat("Arial", 12, "black");
const format2 = flyweightFactory.getFormat("Arial", 12, "black"); // Returns same object as format1
const format3 = flyweightFactory.getFormat("Times", 14, "red");

const chars: Array<Character> = [];

//function to enter the character into the char collection
function enter(char: string, format: CharaterFormat) {
  const entry = new Character(char, format);
  chars.push(entry);
}

enter("A", format1);
enter("B", format2);
enter("C", format1);
enter("D", format3);
enter("E", format1);

//here we have 5 character instances but only 2 character format instances, as they are shared.

chars.forEach((char) => console.log(char));

console.log(
  `Total number of characterFormat instances: ${FlyweightFactory.count}`
);

console.log(`Total number of character instances: ${chars.length}`);
