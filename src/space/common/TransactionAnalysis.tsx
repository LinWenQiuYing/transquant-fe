/* eslint-disable camelcase */
import { PUBLICURL } from "@transquant/constants";
import { AnyObject } from "@transquant/utils";
import { useMount } from "ahooks";
import { Descriptions, Empty, Select, SelectProps, Spin } from "antd";
import { useState } from "react";
import { Else, If, Then } from "react-if";
import { CodeType } from "./api";
import ChartView, { DataType } from "./ChartView";

interface TransactionAnalysisProps {
  id: number;
  getCode: Function;
  getTradeAnalysis: Function;
}

const futureTitles = [
  {
    label: "买入平仓",
    path: `${PUBLICURL}/images/type_0.svg`,
  },
  {
    label: "卖出开仓",
    path: `${PUBLICURL}/images/type_1.svg`,
  },
  {
    label: "买入开仓",
    path: `${PUBLICURL}/images/type_2.svg`,
  },
  {
    label: "卖出平仓",
    path: `${PUBLICURL}/images/type_3.svg`,
  },
];

const stockTitles = [
  {
    label: "买入",
    path: `${PUBLICURL}/images/type_0.svg`,
  },
  {
    label: "卖出",
    path: `${PUBLICURL}/images/type_1.svg`,
  },
];

export default function TransactionAnalysis(props: TransactionAnalysisProps) {
  const { getCode, getTradeAnalysis, id } = props;
  const [codes, setCodes] = useState<CodeType[]>([]);
  const [data, setData] = useState<DataType>();
  const [selectedKey, setSelectedKey] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<"future" | "stock">();

  useMount(async () => {
    const result = await getCode(id);
    setCodes(result);
  });

  const onChange: SelectProps["onChange"] = async (key, option) => {
    setSelectedKey(key);
    setData(undefined);
    if (!key) return;
    const type = (option as AnyObject)["data-key"];
    setLoading(true);
    const result = await getTradeAnalysis({
      code: key,
      id,
      type,
    });
    setSelectedType(type);
    setData(result);
    setLoading(false);
  };

  const ExtraTip = () => (
    <div
      className={`${selectedKey === undefined ? "invisible" : "visible"} ${
        selectedType === "future" ? "w-96" : "w-36"
      } absolute right-0 h-10 top-10 flex justify-between items-center`}
    >
      {selectedType === undefined
        ? null
        : (selectedType === "future" ? futureTitles : stockTitles).map(
            (item, index) => (
              <div
                className="flex items-center justify-between w-24 mr-4"
                key={index}
              >
                <img src={item.path} alt="" className="w-5 h-5" />
                <span className="ml-1">{item.label}</span>
              </div>
            )
          )}
    </div>
  );

  return (
    <div className="relative">
      <Descriptions>
        <Descriptions.Item
          label="资产代码"
          labelStyle={{ alignItems: "center" }}
        >
          <Select
            className="w-52"
            placeholder="请选择资产代码"
            onChange={onChange}
            allowClear
          >
            {codes.map((code) => (
              <Select.Option key={code.code} data-key={code.type}>
                {code.code}
              </Select.Option>
            ))}
          </Select>
        </Descriptions.Item>
      </Descriptions>
      <If condition={loading}>
        <Then>
          <Spin
            spinning={loading}
            className="flex items-center justify-center"
          />
        </Then>
        <Else>
          <Empty
            className={`${selectedKey === undefined ? "block" : "hidden"}`}
            description={
              <span className="text-gray-400">
                请选择一个资产代码，拉取数据可能需要一定时间，请耐心等待！
              </span>
            }
          />
          {data && selectedKey && (
            <ChartView data={data} selectedKey={selectedKey} />
          )}
          <ExtraTip />
        </Else>
      </If>
    </div>
  );
}
