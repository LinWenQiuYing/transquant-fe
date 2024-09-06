export default function useTableScroll(options: {
  ref: React.RefObject<HTMLDivElement>;
}): {
  scrollToEnd: (count: number) => void;
} {
  const { ref } = options;
  const scrollToEnd = (count: number) => {
    const baseHeight = 40;
    const scrollElement = ref?.current?.getElementsByClassName(
      "trans-quant-antd-table-body"
    )[0];
    const cellHeight =
      ref?.current
        ?.getElementsByClassName("trans-quant-antd-table-cell ")[0]
        .getBoundingClientRect().height || baseHeight;
    if (!scrollElement) return;

    setTimeout(() => {
      scrollElement.scrollTop = count * cellHeight;
    }, 0);
  };

  return {
    scrollToEnd,
  };
}
