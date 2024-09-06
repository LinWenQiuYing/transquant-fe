# 6 进阶
## 6.1 Generator 信息流
Generator 是 TransMatrix 系统的主要开发接口。

它是第二章介绍的策略组件基类 Strategy 和 第三章介绍的因子研究基类 SignalStrategy 的父类，用户也可以直接继承 Generator 类，用来实现因子计算或交易逻辑。关于 Generate 类的详细介绍，参见[这里](TransMatrixAPI文档/3_接口说明/策略/generator.md)。

### 6.1.1 Generator 使用示例

通常我们交易时所用的 K 线，都是基于某一时间频率切分得到的，即时间采样序列。例如日线是每个交易日对应一个 Bar，10分钟线是每 10 分钟对应一个 Bar。这种按时间采样的方式，往往会在成交低活跃期采样信息过度，在成交高活跃期采样信息不足，并且通常表现出较差的统计特性，如序列相关性、异方差和回报的非正态性。为了解决这一问题，我们可以引入其他采样方式：
-   按成交量进行采样，当阶段成交量达到指定条件时，生成一根 Bar，即 Volume Bar
-   按价格进行采样，每当创新低或新高时，生成一根 Bar，即 Price Bar

使用 Generator，我们可以很轻松实现这一需求。

我们新建一个名为 strategy.py 文件，输入以下代码：


```python
from transmatrix import Generator,Strategy
import numpy as np
  
# 生成 Volume Bar      
class GenVolumeBar(Generator):
    def init(self):
        self.subscribe_data(
            'tick_pv', ['common2','stock_snapshot', self.codes,'volume,ask_price_1', 0]
        )
        self.add_scheduler(with_data='tick_pv', handler=self.on_tick) # 添加调度器：随着数据pv的时间戳调，用 on_tick 方法，这里是每个快照回调一次。
        self.add_message('volume_bar') # 添加信息流的名称
        
    def on_tick(self):
        total_volume = self.tick_pv.get_window('volume', 2)
        if total_volume.shape[0] == 2:
            volume_bar = total_volume[1] - total_volume[0]
            # 广播：当该股票交易量大于1000时，发布数据
            if volume_bar[0] >= 1000:
                self.public('volume_bar', self.tick_pv)
   
# 生成 Price Bar
class GenPriceBar(Generator):
    def init(self):
        self.subscribe_data(
            'tick_pv', ['common2','stock_snapshot', self.codes,'high,low,volume,ask_price_1,bid_price_1', 0]
        )
        self.add_scheduler(with_data='tick_pv', handler=self.on_tick) # 添加调度器：随着数据pv的时间戳调，用 on_tick 方法，这里是每个快照回调一次。
        self.add_message('price_bar')  # 添加信息流的名称
        
    def on_tick(self):
        high = self.tick_pv.get_window('high',2)[0,0]
        low = self.tick_pv.get_window('low',2)[0,0]
        ap = self.tick_pv.get('ask_price_1')[0]
        bp = self.tick_pv.get('bid_price_1')[0]
        if ap < low: # 广播：当该股票的卖一价小于之前的最低价时，发布数据
            self.public('price_bar', [1, ap])
        elif bp > high: # 广播：当该股票的买一价大于之前的最高价时，发布数据
            self.public('price_bar', [-1, bp])
                    
# 交易策略
class Trade(Strategy):
    def init(self):
        f1 = self.subscribe(GenVolumeBar()) # 订阅 GenVolumeBar
        f2 = self.subscribe(GenPriceBar()) # 订阅 GenPriceBar
        
        self.callback(f1['volume_bar'], self.on_volume_bar) # 在接收f1的消息volume_bar时，执行self.on_volume_bar方法
        self.callback(f2['price_bar'], self.on_price_bar) # 在接收f2的消息price_bar时，执行self.on_price_bar方法
        
    def on_volume_bar(self, tick_pv):
   		# 买入股票
        buy_code = self.codes[0]
        price = tick_pv.get('ask_price_1', buy_code)
        if np.isnan(price): return
        self.buy(
            price, 
            volume=100, 
            offset='open', 
            code=buy_code, 
            market='stock'
        )
            
    def on_price_bar(self, info):
        signal, price = info
        if np.isnan(price): return
        buy_code = self.codes[0]
        # 买入股票
        if signal==1:
            self.buy(
                price, 
                volume=100, 
                offset='open', 
                code=buy_code, 
                market='stock'
            )
        # 卖出股票
        elif signal==-1:
            pos = self.get_netpos(buy_code)
            if pos > 0:
                self.sell(
                    price, 
                    volume=pos, 
                    offset='close', 
                    code=buy_code, 
                    market='stock'
                )
```

上述代码里，我们定义了 2 个继承自 Generator 的类：GenVolumeBar 类用于生成 Volume Bar，GenPriceBar 类用于生成 Price Bar。Trade 类用于接收前 2 个类的消息，便据此构建买卖逻辑。针对 GenVolumeBar 类：
-   init 方法中注册了一个名为 volume_bar 的信息流
-   on_tick 方法每个快照都会被回调一次，当前快照的成交量大于 1000 时，广播数据

针对 Trade 类：
-   init 方法订阅了 GenVolumeBar 和 GenPriceBar：
```python
        f1 = self.subscribe(GenVolumeBar()) # 订阅 GenVolumeBar
        f2 = self.subscribe(GenPriceBar()) # 订阅 GenPriceBar
```
    并注册了 2 个回调方法，用于响应广播：
```python
        self.callback(f1['volume_bar'], self.on_volume_bar) # 在接收f1的消息volume_bar时，执行self.on_volume_bar方法
        self.callback(f2['price_bar'], self.on_price_bar) # 在接收f2的消息price_bar时，执行self.on_price_bar方法
```

-  on_volume_bar 和 on_price_bar 方法，获取收到的数据，并构建交易逻辑

我们新建一个 config.yaml 文件，存放本示例的配置信息：

```text
matrix:

    mode: simulation
    span: [2023-01-04, 2023-01-04]
    codes: [000001.SZ]
    market:
        stock:
            data: [meta_data, stock_bar_1day] # 挂载的行情数据
            matcher: daily # 订单撮合模式为 daily
            account: base # 账户类型为 base

strategy:
    trade:
        class:
            - strategy.py
            - Trade
```

新建 run.ipynb 文件，运行代码单元格

```python
from transmatrix.workflow.run_yaml import run_matrix
mat = run_matrix('config.yaml')
```
得到以下输出：
```text
loading data common2__stock_snapshot__volume,ask_price_1 from datacache.
loading data common2__stock_snapshot__high,low,volume,ask_price_1,bid_price_1 from datacache.

loading data meta_data__stock_bar_1day__* from datacache.

loading data meta_data__critic_data__is_halt from datacache.


loading data meta_data__stock_bar_1day__close from datacache.
```

输出交易记录：
```python
strategy = mat.strategies['trade']
strategy.get_trade_table()
```

<div align=center>
<img width="800" src="TransMatrix使用手册/pics/generator.png"/>
</div>
<div align=center style="font-size:12px">交易记录</div>
<br />

## 6.2 批量任务

系统支持通过 yaml 文件配置任务流，一个任务流包含多个顺序执行的批任务，每个批任务中包含多个可并行子任务。

基于任务流，我们可以轻松实现**批量执行因子研究**或者**批量执行策略研究**的需求。

### 6.2.1 通过yaml文件配置任务流

我们假设以下场景：

我们要生成 4 个因子，factor_A, factor_B, factor_C 和 factor_D。它们之间的依赖关系如下：
-   factor_A 和 factor_B 相关独立，factor_C 和 factor_D 相关独立
-   factor_C 和 factor_D 依赖于 factor_A 和 factor_B 因子，即需要先生成 factor_A 和 factor_B 因子，才能生成 factor_C 和 factor_D 因子

上述场景的工程文件结构示意：

```text
taskflow
├── evaluator.py
├── factor_A
│   ├── config.yaml
│   └── strategy.py
├── factor_B
│   ├── config.yaml
│   └── strategy.py
├── factor_C
│   ├── config.yaml
│   └── strategy.py
├── factor_D
│   ├── config.yaml
│   └── strategy.py
└── taskflow.yaml
```

通过配置系统批量任务流，我们可以轻松实现上述场景。我们在新建的 taskflow.yaml 文件中，输入以下内容：
```text

# 模式设置
workflow: BatchMatrix
max_child_level: 1 # task 最大穿透目录层数 (defalult 为 1)

# 公有信息
matrix:
    span: [2021-01-01,2021-12-31]
    logging: True

# 任务信息
task:
    - regex factor_[A|B] # 以'regex '开头。利用正则表达式筛选符合条件的因子文件夹。
    - 
        - factor_C
        - factor_D
```

这一文件中包含 3 部分：模式设置，公有信息，任务信息。我们分别来看：
-   模式设置
```text
workflow: BatchMatrix
max_child_level: 1 # task 最大穿透目录层数 (defalult 为 1)
```

这里，我们把 workflow 模式设置为 BatchMatrix，代表当前模式为任务流模式。

max_child_level 设为1，代表系统将搜索当前目录及子目录的文件。即搜索 taskflow 目录，和子目录（例如 factor_A 文件夹），子目录之下的目录，系统不做搜索。

-   公有信息
```text
matrix:
    span: [2021-01-01,2021-12-31]
    logging: True
```

公有信息可以是标准配置文件中 matrix / strategy / evaluator 中的任何信息， 其将覆盖子任务相应为之的配置信息。这里，我们matrix 部分的 span 和 logging 设置是公有信息，则 factor_A 文件夹下的 config.yaml 文件中在 matrix 部分的 span 和 logging 设置将会被公有的设置所覆盖。同理，其他因子文件夹下的对应部分也会被覆盖。

-   任务信息
```
# 任务信息
task:
    - regex factor_[A|B] # 以'regex '开头。利用正则表达式筛选符合条件的因子文件夹。
    - 
        - factor_C
        - factor_D
```

这里，我们配置了 2 个批任务，第 1 个批任务：
```
    - regex factor_[A|B] # 以'regex '开头。利用正则表达式筛选符合条件的因子文件夹。
```

第 1 个批任务，以 regex 开头，系统将使用正则表达式筛选符合条件的因子文件夹。具体而言，从当前入口文件所在目录递归地扫描子文件夹(os.walk)，若某一级文件夹名称调用 re.compile('factor_[A|B]').search()返回True时，该文件夹下的config.yaml（若有）将被加入任务列表。

第 2 个批任务，包含 2 个子任务：
```
    - 
        - factor_C
        - factor_D
```

在执行时，系统的执行顺序如下：
-   首先执行第 1 个批任务，它包含 2 个子任务: factor_A 和 factor_B，子任务将并行执行
-   接着执行第 2 个批任务，它包含 2 个子任务：factor_C 和 factor_D，子任务将并行执行

注意，每个因子文件夹下面都有各自的因子计算逻辑代码和对应的配置文件，参照 4.1 节的工程文件结构示意。出于篇幅考虑，这里不作介绍，具体内容可参考对应的测例。

### 6.2.2 运行批量任务
我们新建一个 ipynb 文件，命名为 run.ipynb，新建一代码单元格，输入以下代码：
```python
from transmatrix.data_api import create_factor_table
temp_table_name = 'batch_insert'
create_factor_table(temp_table_name) # 创建因子表

from transmatrix.workflow.run_batch import run_matrices
run_matrices('task_flow.yaml') # 运行批量任务
```
代码里，我们在个人空间新建了 1 张因子数据表，然后调用 run_matrices 方法执行批量任务。关于 run_matrices 方法的详细说明，参见[这里](TransMatrixAPI文档/9_workflow/batch.md)。运行该单元格，输出以下内容：
```text
Out:
    2023-06-19 15:38:20.326217: 批量任务开始:
    loading data demo__stock_bar_1day__open,high,low,close from database.

    loading data demo__critic_data__is_hs300,is_zz500,ind from database.

    loading data demo__stock_index__close from database.

    Cashing demo__critic_data__is_hs300,is_zz500,ind to pickle file: dataset_151b3bab-c21a-46a7-8154-6c88e1827f16 ....Cashing demo__stock_index__close to pickle file: dataset_34766158-a39b-4060-a3dc-61e8b21b83b5 ....
    Cashing demo__stock_bar_1day__open,high,low,close to pickle file: dataset_5a7c6838-3b01-44b3-bda0-59cfaa2f8018 ....

    loading data demo__stock_bar_1day__open,high,low,close from datacache.
    loading data demo__critic_data__is_hs300,is_zz500,ind from datacache.
    loading data demo__stock_index__close from datacache.



    loading data demo__stock_bar_1day__open,high,low,close from datacache.
    loading data demo__critic_data__is_hs300,is_zz500,ind from datacache.
    loading data demo__stock_index__close from datacache.



    saving report to /root/workspace/我的项目/功能演示230619/transmatrix特色功能/批量任务-workflow/批量任务/factor_A/report
    saving report to /root/workspace/我的项目/功能演示230619/transmatrix特色功能/批量任务-workflow/批量任务/factor_B/report
    factorA: saving signal factora to batch_insert....
    factorB: saving signal factorb to batch_insert....
    因子库数据更新: xwq1_private batch_insert : ['factora']
    因子库数据更新: xwq1_private batch_insert : ['factorb']
    更新完毕: xwq1_private batch_insert : ['factora']
    更新完毕: xwq1_private batch_insert : ['factorb']
    loading data demo__stock_bar_1day__open,high,low,close from datacache.
    loading data demo__critic_data__is_hs300,is_zz500,ind from datacache.
    loading data demo__stock_index__close from datacache.



    loading data demo__stock_bar_1day__open,high,low,close from datacache.
    loading data demo__stock_index__close from datacache.

    loading data demo__critic_data__is_hs300,is_zz500,ind from datacache.


    saving report to /root/workspace/我的项目/功能演示230619/transmatrix特色功能/批量任务-workflow/批量任务/factor_C/report
    saving report to /root/workspace/我的项目/功能演示230619/transmatrix特色功能/批量任务-workflow/批量任务/factor_D/report
    factorC: saving signal factorc to batch_insert....
    factorD: saving signal factord to batch_insert....
    因子库数据更新: xwq1_private batch_insert : ['factorc']
    因子库数据更新: xwq1_private batch_insert : ['factord']
    更新完毕: xwq1_private batch_insert : ['factorc']
    更新完毕: xwq1_private batch_insert : ['factord']
    2023-06-19 15:38:41.160341: 批量任务完成。
```

由输出结果可知，系统顺序执行了 2 个批任务，每个批任务内的子任务是并行执行的。

> Tips:
> 
> 系统支持 **2 种运行方式**，执行批量任务：
> 
> - **run_matrices** 方法: 在 py 文件或 jupyter 环境中调用本方法
> - **BatchMatrix** 命令：在命令行窗口中输入 BatchMatrix -p [yaml_path] -s [startdate]-[enddate]
>       我们在命令行窗口中输入以下命令： 
> 
>       BatchMatrix -p /root/workspace/我的项目/批量任务-workflow/3.workflow.yaml -s 20210101-20211230 
>
>       系统将运行配置信息文件： "/root/workspace/我的项目/批量任务-workflow/3.workflow.yaml"，并且回测时间段为 2021年1月1日到2021年12月30日

## 6.3 参数寻优

本模块是用来对**因子或者交易策略的参数**进行参数寻优的。

- 本模块支持哪些参数类型和优化算法？

    本模块支持的参数类型包括 **Sequence**，**Box**，**Discrete**，**Category** 和 **Bool**，其中不同的优化算法支持的参数有所不同。

    本模块实现的优化算法包括**网格搜索** **gridsearch**，**随机搜索** **randomsearch**，**贝叶斯搜索** **bayessearch**，**强化随机搜索** **ARS** 和**遗传算法** **GA**。除此以外，为了使得优化算法的使用更灵活，本模块还支持**早停法 earlystopping**。

> Tips:
>
> 关于参数类型和优化算法更详细的说明，请参考[参数优化说明（API文档版）](TransMatrixAPI文档/9_workflow/optim.md)。



接下来的内容以两个样例作为辅助说明：

- 使用网格搜索的交易策略参数优化
- 使用遗传算法的因子研究参数优化

### 6.3.1 如何设置参数优化的目标函数

与标准的因子研究和交易策略模式一样，同样需要 strategy.py 和 evaluator.py 来指定策略逻辑和评价逻辑。

特别的是，

- strategy.py 中通过 self.param 获得待优化的参数；

- evaluator.py 中的 critic 方法就是寻优的目标函数，所有要求critic方法<u>必须</u>返回一个数值（参数优化的方向为<u>目标函数值越大越好</u>）。

> Tips:
>
> **self.param 是一个字典**，key 为参数的名字，value 为参数的值。
>
> 需要注意的是，数值型的参数在 self.param 都会被储存为 float 类型，可以通过 init() 获得正确的参数类型。



**交易策略：**

假设我们想要对一个使用 mean(macd, window_size) 作为交易信号的策略使用参数优化。

其中，我们需要优化的参数为window_size，目标函数为策略的总pnl，也就是说，我们想要找最优的window_size值使得策略的收益最大。此时，在strategy中，self.param 是 `{'window_size': 某备选值}`；在evaluator中，critic方法用来计算策略的总收益，并返回总收益的数值。

具体写法如下：

- strategy.py
  通过 `self.param['window_size']` 获得计算买入信号的窗口大小。


```python
from transmatrix import Strategy
# 策略逻辑组件
class TestStra(Strategy):
    def init(self):
        # 订阅策略所需数据
        self.subscribe_data(
            'macd', ['demo', 'factor_data__stock_cn__tech__1day__macd', self.codes, 'value', 10]
        )
        self.max_pos = 30
    
    #回调执行逻辑： 行情更新时
    def on_market_data_update(self, market):
        # 通过self.param获取获取参数
        window_size = int(self.param['window_size'])
        # 获取macd值
        macd = self.macd.query(self.time, window_size)['value'].mean().sort_values() 
        # macd值最小的两只股票作为买入股票
        buy_codes = macd.iloc[:2].index 

        for code in buy_codes:
            # 获取某只股票的仓位
            pos = self.account.get_netpos(code)

            if  pos < self.max_pos:
                price = market.get('close', code)
                self.buy(
                    price, 
                    volume=10, 
                    offset='open', 
                    code=code, 
                    market='stock'
                )
```

- evaluator.py

    将策略的总 pnl 作为优化的目标函数值。

```python
from transmatrix.evaluator.simulation import SimulationEvaluator

import numpy as np

class TestEval(SimulationEvaluator):
    
    def init(self):
        pass

    def critic(self):
        # 获得每日损益
        pnl = self.get_pnl()
        
        return np.nansum(pnl)
```



**因子研究：**

假设我们想要对一个reverse因子的计算过程使用参数优化，这个因子的计算过程中要使用到两个参数 ret 和 roll，它们分别指代收益率计算的time lag大小和rolling mean的窗口大小。

所以我们需要优化的参数为 ret 和 roll，目标函数为因子的IC值，也就是说，我们想要找最优的 ret 和 roll值使得因子的IC值最大。此时，在strategy中，self.param 是 `{'ret': 某备选值, 'roll': 某备选值}`；在evaluator中，critic方法用来计算因子的IC值，并返回它。

具体写法如下：

- strategy.py

    通过 `self.param['ret']` 和 `self.param['roll']` 获得相应的参数值。

```python
from scipy.stats import zscore
from transmatrix.strategy import SignalStrategy
from transmatrix.data_api import create_data_view, NdarrayData, DataView3d

class TestStra(SignalStrategy):
    
    def init(self):
        # 订阅数据
        self.subscribe_data(
            'pv', ['default','stock_bar_1day',self.codes,'open,high,low,close', 10]
        )
        # 设置回测发生时间
        self.add_clock(milestones='09:35:00') 

    def pre_transform(self):
        # 通过self.param获取获取参数
        ret_window = int(self.param['ret'])
        roll_window = int(self.param['roll'])

        pv = self.pv.to_dataframe()
        ret = (pv['close'] / pv['close'].shift(ret_window) - 1).fillna(0) 
        reverse = -ret.rolling(window = roll_window, min_periods = roll_window).mean().fillna(0)
        reverse = zscore(reverse, axis = 1, nan_policy='omit') # 因子标准化
        
        self.reverse: DataView3d = create_data_view(NdarrayData.from_dataframes({'reverse':reverse})) 
        self.reverse.align_with(self.pv) # 与原始数据对齐
            
    def on_clock(self):
        self.update_signal(self.reverse.get('reverse')) # 定时更新因子数据

```

- evaluator.py

    将因子的 IC 值作为优化的目标函数值。

```python
import pandas as pd
from transmatrix.evaluator.signal import SignalEvaluator

class TestEval(SignalEvaluator):
    def init(self):
        # 订阅数据
        self.subscribe_data(
            'pv', ['default','stock_bar_1day',self.codes,'open,high,low,close', 1]
        )
    
    def critic(self):
        # 将pv转成了一个Dict(field, dataframe)
        critic_data = self.pv.to_dataframe()
        # 计算IC
        price = critic_data['close']
        factor = self.strategy.signal.to_dataframe()
        ret_1d = price.shift(-1) / price - 1
        ic = vec_rankIC(factor, ret_1d)
        
        return np.abs(ic)
    
def vec_rankIC(factor_panel: pd.DataFrame, ret_panel: pd.DataFrame):
    return factor_panel.T.corrwith(ret_panel.T, method = 'spearman').mean()
```



### 6.3.2 如何配置yaml文件

和标准的因子研究和策略研究类似，同样需要在 config.yaml 中配置 matrix、strategy 和 evaluator 字段。

不同的是，额外需要配置一个 **OptimMatrix** 字段。

> Tips：
>
> 关于 OptimMatrix 更详细的配置说明（包括其他优化算法的配置方法和参数类型等），请参考[参数优化说明（API文档版）](TransMatrixAPI文档/9_workflow/optim.md)。



- 使用网格搜索的交易策略参数优化

    下面的 `window_size:  [[1,5,1], 'Sequence']` 的含义是：

    - 待优化的参数的名称为 window_size；
    - 参数空间设置为 [1,5,1]，参数空间的类型是 'Sequence'，意思是参数空间为  np.arange(1, 5, 1)；
    - 因此参数的备选值为 1、2、3、4。

```yaml
OptimMatrix:
    max_workers: 10  # 并行运算的worker数量
    policy: gridsearch  # 参数优化方法，可选择gridsearch, randomsearch, bayessearch, GA, ARS

	# 待优化的超参数，以"参数名称: [样本空间, 空间类型]"的形式配置:
    params:
        window_size:  [[1,5,1], 'Sequence']
        
matrix:
    mode: simulation
    span: [2021-01-01, 2021-12-31]
    codes: custom_universe.pkl
    ini_cash: 10000000
    market:
        stock:
            data: [default, stock_bar_1day]
            matcher: daily
            account: detail

strategy:
    Trade_stra:
        class: [strategy.py, TestStra]
                
evaluator:
    Trade_eval:
        class: [evaluator.py, TestEval]
```



- 使用遗传算法的因子研究参数优化

    下面的 `ret:  [[1,5,1], 'Sequence']` 和 `roll: [[5,15,1], 'Sequence']` 的含义是：

    - 待优化的参数的名称分别为 ret 和 roll；
    - ret 的参数空间设置为 [1,5,1]，参数空间的类型是 'Sequence'，意思是参数空间为  np.arange(1, 5, 1)；
    - roll 的参数空间设置为 [5,15,1]，参数空间的类型是 'Sequence'，意思是参数空间为  np.arange(5, 15, 1)；
    - 因此 ret 的备选值为 1、2、3、4，roll 的备选值为 5、6、7、8、9、10、11、12、13、14。

    > Tips:
    >
    > 除了网格搜索以外，其他参数优化算法都可以设置算法参数的值，通过 policy_params 字段实现。也可以不填算法参数的值，因为都有默认值。

```yaml
OptimMatrix:
    max_workers: 10  # 并行运算的worker数量
    policy: GA  # 参数优化方法，可选择gridsearch, randomsearch, bayessearch, GA, ARS
    # 优化算法参数设置
    policy_params: 
    	# 不同优化算法都有的公共参数
        seed: 81  # 随机种子
        max_iter: 30  # 最大迭代次数
		
		# 以下为不同优化算法特有的参数    
        ## GA
        population_size: 10  # 种群大小
        tournament_size: 2  # 每次迭代中选取多少个最优个体不经过交叉、变异，直接复制进入下一代
        pc: 0.3  # 交叉概率
        pm: 0.5  # 变异概率
        
	# 待优化的超参数，以"参数名称: [样本空间, 空间类型]"的形式配置:
    params:
        ret:  [[1,5,1], 'Sequence']
        roll: [[5,15,1], 'Sequence']
        
matrix:
    mode: signal
    span: [2021-01-01, 2021-12-30]
    codes: custom_universe.pkl

strategy:
    Factor_stra:
        class: [strategy.py, TestStra]
                
evaluator:
    Factor_eval:
        class: [evaluator.py, TestEval]
```



### 6.3.3 如何运行

通过两行代码就可以将参数寻优运行起来：

```python
from transmatrix.workflow.run_optim import run_optim_matrix
result_df = run_optim_matrix('config.yaml')
```



**结果展示：**

- 使用网格搜索的策略研究参数优化

<div align=center>
<img width="300" src="TransMatrix使用手册/pics/optim_1.png"/>
</div>
<div align=left style="font-size:12px"></div>

- 使用遗传算法的因子研究参数优化

<div align=center>
<img width="300" src="TransMatrix使用手册/pics/optim_2.png"/>
</div>
<div align=left style="font-size:12px"></div>



### 6.3.4 如何使用早停法 Earlystopping

早停法的使用很简单，仅需在 OptimMatrix 里添加早停法的配置即可。

```yaml
OptimMatrix:
    max_workers: 10  # 并行运算的worker数量
    policy: GA  # 参数优化方法
    policy_params: 
        seed: 81
        max_iter: 30

        population_size: 10
        tournament_size: 2
        pc: 0.3
        pm: 0.5
        
    params:
        ret:  [[1,5,1], 'Sequence']
        roll: [[5,15,1], 'Sequence']
        
	# 早停法，可选
    earlystopping:
        patience: 3  # 不再提升的容忍次数
        delta: 0.0001  # 提升的最小变化量
        
matrix:
    ...(省略)

strategy:
    ...(省略)
                
evaluator:
    ...(省略)
```

## 6.4 使用外部数据

### 6.4.1 通过subscribe_data订阅外部数据

> 示例：订阅中低频量价数据
>
>```python
>class DataShowStrategy(Strategy):
>    def init(self):
>        # 订阅外部数据
>        ## 参数：
>            # name: 数据名称，自定义
>            # dataset_describe: ['file', 外部数据路径, codes, 字段列表, 缓冲期长度]
>        self.subscribe_data('pv', ['file', 'xxx.csv', self.codes, '订阅字段', 10])
>```

注意：

1.外部数据目前仅支持csv和parquet格式

2.外部数据中必须包含datetime字段

3.订阅后的外部数据将以DataView3d格式存储

### 6.4.2 通过Dataloader加载外部数据

通过自定义Dataloader来读取外部数据，首先需要在config.yaml中配置dataloader。

> 示例：通过Dataloader加载外部数据的config.yaml配置
>
>```yaml
>        
>matrix:
>    ...(省略)
>
>strategy:
>    ...(省略)
>                
>evaluator:
>    ...(省略)
>
>dataloader:
>   test_data: # 外部数据的名字，可以自定义
>       class: [dataloader.py, MyDataLoader] # 根据继承Dataloader类的新类所在的文件和类名修改
>```

然后，需要定义一个读取外部数据的Dataloader子类。

> 示例：读取外部数据的Dataloader子类
>
>```python
>        
>from transmatrix.data_api import DataLoader, DataView3d, create_data_view, Data3d
>from typing import Dict
>from datetime import datetime
>import pandas as pd
>import numpy as np
>
>
>class MyDataLoader(DataLoader):
>    
>    """
>    dataloader测试用例
>    """
>    
>    def process(self) -> Dict[str, pd.DataFrame]:
>        print(f'DataLoader{self.name}: loading data......')
>    
>        data = pd.read_csv('./xxx.csv')
>        # 将外部数据转换为DataView3d存储需要保证dataframe的index为datetime格式
>        data['datetime'] = data['datetime'].apply(lambda x: datetime.strptime(x, '%Y-%m-%d %H:%M:%S'))
>        data.set_index('datetime', inplace=True)      
>        return data
>    
>    def _load_feature_data(self):
>        df = self.process()
>        data = Data3d.from_dataframe(df)
>        view = create_data_view(data)
>        # is_dynamic目前仅支持为True，表示数据跟着回测更新
>        data.is_dynamic = True
>        data.view = view
>        self.data['data'] = data
>        self.view['data'] = view
>```

最后，介绍下如何在strategy中使用外部数据。

> 示例：strategy使用外部数据
>
>```python
>        
>from transmatrix import Strategy
>import pandas as pd
>
>
>class TestStra(Strategy):
>    def init(self):
>        self.pos = set()
>        self.anomaly_tr = None
>        
>    def on_init(self):
>        # 回测开始前，获取外部数据
>        self.anomaly_tr = self.dataloaders['test_data']['data']
>    
>    #回调执行逻辑： 行情更新时
>    def on_market_data_update(self, market):
>        anomaly_tr = pd.Series(self.anomaly_tr.get_dict('anomaly_tr_21'))
>        anomaly_tr = anomaly_tr.T.sort_values()
>        buy_codes = anomaly_tr.iloc[:10].index
>        
>        for code in buy_codes:
>            if code not in self.pos:
>                price = market.get('close', code)
>                self.buy(price, volume=10000, offset='open', code=code, market='stock')
>        
>        for code in self.pos - set(buy_codes):
>            pos = self.account.get_netpos(code)
>            price = market.get('close', code)
>            self.sell(price, volume=pos, offset='close', code=code, market='stock')
>        self.pos = set(buy_codes)
>```

### 6.4.3 通过Dataloader加载外部撮合数据

Transmatrix还支持将外部数据作为撮合数据，同样也是通过Dataloader加载。

首先，重写config.yaml。

> 示例：通过Dataloader加载外部撮合数据的config.yaml配置
>
>```yaml
>        
>matrix:
>    mode: simulation
>    span: [2020-01-01, 2020-12-31]
>    codes: [000001.SZ, 000002.SZ]
>    market:
>        stock:
>            data: [dataloader, test_data] # list中的第二个值根据dataloader中的配置修改
>            matcher: daily # 撮合器，如果是tick级数据，需要修改为tick
>            account: detail
>    fee_rate: 0.0001
>
>strategy:
>    ...(省略)
>                
>evaluator:
>    ...(省略)
>
>dataloader:
>   test_data: # 外部数据的名字，可以自定义
>       class: [dataloader.py, MyDataLoader] # 根据继承Dataloader类的新类所在的文件和类名修改
>```

然后，需要定义一个读取外部撮合数据的Dataloader子类。

> 示例：读取外部数据的Dataloader子类
>
>```python
>        
>from transmatrix.data_api import DataLoader, DataView3d, create_data_view, Data3d
>from typing import Dict
>from datetime import datetime
>import pandas as pd
>import numpy as np
>
>
>class MyDataLoader(DataLoader):
>    
>    """
>    dataloader测试用例
>    """
>
>    is_market_data = True
>    market_data_type = 'bar'
>    def process(self) -> Dict[str, pd.DataFrame]:
>        print(f'DataLoader{self.name}: loading data......') 
>
>        df = pd.read_csv('./xxx.csv')
>        return df
>```


