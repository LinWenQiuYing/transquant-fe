import dayjs from "dayjs";

const formatTime = (dateTime: number) => {
  // 兼容 ie11
  const _dateTime = dayjs(dateTime).format("YYYY/MM/DD HH:mm:ss");

  // 友好时间显示
  const now = dayjs();
  const baseDate = _dateTime ? dayjs(new Date(_dateTime)) : now;
  const yesterDay = dayjs().subtract(1, "day");
  const diff = now.diff(baseDate, "minute");

  let showText = "";
  if (diff < 5) {
    // 5分钟
    showText = "刚刚";
  } else if (diff < 60) {
    // 1小时内
    showText = `${diff}分钟前`;
  } else if (diff < 60 * 24) {
    // 24小时内
    showText = `${Math.floor(diff / 60)}小时前`;
  } else if (baseDate.isSame(yesterDay, "day")) {
    showText = `昨天`.concat(baseDate.format("HH:mm"));
  } else if (baseDate.isSame(now, "year")) {
    showText = baseDate.format("MM月DD日");
  } else {
    showText = baseDate.format("YYYY年MM月DD日");
  }

  return showText;
};

export default formatTime;
