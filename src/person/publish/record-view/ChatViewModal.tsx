import ChartView from "@transquant/space/chart-view";
import useUnmount from "ahooks/lib/useUnmount";
import { Empty, Modal, Spin } from "antd";
import { observer } from "mobx-react";
import { useStores } from "../../hooks";

interface FactorViewModalProps {
  title?: string;
  visible: boolean;
  onVisibleChange: (value: boolean) => void;
}

export default observer(function FactorViewModal(props: FactorViewModalProps) {
  const { title = "策略详情", visible, onVisibleChange } = props;
  const { jsonData, jsonDataLoading, onJsonDataReset } =
    useStores().publishStore;

  useUnmount(() => {
    onJsonDataReset();
  });

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => onVisibleChange(false)}
      footer={null}
      width={1200}
      destroyOnClose
    >
      {!jsonData ? (
        <Empty />
      ) : (
        <div className="chart-wrapper">
          <div className="chart-wrapper-content" id="container">
            <Spin spinning={!!jsonDataLoading}>
              {jsonData.map((item: any, index: number) => (
                <div id={`${item.title}-${index}`} key={index}>
                  <ChartView data={item} />
                </div>
              ))}
            </Spin>
          </div>
        </div>
      )}
    </Modal>
  );
});
