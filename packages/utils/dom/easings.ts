/**
 * 缓动函数 easeInOutCubic
 * @param t 动画开始时间
 * @param b 起始位置
 * @param c 终止位置
 * @param d 持续时间
 * @returns
 */

// eslint-disable-next-line import/prefer-default-export
export function easeInOutCubic(t: number, b: number, c: number, d: number) {
  const cc = c - b;
  t /= d / 2;
  if (t < 1) {
    return (cc / 2) * t * t * t + b;
  }
  // eslint-disable-next-line no-return-assign
  return (cc / 2) * ((t -= 2) * t * t + 2) + b;
}
