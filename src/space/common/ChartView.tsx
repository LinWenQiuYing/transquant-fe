/* eslint-disable camelcase */
import { ECOption, useEcharts } from "@transquant/utils";
import React from "react";
import { grey400, presetColor } from "../home/helpers";

type MarketData = {
  datetime: string;
  close: number;
};

type TradeData = {
  dateTime: string;
  price: number;
  type: number; // 0 买入平仓、1 卖出开仓、2 买入开仓、3 卖出平仓、4 买入、 5 卖出
};

export const tip = {
  0: "买入平仓",
  1: "卖出开仓",
  2: "买入开仓",
  3: "卖出平仓",
  4: "买入",
  5: "卖出",
};

export type DataType = {
  marketDataList: MarketData[];
  tradeList: TradeData[];
};

type ChartViewProps = {
  data: DataType;
  selectedKey: string;
};

const icon = {
  0: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQuSURBVHgBxVZNbBNHFH6ztkOJkspVIrVQ0ZqqIj01TkJCkx7qSBxrSg5V1V5YS2loe6Ll1FPWp15IG27FocrmUkRPaZNjEe6hMZAYDOIAuSQQYQQ4wuJXib07vDdeb/ZnNjZc+KTVzs6b+fbNvF8GEqiJK9Hwow1VYewzziEOjMUsUYEBX+Wc/T11eUCX7WXeibG+pcMmmNMoiNJ3a3sIdraFhWz97oZz6SpwSHuJXYRjvYu/ccaP0TieiMLBr9+BfX3trh8u5x/DwnwJFuZKNQLOtMzl/rSPcLR3cZwxrnXsaoGU9oGPyAsi1rUVKKHWjLHJzFL/jzbht72XVBxNE9nxUx9B5+4d0AzWixswcfSmIDWBj/yRPzCrWHqO0ys59q6P7NljA04cvQE/J69BqbjpknXgWlXbK8YKsGk1fiUasrRT6YhfHX/PRzaBZCvXn8LzJwYUsmW827eEoZykN/NPyGBvKKx6T0EjHCbB0OednuNsCrK15Wdbc3c3xJxX06FkR+2gDBLoaux9+tjT1SolS47tRgO9KTRJje+Vknb11g2odCtAjkuE+7YIiYgumsjoXusYTHbapFf/e+g6toVYGCQgH/zln4+dC12k3ShvbZduReNgKNGgVHRFgZSsDi+Zfc8MCgoHuErj3HwJXhU2ITdv4R3yLI0X5tbhVTF/qmgRKrNK1dyh47BMF/3XxG3pBvK71raQVDaXKdbCD5MFJQor9HLo3KFpGqtoxaFkJzQDShB6esXSDlI2oSDtWzyPswkae93FC4qgucwdOHfmnvgm7TL5ARGDtrk4q6YZDyXqx6A77drfLiJop3XkteXnGGaP0IDrSFq1f6AYxnB97MqHo30XUWV2BF4O+lR+IGWTOyVhw9TwVYbmUQ4ZRto54SL8vTCI9YKfhCaBCfkk7QkkJFTNlkm6ZGhERoZYOqB5532EeqGnbDIjBQ2A1TAd8CM5nG4kQRYNMSwTKBCkAbpRkAwNEXiCQMLTS4NZE0BmIN1riKYICYYR0cDhRmQIr5u8FCEZCJTKMKa4rHiMysh22r0+fBfPxehpZm2g26if5GLhiqLhki/qjVMNil6JVNL6BfnRpYRq///xsBk5Xyfq2FWrL47uaxXvdmRq8dNCQ0LSLFIJoVNDrAe7hC9/2mO3J9TLnP11DTsIUUJXK0akRxjOAZ+Va8eEGLUm35/40NXrUCX8Aeeo8NOaFmXzmHe/jxA7iW56H9omYx/CjE7gzJ87/X5odRLb9YcOWawxoRUZVDeCsJ1MQsiE5XLzDwI3Fbb6mmxjQl6dode/f973tW0E6sy2CjvM+NQBCeq5kPzv4Ddvi86MKh+5y7kz90XFo9g+LcmJ0haqYoRHwqHNSXTkI2el3QSfbTNapDkxMPQIo/tzCexXVFxGTWkUFxc4M2YoVwbteQFg4MUYOD+mVwAAAABJRU5ErkJggg==",
  1: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQrSURBVHgBxVZNTBtHFH6zXoNAUDkyUkta1E1VQaUeMDiQhh5ipBxLGg49tJcsEiVtT7TpsRLre9KSW4FULJcgeqIKx6K4h8ZtwcS9NVxCS0P+bMUKEhHYu5P3xl5nvTuLTS75pNXOzpv59r15P/MYSKAnbkfUp/u6wtgZziEGjGkVUZYB3+Kc/TK3MWjK9jLvxER8/bwN9jwKIvTd2h6CljZVyPL3991Lt4BD0ktcQzjRv/YDZ3ySxrFEBM5++gZ0x9trfriZ2YVbKzm4dSNXJuDMmN0YSPoIx/vXphjjRrSzCcaMd3xEXhCxadyFHGrNGJueXR/4ukr4ef9fOo7miezSzHvQcbwZGkF+Zx+uXLwjSG3goz9lTi0rFT2n6DUy8aaUbOnKf3D54j+++Siu1Y0TYqwAm9djtyOK0A5AIxOHRjqkmmxvPkOHHEhltK87/hoNI6qCkYFOOE9fQx/JyRrB0EhUvBmDBIYae5s+unpa4WXR0+84UOlVgAKXCLtrCfd2rUACryz64tw1RbYhmyrA5PAG3Ji955NR/JFsdfGBbCtgCvAttF7LYQg4Hu7qboGOzmYk3PGRmcm7QOHVe+ZYdX57c688YJBVOMDfNE6v5GpMuDTTUyX9Hzc82y1VybyxWiXk9r94hjxV/nsevOfy3fX34S082z0ko3MLCvyVmYolXFlWSnazicMCJf7PGMBuUGH4FgmINIiMLBDph8WCCkUl9dKYeqF5GutTJwID3AvnTMvawViVUJDG127ibILGIxPHRRoGgcynCFhdfCi+SbvZzKDIQdVZxFkpyXgo4ZhBZ9pzsl1kUAua3toWEil4J/MUHZgX5+pAsaxhZ1xTD8fjf6LK7AIcDeZcZnCsSu6WqJZt4KsAjaMQsqyke6KG8Mfsabwv+FVoEFiQr9KeQEJCyW6apkOGemTkiPVThnfeR2hm+wo2s8agDvA2TAb8SA53GEmQQkcMywQKBGmAYRQkQ0cEWhBIeG39dMoGkDnI9DqiIUKCZYUNcIUROcIbJkciJAeBUhzGEpcSj1UcPUy7V4cvYmmNnkbWBoaN/kFaU4uKgUs+dhqnMhSzGC4mzT/kpksJ9YHfY6odvukQRTvLRdXVfW3h2Y7OrX2YrUtImoWLIQxq0PoSx+CTb7qqVZp6maXvt/FWfCJIi1a4TzjOBZ+Xy2aWW5MvL79bU/LpnvkK5yqth9akHEx69/sIsZPopfe5Qyr2OazoBM78tdMfh5VO4rD+0CXT6hNWMuMorUgdQiY8l155HLgp+9sTZ5iqT8hLC/T69fojyO34e8I8zr242GHBpw5I4NRCir+zn70uOjO6+ShcVhcfiRuPcvuapCaqMsKipY6qoYNpDOQLS55uoqLacpvVJK2JgalHGD+ZTmC/ouMyakojuDjLmbVAtTJoz3PqHLRGLNpd+gAAAABJRU5ErkJggg==",
  2: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOCSURBVHgBzVc9aFNRFD7nUtoOokVoGwdrCrpYwRYUQRAjLjpZBXFsonSv0FWa4mhBuyo26ZbqUqe6pYuCODSCdjAdXutgqliKukTsO55z37svee/dl6Sd/CDk5d57vnfu+Q+CBVTo63PdnqxScBkIRgkgLeuIUOEvZ8/FV133akWbLMbJBsaJoMBbfXqh+zBg9xFv7/eX5qOOSzgbJcYw2eBjJpvSG0PXAUYmAVIXw2+svQWoLgFtLHkESHnMfZsFi2Yz7sIguS/OEX19Q23BZ+SsyIgiEbJUNiD7tUUdg882SAfGhUt5jDSj1R+bBjh0PKz6n59AK7eAXp4HCNtQn8VL8z4FFsSZSrQTL6LY6uQdK5m2G5Pp5yipyHl29iKDFdeqwqkImSHY+Rhfi5CirwiHVYavTCf0r6MjVjJtBtHAXM9GeiyIhLNMiKMe4ZnGgZ1PWkCTjU431lkTQwpbK9BsSx/pLrBh6Brg7fdxBxlSiVEOeBsUR7ZjrhmCjcwgSiY38lBR7OEP+rG6BAfGj8Bxm+xlWJUnk0oHAVXm9Dfn9rJSql7kpV3tvXcP7BJSHBJsRmtzxlxOUCiC1JMUqpY6zjz3c4mM3N/nqaxwBdWGFgbLbM+M/sGhokMmCZJBa48A1p+ZFUfd3R4OExZSGX5pORASL3NA6yyQ68q12ZskabhR0qQGiDiMuZoTIhTsLaSKCDQB+wCTFZksZ36r5k0Oyrx2UMfQZ0PFNUQoahOpeegQctZcNeCIHeKaBtSzZhpTCwSOSNTQ03J3lw2TgzaQBmVbxySBUBhFhRBWMbd9xbanIAlo18DfTLyBShaprbKG8/H36DBx9k2oN7Gej4SRA5Ewib0Q2oAK/VzRld933fuY+16B/w6c52n5dHIWW5G45Ob5wI1gcBIBoiIoNZvkGLST9Y/yJFA2ROj3l6bpy0F0b9rsiTbNOEnLeprg7gcXHjYalqnqW6990vqYzqwmxMJGrhmMJleL4e4nzV7WvNEj7bq9U1H5eC5z99cPLSq2qeY8G060JQwmieig2YzGXroDQj8zmkp8DC32LFdGz3PVUqIQbHpzjVSdtoR8alG+SDpadDwRiKf9xs7/BhbjClkQ1ELx6ulJbzLjzkcSLutP9ZWTamJCYPP/FOp9ktQBmWwZoJ6LxmAiYYM4lXEJsgplKCXJGravWpRamSTzD2ybFxqLK5BhAAAAAElFTkSuQmCC",
  3: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOVSURBVHgBzVc/TFNhEL/7QoDBKNEAdRBKog5iIiQmJiZGjItMoIsjVMMsJqyGNo6SKCtGWgaT1kFxgsWUQU2cqAkwWIYHDhaNBP8sJfLOu+/re+371xYnL2n63nd3v++++/fdQwghSnd02HbbuFJwFQgGCCAu64hQ4D/rwMbXLXdLmTBdDIJ1jRJBmlkdeqH1KGDrMcP7/blW1LIJU35g9IJ1P2awSc3oGQbonwCIXfbuWHoPUMwBbeYMAFISE19TEGLZtD3fTfaLi0Rf3lFDYhmRFR0xxAcWG3fBfm1T08SyVdCuUcFSBpGmtfmDUwBHTgWt//AAaOlWYF1k8cpsBQLTEkwl1kkUUXx1+jaE0u46gDcgVRI942eTGWy4NhXORIA1QVgxhNNqiI9MvfrteD/8M510M+ECA+KAATzvFdr/GQ3g51X9HlehClvLQM/PAq3OBFgkOcg8WJ8LVW3hzLZ0aYnTnZ1O9JvnwgxXnhcM3t4zvN7hKkOCZqigWOGjfizmPEfA4ZcuKOyumWNWwFyeQ9/X3LNxlGFF776ZA79fcOSNCZaA7f8IBxPdgnEN1/aiUqqc4aU9ObIksIekMQy/MqBRYOJnk6OW2yjc0pMSKmabrjz7U5YcvT/PYuOC5XYbmu/Osz+H9MvAlCnDKGIX0OojgI2nzoql7uz0eQHTsSHeNF/rQykpXQV8dJCeyNEkaV+bWU8uImIfJkqWB1DoYD6WQaAxOAQxWIbBEs67J7EVQlIHqGnSsp7m6gEUs4nULDRJIusc1cUICHFPA2pbdS6mOuQGItJCY+XeHjsmAQ1ILqiwdYxS8KSRXwlhBRM718J44d3GaKUgmhl5AhWtUlphC2eD++g0sQ4NqJlYTvrSyAJfmgQ2hAZE6U7u6Kpy79r3MfGtAP8dcZ3H5deMLNYDsclOssCIOziJAlEGlEpFBQbDwToHeBLIO0BYaao105eFaN8M8yeGWcZFmtfTRM8NgEsPq13a6erbyxXQ8qCurBoKpI0c0x1Nrme8LV+uAVkzo0fcttsn/frBWubbXz/U6dhON+fZcKwhoDtJ+AfNWqry4k0AVirjMKNIPUAENJErZiOVYGvJyKK50+sCstSC/JHcaGEzoUS6crHz18BC0KAQcnuhRPXchJnM+OYjSZeNOX3kqJ4Ykdj8nULtT6JuQAZbBCgn/DkYCVgFjg3ZBOMKZSglqRr2r1qQXhml8xdLeRBRaJeXGgAAAABJRU5ErkJggg==",
  4: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQuSURBVHgBxVZNbBNHFH6ztkOJkspVIrVQ0ZqqIj01TkJCkx7qSBxrSg5V1V5YS2loe6Ll1FPWp15IG27FocrmUkRPaZNjEe6hMZAYDOIAuSQQYQQ4wuJXib07vDdeb/ZnNjZc+KTVzs6b+fbNvF8GEqiJK9Hwow1VYewzziEOjMUsUYEBX+Wc/T11eUCX7WXeibG+pcMmmNMoiNJ3a3sIdraFhWz97oZz6SpwSHuJXYRjvYu/ccaP0TieiMLBr9+BfX3trh8u5x/DwnwJFuZKNQLOtMzl/rSPcLR3cZwxrnXsaoGU9oGPyAsi1rUVKKHWjLHJzFL/jzbht72XVBxNE9nxUx9B5+4d0AzWixswcfSmIDWBj/yRPzCrWHqO0ys59q6P7NljA04cvQE/J69BqbjpknXgWlXbK8YKsGk1fiUasrRT6YhfHX/PRzaBZCvXn8LzJwYUsmW827eEoZykN/NPyGBvKKx6T0EjHCbB0OednuNsCrK15Wdbc3c3xJxX06FkR+2gDBLoaux9+tjT1SolS47tRgO9KTRJje+Vknb11g2odCtAjkuE+7YIiYgumsjoXusYTHbapFf/e+g6toVYGCQgH/zln4+dC12k3ShvbZduReNgKNGgVHRFgZSsDi+Zfc8MCgoHuErj3HwJXhU2ITdv4R3yLI0X5tbhVTF/qmgRKrNK1dyh47BMF/3XxG3pBvK71raQVDaXKdbCD5MFJQor9HLo3KFpGqtoxaFkJzQDShB6esXSDlI2oSDtWzyPswkae93FC4qgucwdOHfmnvgm7TL5ARGDtrk4q6YZDyXqx6A77drfLiJop3XkteXnGGaP0IDrSFq1f6AYxnB97MqHo30XUWV2BF4O+lR+IGWTOyVhw9TwVYbmUQ4ZRto54SL8vTCI9YKfhCaBCfkk7QkkJFTNlkm6ZGhERoZYOqB5532EeqGnbDIjBQ2A1TAd8CM5nG4kQRYNMSwTKBCkAbpRkAwNEXiCQMLTS4NZE0BmIN1riKYICYYR0cDhRmQIr5u8FCEZCJTKMKa4rHiMysh22r0+fBfPxehpZm2g26if5GLhiqLhki/qjVMNil6JVNL6BfnRpYRq///xsBk5Xyfq2FWrL47uaxXvdmRq8dNCQ0LSLFIJoVNDrAe7hC9/2mO3J9TLnP11DTsIUUJXK0akRxjOAZ+Va8eEGLUm35/40NXrUCX8Aeeo8NOaFmXzmHe/jxA7iW56H9omYx/CjE7gzJ87/X5odRLb9YcOWawxoRUZVDeCsJ1MQsiE5XLzDwI3Fbb6mmxjQl6dode/f973tW0E6sy2CjvM+NQBCeq5kPzv4Ddvi86MKh+5y7kz90XFo9g+LcmJ0haqYoRHwqHNSXTkI2el3QSfbTNapDkxMPQIo/tzCexXVFxGTWkUFxc4M2YoVwbteQFg4MUYOD+mVwAAAABJRU5ErkJggg==",
  5: "image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAqCAYAAACz+XvQAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQrSURBVHgBxVZNTBtHFH6zXoNAUDkyUkta1E1VQaUeMDiQhh5ipBxLGg49tJcsEiVtT7TpsRLre9KSW4FULJcgeqIKx6K4h8ZtwcS9NVxCS0P+bMUKEhHYu5P3xl5nvTuLTS75pNXOzpv59r15P/MYSKAnbkfUp/u6wtgZziEGjGkVUZYB3+Kc/TK3MWjK9jLvxER8/bwN9jwKIvTd2h6CljZVyPL3991Lt4BD0ktcQzjRv/YDZ3ySxrFEBM5++gZ0x9trfriZ2YVbKzm4dSNXJuDMmN0YSPoIx/vXphjjRrSzCcaMd3xEXhCxadyFHGrNGJueXR/4ukr4ef9fOo7miezSzHvQcbwZGkF+Zx+uXLwjSG3goz9lTi0rFT2n6DUy8aaUbOnKf3D54j+++Siu1Y0TYqwAm9djtyOK0A5AIxOHRjqkmmxvPkOHHEhltK87/hoNI6qCkYFOOE9fQx/JyRrB0EhUvBmDBIYae5s+unpa4WXR0+84UOlVgAKXCLtrCfd2rUACryz64tw1RbYhmyrA5PAG3Ji955NR/JFsdfGBbCtgCvAttF7LYQg4Hu7qboGOzmYk3PGRmcm7QOHVe+ZYdX57c688YJBVOMDfNE6v5GpMuDTTUyX9Hzc82y1VybyxWiXk9r94hjxV/nsevOfy3fX34S082z0ko3MLCvyVmYolXFlWSnazicMCJf7PGMBuUGH4FgmINIiMLBDph8WCCkUl9dKYeqF5GutTJwID3AvnTMvawViVUJDG127ibILGIxPHRRoGgcynCFhdfCi+SbvZzKDIQdVZxFkpyXgo4ZhBZ9pzsl1kUAua3toWEil4J/MUHZgX5+pAsaxhZ1xTD8fjf6LK7AIcDeZcZnCsSu6WqJZt4KsAjaMQsqyke6KG8Mfsabwv+FVoEFiQr9KeQEJCyW6apkOGemTkiPVThnfeR2hm+wo2s8agDvA2TAb8SA53GEmQQkcMywQKBGmAYRQkQ0cEWhBIeG39dMoGkDnI9DqiIUKCZYUNcIUROcIbJkciJAeBUhzGEpcSj1UcPUy7V4cvYmmNnkbWBoaN/kFaU4uKgUs+dhqnMhSzGC4mzT/kpksJ9YHfY6odvukQRTvLRdXVfW3h2Y7OrX2YrUtImoWLIQxq0PoSx+CTb7qqVZp6maXvt/FWfCJIi1a4TzjOBZ+Xy2aWW5MvL79bU/LpnvkK5yqth9akHEx69/sIsZPopfe5Qyr2OazoBM78tdMfh5VO4rD+0CXT6hNWMuMorUgdQiY8l155HLgp+9sTZ5iqT8hLC/T69fojyO34e8I8zr242GHBpw5I4NRCir+zn70uOjO6+ShcVhcfiRuPcvuapCaqMsKipY6qoYNpDOQLS55uoqLacpvVJK2JgalHGD+ZTmC/ouMyakojuDjLmbVAtTJoz3PqHLRGLNpd+gAAAABJRU5ErkJggg==",
};

const ChartView = React.memo((props: ChartViewProps) => {
  const { data, selectedKey } = props;

  const option: ECOption = {
    tooltip: {
      show: true,
      trigger: "axis",
      className: `echarts-tooltip-light`,
      axisPointer: {
        type: "cross",
      },
      confine: true,
      formatter: (params) => {
        const [line, scatter] = params as Array<any>;
        let txt = `${line.marker}${line.seriesName}   ${line.value[1]}`;

        if (scatter) {
          const key = scatter?.data?.type || 0;
          txt += `<br>${scatter.marker}${tip[key as keyof typeof tip]} ${
            scatter.value[1]
          }`;
        }
        return txt;
      },
    },
    grid: {
      left: "6%",
      right: "6%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        lineStyle: {
          color: grey400,
        },
      },
      data: data?.marketDataList.map((item) => item.datetime),
    },
    axisTick: {
      lineStyle: {
        color: grey400,
      },
    },
    axisLabel: {
      color: grey400,
    },
    yAxis: {
      type: "value",
      scale: true,
      splitNumber: 4,
    },
    dataZoom: {
      type: "slider",
      start: 0,
      end: 100,
    },
    series: [
      {
        type: "line",
        name: selectedKey,
        symbol: "circle",
        symbolSize: 0,
        lineStyle: {
          color: presetColor[0],
        },
        itemStyle: {
          color: presetColor[0], // 小圆点和线的颜色
        },
        data: data?.marketDataList.map((item) => ({
          value: [item.datetime, item.close],
        })),
      },
      {
        type: "scatter",
        symbolSize: [16, 32],
        symbol(rawValue, params) {
          return icon[
            (params.data as { type: number }).type as keyof typeof icon
          ];
        },
        symbolOffset: [0, "-50%"],
        data: data?.tradeList.map((item) => ({
          type: item.type,
          value: [item.dateTime, item.price],
        })),
      },
    ],
  };

  const { domRef } = useEcharts<HTMLDivElement>(option);

  return (
    <div
      ref={domRef}
      className={`${
        selectedKey === undefined ? "invisible" : "visible"
      } h-[400px] `}
    />
  );
});

export default ChartView;
