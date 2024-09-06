# 数据订阅

无论是因子研究还是交易策略研究，无论是strategy.py还是evaluator.py，都离不开数据订阅。

本章将展示数据订阅和调用接口的使用方法。

## 3.1 Subscribe_data

### 3.1.1 中低频

  - 参数：

    >| 名称             | 类型 | 说明                   |
    >| ---------------- | ---- | ---------------------- |
    >| name             | str  | 数据集的名称           |
    >| dataset_describe | list | 包含了描述数据集的信息 |

  - 返回：无
  
  - dataset_describe (list): 数据信息，元素依次为：
    - db_name: 数据库名 或 'file'
    - table_bame: 表名 或 [file_path]
    - codes : 代码列表 e.g. '000001.SZ, 000002.SZ...'
    - fields : 字段列表 e.g. 'open,high,low,close...'
    - lag: 
      - 若为量价数据，则传入整数，含义为缓冲期长度（天）。系统会将回测开始时间前推
      - 若为财报数据，则传入'3Q','1Y' ... 等，系统将按报告期生成滞后字段
      
    - category: 
      - 若为A股财报数据，则填入'finance-report' (describe 长度为 6)
      - 若为其他数据，则不提供该字段 (describe 长度为 5)

> 示例：订阅中低频量价数据
>
>```python
>class DataShowStrategy(Strategy):
>    def init(self):
>        # 订阅量价数据——中低频
>        ## 参数：
>            # name: 数据名称，自定义
>            # dataset_describe: [数据库名, 表名, codes, 字段列表, 缓冲期长度]
>        self.subscribe_data('pv', ['meta_data', 'stock_bar_1day', self.codes, 'open,high,low,close', 10])
>```

订阅后，数据会以属性（self.name，在上述示例中为self.pv）的形式存储。

对于中低频数据，self.name为DataView3d类型，即3d数据视图，3个维度分别为时间、标的和字段。关于DataView3d的示例方法，我们将在[3.2节](#32-dataview3d)中介绍。

---

### 3.1.2 高频
> 示例：订阅高频量价数据
>```python
>
>class DataShowStrategy(Strategy):
>    def init(self):
>        # 订阅量价数据——高频
>        ## 参数：
>            # name: 数据名称，自定义
>            # dataset_describe: [数据库名, 表名, codes, 字段列表, 缓冲期长度, 'struct-array']
>        self.subscribe_data('tickpv', ['meta_data', 'stock_snapshot', '000001.SZ', 'ask_price_1,bid_price_1', 0, 'struct-array'])
>```

对于高频数据，self.name为DataViewStruct，即基于numpy结构体数组的2d数据视图，2个维度分别是时间和字段。关于DataViewStruct的示例方法，我们将在[3.3节](#33-dataviewstruct)中介绍。

---

## 3.2 DataView3d

3d数据视图，对外提供数据查询接口，用于获取最新数据。

> 示例：读取中低频数据
> - <b>Input</b>
> 
>```python
>from transmatrix.data_api import Dataset
>from transmatrix.data_api import create_data_view
>desc = {"db_name": 'demo', "table_name": 'stock_bar_1day', "start": '20210101', "end": '20210120', "fields": ['open','high','low','close','volume'], "codes": ['000001.SZ','000002.SZ']}
># 查询股票000001.SZ和000002.SZ，在时间段20210101到20210120的行情数据，包括：开盘价、最高价、最低价、收盘价、成交量
>dataset = Dataset(data_model = 'ndarray', describe=desc).load_data()
>dv3d = create_data_view(dataset)
>dv3d
>```
>- <b>Output</b>
>
>```text
><transmatrix.data_api.view.data_view.DataView3d at 0x7fcca5ee1fa0>
>```

> 示例：展示收盘价
> - <b>Input</b>
> 
>```python
># 展示收盘价数据
>dv3d.to_dataframe()['close']
>```
>- <b>Output</b>
>
>```text
>	000001.SZ	000002.SZ
>datetime		
>2021-01-04 15:00:00	18.60	27.78
>2021-01-05 15:00:00	18.17	27.91
>2021-01-06 15:00:00	19.56	28.75
>2021-01-07 15:00:00	19.90	28.79
>2021-01-08 15:00:00	19.85	29.34
>2021-01-11 15:00:00	20.38	29.78
>2021-01-12 15:00:00	21.00	29.70
>2021-01-13 15:00:00	20.70	29.90
>2021-01-14 15:00:00	20.17	29.99
>2021-01-15 15:00:00	21.00	29.95
>2021-01-18 15:00:00	22.70	31.26
>2021-01-19 15:00:00	22.34	31.28
>2021-01-20 15:00:00	22.47	30.50
>```
---

### 3.2.1 获取指定字段的最新一条数据
<b> get </b>

  - <b>功能</b>: 获取指定字段的最新一条数据
  - <b>参数</b>:
    - field (str): 字段名
    - codes (Union[list, str], optional): 标的代码集合. Defaults to '*' (返回所有标的数据)。
  - <b>返回值</b>: 
    - object 或 np.array (shape = (len(codes), )): 返回指定字段的数据 

> 示例1：获取指定标的代码的数据
>- <b>Input</b>
>
>```python
>dv3d.get('close', '000001.SZ') # 返回当前游标对应的 000001.SZ 数据
>```
>- <b>Output</b>
>
>```text
>22.47
>```

>示例2：获取所有标的代码的数据
>- <b>Input</b>
>
>```python
>dv3d.get('close', '*') # 返回当前游标对应的所有股票的数据
>```
>- <b>Output</b>
>
>```text
>array([22.47, 30.5 ])
>```

---

<b> get_dict </b>
  - <b>功能</b>: 获取指定字段的最新一条数据, 返回字典
  - <b>参数</b>:
    - field (str): 字段名
    - codes (Union[list, str], optional): 标的代码集合. Defaults to '*' (返回所有标的数据).
  - <b>返回值</b>: 
    - dict: key: 标的代码, value: 指定字段的数据

>示例1：获取一个标的代码数据
>- <b>Input</b>
>
>```python
>dv3d.get_dict('close', '000001.SZ')
>```
>- <b>Output</b>
>
>```text
>22.47
>```

>示例2：获取多个标的代码的数据
>- <b>Input</b>
>
>```python
>dv3d.get_dict('close', ['000001.SZ', '000002.SZ'])
>```
>- <b>Output</b>
>
>```text
>{'000001.SZ': 22.47, '000002.SZ': 30.5}
>```
---

### 3.2.2 获取指定标的的最新一条数据

<b> get_code </b>
  - <b>功能</b>: 获取指定标的最新一条数据
  - <b>参数</b>:
    - code (str): 标的代码
    - fields (Union[list, str], optional): 字段集合. Defaults to '*' (返回所有字段数据).
  - <b>返回值</b>: 
    - np.array (shape = (len(fields), )): 返回指定标的数据

>示例1：获取指定字段的最新一条数据
>- <b>Input</b>
>
>```python
>dv3d.get_code('000001.SZ', fields = 'close')
>```
>- <b>Output</b>
>
>```text
>22.47
>```

>示例2：获取所有字段的最新一条数据
>- <b>Input</b>
>
>```python
>dv3d.get_code('000001.SZ', fields = '*')
>```
>- <b>Output</b>
>
>```text
>array([2.24700000e+01, 2.29700000e+01, 2.21200000e+01, 2.21500000e+01,
>       1.28079316e+08])
>```

---

<b> get_code_dict </b>
  - <b>功能</b>: 获取指定标的最新一条数据, 返回字典
  - <b>参数</b>:
    - code (str): 标的代码
    - fields (Union[list, str], optional): 字段集合. Defaults to '*' (返回所有字段数据).
  - <b>返回值</b>: 
    - dict, key: 字段名, value: 指定标的数据。

>示例1：获取指定字段的最新一条数据
>- <b>Input</b>
>
>```python
>dv3d.get_code_dict('000001.SZ', fields = 'close')
>```
>- <b>Output</b>
>
>```text
>22.47
>```

>示例2：获取所有字段的最新一条数据
>- <b>Input</b>
>
>```python
>dv3d.get_code_dict('000001.SZ', fields = '*') # 获取 000001.SZ 当前所有字段对应的数据
>```
>- <b>Output</b>
>
>```text
>{'close': 22.47,
> 'high': 22.97,
> 'low': 22.12,
> 'open': 22.15,
> 'volume': 128079316.0}
>```
---

### 3.2.3 获取指定字段的最新N条数据

<b> get_window </b>
  - <b>功能</b>: 获取指定字段的最新 N 条数据
  - <b>参数</b>:
    - field (str): 字段名
    - length (int): 数据长度
    - codes (Union[list, str], optional): 标的代码集合. Defaults to '*' (返回所有标的数据).
  - <b>返回值</b>: 
    - np.array (shape = (length, len(codes))): 指定字段的数据
- <b>Input</b>

>示例1：获取指定标的代码的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.get_window('close', 3, codes = '000001.SZ')
>```
>- <b>Output</b>
>
>```text
>array([18.17, 19.56, 19.9 ])
>```

>示例2：获取所有标的代码的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.cursor.value = 3 # 把游标调到3，对应的时间是20210107 15点
>dv3d.get_window('close', 3, codes = '*')
>```
>- <b>Output</b>
>
>```text
>array([[18.17, 27.91],
>       [19.56, 28.75],
>       [19.9 , 28.79]])
>```

---

<b> get_window_df </b>
  - <b>功能</b>:获取指定字段的最新 N 条数据, 返回 DataFrame
  - <b>参数</b>:
    - field (str): 字段名
    - length (int): 数据长度
    - codes (Union[list, str], optional): 标的代码集合. Defaults to '*' (返回所有标的数据).
  - <b>返回值</b>: 
    - pd.DataFrame: 指定字段的数据

>示例1：获取指定标的代码的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.get_window_df('close', 3, codes = '000001.SZ')
>```
>- <b>Output</b>
>
>```text
>0    18.17
>1    19.56
>2    19.90
>Name: 000001.SZ, dtype: float64
>```

>示例2：获取所有标的代码的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.get_window_df('close', 3, codes = '*')
>```
>- <b>Output</b>
>
>```text
>	000001.SZ	000002.SZ
>0	18.17	27.91
>1	19.56	28.75
>2	19.90	28.79
>```
---

### 3.2.4 获取指定标的代码的最新N条数据

<b> get_window_code </b>
  - <b>功能</b>:获取指定标的的最新 N 条数据
  - <b>参数</b>:
    - code (str): 标的代码
    - length (int): 数据长度
    - fields (Union[list, str], optional):  字段集合. Defaults to '*' (返回所有字段数据).
  - <b>返回值</b>: 
    - np.array (shape = (length, len(fields))): 返回指定标的数据

>示例1：获取指定字段的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.get_window_code('000001.SZ', 3, fields = 'close')
>```
>- <b>Output</b>
>
>```text
>array([18.17, 19.56, 19.9 ])
>```

>示例2：获取所有字段的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.get_window_code('000001.SZ', 3, fields = '*')
>```
>- <b>Output</b>
>
>```text
>array([[1.81700000e+01, 1.84800000e+01, 1.78000000e+01, 1.84000000e+01,
>        1.82135210e+08],
>       [1.95600000e+01, 1.95600000e+01, 1.80000000e+01, 1.80800000e+01,
>        1.93494512e+08],
>       [1.99000000e+01, 1.99800000e+01, 1.92300000e+01, 1.95200000e+01,
>        1.58418530e+08]])
>```

---

<b> get_window_code_df </b>
  - <b>功能</b>: 获取指定标的最新 N 条数据, 返回 DataFrame
  - <b>参数</b>:
    - code (str): 标的代码
    - length (int): 数据长度
    - fields (Union[list, str], optional):  字段集合. Defaults to '*' (返回所有字段数据).
  - <b>返回值</b>: 
    - pd.DataFrame: 指定标的数据

>示例1：获取指定字段的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.get_window_code_df('000001.SZ', 3, fields = 'close')
>```
>- <b>Output</b>
>
>```text
>0    18.17
>1    19.56
>2    19.90
>Name: close, dtype: float64
>```

>示例2：获取所有字段的最新N条数据
>- <b>Input</b>
>
>```python
>dv3d.get_window_code_df('000001.SZ', 3, fields = '*')
>```
>- <b>Output</b>
>
>```text
>close	high	low	open	volume
>0	18.17	18.48	17.80	18.40	182135210.0
>1	19.56	19.56	18.00	18.08	193494512.0
>2	19.90	19.98	19.23	19.52	158418530.0
>```
---

### 3.2.5 获取指定下标和字段的数据

<b> iloc </b>
  - <b>功能</b>: 返回指定位置的数据
  - <b>参数</b>:
    - i (int): 指定的位置
    - field (str): 指定的字段名称
    - codes (Union[list, str], optional): 标的代码合集. Defaults to '*'.
  - <b>返回值</b>: 
    - Union[np.array, object]: 对应的数据，若指定单个标的则直接返回对应值，若指定多个标的则返回 np.array

>示例1：获取指定标的的数据
>```python
>dv3d.iloc(3, 'close', codes = '000001.SZ')
>```
>- <b>Output</b>
>
>```text
>19.9
>```

>示例2：获取所有标的数据
>- <b>Input</b>
>
>```python
>dv3d.iloc(3, 'close', codes = '*')
>```
>- <b>Output</b>
>
>```text
>array([19.9 , 28.79])
>```
>- <b>Input</b>
---

### 3.2.6 获取指定时间的数据

<b> loc </b>
  - <b>功能</b>: 返回指定时间的数据，若给定时间不在数据时间索引中，则返回在该时间之前并且最接近的数据
  - <b>参数</b>:
    - date_index (Union[datetime, pd.Timestamp, List[datetime], List[pd.Timestamp]]): 指定时间
    - field (str): 指定的字段名称
    - codes (Union[list, str], optional): 标的代码合集. Defaults to '*'.
  - <b>返回值</b>: 
    - Union[np.array, object]: 对应的数据，若指定单个标的则直接返回对应值，若指定多个标的则返回 np.array

>示例1：获取指定时间的数据
>- <b>Input</b>
>
>```python
>from datetime import datetime
>dv3d.loc(datetime(2021,1,8,15), 'close', codes = '*') # 返回2021年1月8号15点的数据
>```
>- <b>Output</b>
>
>```text
>array([19.85, 29.34])
>```

>示例2：指定时间不在数据索引中的情形
>- <b>Input</b>
>
>```python
>dv3d.loc(datetime(2021,1,8,14), 'close', codes = '*') # dv3d中无1月8号14点的数据，返回它之前的那条数据，即1月7号15点的数据
>```
>- <b>Output</b>
>
>```text
>UserWarning: 给定的 date_index 不全在数据时间索引中，请注意。
>array([19.9 , 28.79])
>```
---

### 3.2.7 获取指定下标和标的代码的数据

<b> iloc_code </b>

  - <b>功能</b>: 返回指定位置的数据
  - <b>参数</b>:
    - i (int): 指定位置
    - code (str): 标的代码
    - fields (Union[list, str], optional): 指定的字段合集. Defaults to '*'.
  - <b>返回值</b>: 
    - Union[np.array, object]: 对应的数据，若指定单个字段则直接返回对应值，若指定多个字段则返回 np.array

>示例1：获取指定字段数据
>- <b>Input</b>
>
>```python
>dv.iloc_code(1, code='000001.SZ', fields='close')的数据
>```
>- <b>Output</b>
>
>```text
>18.17
>```

>示例2：获取所有字段数据
>- <b>Input</b>
>
>```python
>dv.iloc_code(1, code='000001.SZ', fields='*')
>```
>- <b>Output</b>
>
>```text
>array([1.8170000e+01, 1.8480000e+01, 1.7800000e+01, 1.8400000e+01,
>       1.8213521e+08])
>```
---

### 3.2.8 获取指定时间和标的代码的数据

<b> loc_code </b>

  - <b>功能</b>: 返回指定时间、指定标的代码的数据，若给定时间不在数据时间索引中，则返回在该时间之前并且最接近的数据
  - <b>参数</b>:
    - date_index (Union[datetime, pd.Timestamp, List[datetime], List[pd.Timestamp]]): 指定时间
    - code (str): 标的代码
    - fields (Union[list, str], optional): 指定的字段合集. Defaults to '*'.
  - <b>返回值</b>: 
    - Union[np.array, object]: 对应的数据，若指定单个标的则直接返回对应值，若指定多个标的则返回 np.array

>示例1：获取指定字段的数据
>```python
>dv3d.loc_code(datetime(2021,1,8,15), code='000001.SZ', fields='close')
>```
>- <b>Output</b>
>
>```text
>19.85
>```

>示例2：获取所有字段
>- <b>Input</b>
>
>```python
>dv3d.loc_code(datetime(2021,1,8,15), code='000001.SZ', fields='*')
>```
>- <b>Output</b>
>
>```text
>array([1.98500000e+01, 2.01000000e+01, 1.93100000e+01, 1.99000000e+01,
>       1.19547322e+08])
>```

>示例3：指定时间不在数据索引中的情形
>
>- <b>Input</b>
>
>```python
>dv3d.loc_code(datetime(2021,1,8,14), code='000001.SZ', fields='*')) # dv3d中无1月8号14点的数据，返回它之前的那条数据，即1月7号15点的数据
>```
>- <b>Output</b>
>
>```text
>UserWarning: 给定的 date_index 不全在数据时间索引中，请注意。
>array([1.9900000e+01, 1.9980000e+01, 1.9230000e+01, 1.9520000e+01,
>       1.5841853e+08])
>```
>- <b>Input</b>
---

### 3.2.9 根据指定时间查询数据

<b> query </b>
  - <b>功能</b>: 根据指定时间查询数据
  - <b>参数</b>:
    - time (datetime): 指定时间
    - periods (int, optional): 返回N条数据. Defaults to None.
    - start_time (datetime, optional): 返回从指定时间开始的数据. Defaults to None.
    - window (timedelta, optional): 返回指定时间窗口内的数据. Defaults to None.
  - <b>返回值</b>: 
    - dict: 
      - key: 字段名
      - value: pd.dataframe, index 为时间, columns 为标的代码

>示例1：获取N条数据
>- <b>Input</b>
>
>```python
>dv3d.query(datetime(2021,1,12), periods = 3)
>```
>- <b>Output</b>
>
>```text
>{'close':                      000001.SZ  000002.SZ
> datetime                                 
> 2021-01-07 15:00:00      19.90      28.79
> 2021-01-08 15:00:00      19.85      29.34
> 2021-01-11 15:00:00      20.38      29.78,
> 'high':                      000001.SZ  000002.SZ
> datetime                                 
> 2021-01-07 15:00:00      19.98      29.50
> 2021-01-08 15:00:00      20.10      29.45
> 2021-01-11 15:00:00      20.64      30.35,
> 'low':                      000001.SZ  000002.SZ
> datetime                                 
> 2021-01-07 15:00:00      19.23      28.39
> 2021-01-08 15:00:00      19.31      28.81
> 2021-01-11 15:00:00      20.00      29.27,
> 'open':                      000001.SZ  000002.SZ
> datetime                                 
> 2021-01-07 15:00:00      19.52      29.00
> 2021-01-08 15:00:00      19.90      28.98
> 2021-01-11 15:00:00      20.00      29.50,
> 'volume':                        000001.SZ    000002.SZ
> datetime                                     
> 2021-01-07 15:00:00  158418530.0  122675574.0
> 2021-01-08 15:00:00  119547322.0  102856329.0
> 2021-01-11 15:00:00  179045714.0  138812124.0}
>```

>示例2：获取从指定时间开始的数据
>- <b>Input</b>
>
>```python
>dic_data = dv3d.query(datetime(2021,1,12), start_time=datetime(2021,1,8))
>dic_data['close']
>```
>- <b>Output</b>
>
>```text
>                  000001.SZ	000002.SZ
>datetime		
>2021-01-08 15:00:00	19.85	29.34
>2021-01-11 15:00:00	20.38	29.78
>```

>示例3：获取N天内的数据
>- <b>Input</b>
>
>```python
>from datetime import timedelta
>dic_data = dv3d.query(datetime(2021,1,12), window=timedelta(days=5))
>dic_data['close']
>```
>- <b>Output</b>
>
>```text
>                  000001.SZ	000002.SZ
>datetime		
>2021-01-07 15:00:00	19.90	28.79
>2021-01-08 15:00:00	19.85	29.34
>2021-01-11 15:00:00	20.38	29.78
>```
---

### 3.2.10 根据指定时间和标的代码查询数据

<b> query_code </b>

  - <b>功能</b>: 根据指定时间和标的代码查询数据
  - <b>参数</b>:
    - time (datetime): 指定时间
    - code (str): 指定的股票代码
    - fields (Union[list, str], optional): 指定的字段合集
    - periods (int, optional): 返回N条数据. Defaults to None.
    - start_time (datetime, optional): 返回从指定时间开始的数据. Defaults to None.
    - window (timedelta, optional): 返回指定时间窗口内的数据. Defaults to None.
  - <b>返回值</b>: 
    - pd.dataframe

>示例1：获取指定字段的数据N条数据
>- <b>Input</b>
>
>```python
>dv3d.query_code(datetime(2021,1,12), code='000001.SZ', fields='close', periods=3)
>```
>- <b>Output</b>
>
>```text
>	                  close
>datetime	
>2021-01-07 15:00:00	19.90
>2021-01-08 15:00:00	19.85
>2021-01-11 15:00:00	20.38
>```

>示例2：获取所有字段的数据N条数据
>- <b>Input</b>
>
>```python
>dv3d.query_code(datetime(2021,1,12), code='000001.SZ', fields='*', periods=3)
>```
>- <b>Output</b>
>
>```text
>                    close	high	low	open	volume
>datetime					
>2021-01-07 15:00:00	19.90	19.98	19.23	19.52	158418530.0
>2021-01-08 15:00:00	19.85	20.10	19.31	19.90	119547322.0
>2021-01-11 15:00:00	20.38	20.64	20.00	20.00	179045714.0
>```

>示例3：获取从指定时间开始所有字段的数据
>- <b>Input</b>
>
>```python
>dv3d.query_code(datetime(2021,1,12), code='000001.SZ', fields='*', >start_time=datetime(2021,1,8))
>```
>- <b>Output</b>
>
>```text
>                    close	high	low	open	volume
>datetime					
>2021-01-08 15:00:00	19.85	20.10	19.31	19.9	119547322.0
>2021-01-11 15:00:00	20.38	20.64	20.00	20.0	179045714.0
>```
---

## 3.3 DataViewStruct
StructArray的数据视图，对外提供数据查询接口，用于获取最新数据。

> 此数据结构专用于储存单个标的的高频数据，数据的两个维度分别指时间和字段。

---

<b> \__init__ </b>

- 参数: 
  - data (StructArray): StructArray数据
  - cursor (BaseCursor): 控制数据回放的游标

---
### 3.3.1 获取最新一条数据

**get**

获取所有字段的最新一条数据

  - <b>参数</b>:
    - 无
  - <b>返回值</b>: 
    - numpy.void：结构体数组

> 示例：要想获得某个字段的数据
>
> ```python
> tick_data  = data.get()
> # tick_data: numpy.void 结构体数组
> ask_price_1 = tick_data['ask_price_1']
> ```

---

<b> get_dict </b>

获取最新一条数据, 返回字典

  - <b>参数</b>:
    - 无
  - <b>返回值</b>: 
    - dict: key: 字段, value: 对应字段的数据值

> 示例：要想获得某个字段的数据
>
> ```python
> tick_data  = data.get_dict()
> # tick_data: Dict
> ask_price_1 = tick_data['ask_price_1']
> ```

---
### 3.3.2 获取最新N条数据

<b> get_window </b>

获取最新n条数据

  - <b>参数</b>:
    - length (int): window长度
  - <b>返回值</b>: 
    - 指定长度的 np.ndarray 结构体数组

> 示例：要想获得某个字段的数据
>
> ```python
> tick_data  = data.get_window(5)
> # tick_data: numpy.ndarray 结构体数组
> ask_price_1 = tick_data['ask_price_1']  # ask_price_1.shape: (5,)
> ```

---
### 3.3.3 获取未来一条数据

<b> get_future </b>

获取所有字段的未来的一条数据

  - <b>参数</b>:
    - shift (int): 读取未来第shift个时间戳的数据
  - <b>返回值</b>: 
    - numpy.void：结构体数组

> 示例：要想获得下一个时间戳某个字段的数据
>
> ```python
> tick_data  = data.get_future(shift=1)
> ask_price_1 = tick_data['ask_price_1']
> ```

---

<b> get_future_dict</b>

获取所有字段的未来的一条数据, 返回字典

  - <b>参数</b>:
    - shift (int): 读取未来第shift个时间戳的数据
  - <b>返回值</b>: 
    - dict: key: 字段, value: 对应字段的数据值

> 示例：要想获得下一个时间戳某个字段的数据
>
> ```python
> tick_data  = data.get_future_dict(shift=1)
> ask_price_1 = tick_data['ask_price_1']
> ```

---
### 3.3.4 获取未来N条数据

**get_future_window**

获取从当前时间开始，未来的最近n条数据

  - <b>参数</b>:
    - length (int): 读取未来最近length个时间戳的数据
  - <b>返回值</b>: 
    - 指定长度的 np.ndarray 结构体数组

> 示例：要想获得某个字段的数据
>
> ```python
> tick_data  = data.get_future_window(5)
> ask_price_1 = tick_data['ask_price_1']
> # ask_price_1.shape: (5,)
> ```
