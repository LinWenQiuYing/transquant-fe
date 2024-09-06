import LabelStore from "./Label";
import MessageStore from "./MessageStore";
import ProfileStore from "./Profile";
import PublishStore from "./Publish";

const stores = {
  profileStore: new ProfileStore(),
  messageStore: new MessageStore(),
  publishStore: new PublishStore(),
  labelStore: new LabelStore(),
};

export default stores;
