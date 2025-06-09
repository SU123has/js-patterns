/**
 * Chatroom is a classic exmaple of the mediator pattern, where the users dont directly interact with each other, rather they interact directly to the middleware which is the classroom.
 */

class User {
  private readonly name: string;
  private readonly chatroom: Chatroom;

  constructor(name: string, chatroom: Chatroom) {
    this.name = name;
    this.chatroom = chatroom;
  }

  public get getName() {
    return this.name;
  }

  public send(message: string) {
    this.chatroom.logMessage(this, message);
  }
}

class Chatroom {
  public logMessage(user: User, message: string) {
    const time = new Date();
    const sender = user.getName;

    console.log(`${sender} : ${message} (${time})`);
  }
}

const chatroom = new Chatroom();
const sam = new User("Sam", chatroom);
const lex = new User("Lex", chatroom);
const taylor = new User("Taylor", chatroom);

sam.send("Hey Everyone");
lex.send("Hii!");
