type NotificationType = (message: string) => void;

const emailNotification: NotificationType = (message) => {
  console.log(`Sending email: ${message}`);
};

const smsNotification: NotificationType = (message) => {
  console.log(`Sending sms: ${message}`);
};

const pushNotification: NotificationType = (message) => {
  console.log(`Sending push notification: ${message}`);
};

//this function will be responsible for creation of required object based on supplied type,a nd is a pure function
const notificationFactory = (type: string) => {
  //mapping from type to implementation
  const notificationRegistry: Record<string, NotificationType> = {
    email: emailNotification,
    sms: smsNotification,
    push: pushNotification,
  };

  const notification = notificationRegistry[type];
  if (!notification) throw new Error(`Unknown notification type!: ${type}`);
  return notification;
};

//------------------usage-------------------------

const userPreference = "sms";

const notify = notificationFactory(userPreference);
notify("Your order has been shipped!");
