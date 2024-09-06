import DataResourceStore from "./DataResource";
import EnvStore from "./Env";
import FactorResearchStore from "./FactorResearch";
import GroupFactorStore from "./GroupFactor";
import GroupStrategyStore from "./GroupStrategy";
import HomeStore from "./Home";
import ImageStore from "./Image";
import PublicFactorStore from "./PublicFactor";
import PublishStore from "./Publish";
import ShareSpaceStore from "./ShareSpace";
import StrategyResearchStore from "./StrategyResearch";
import ThirdPartyStore from "./ThirdParty";

const stores = {
  factorResearchStore: new FactorResearchStore(),
  strategyResearchStore: new StrategyResearchStore(),
  thirdPartyStore: new ThirdPartyStore(),
  envStore: new EnvStore(),
  imageStore: new ImageStore(),
  dataResourceStore: new DataResourceStore(),
  groupFactorStore: new GroupFactorStore(),
  groupStrategyStore: new GroupStrategyStore(),
  publishStore: new PublishStore(),
  publicFactorStore: new PublicFactorStore(),
  homeStore: new HomeStore(),
  shareStore: new ShareSpaceStore(),
};

export default stores;
