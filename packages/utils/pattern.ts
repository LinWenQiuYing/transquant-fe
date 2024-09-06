/**
 * 策略模式
 * @param actions
 */

export type StrategyAction = [boolean, () => void];

export default function execStrategyActions(actions: StrategyAction[]) {
  actions.some((item) => {
    const [flag, action] = item;
    if (flag) action();

    return flag;
  });
}
