# 物料收发结存表

## 功能概述

物料收发结存表是一个用于统计和分析物料收入、发出、结存情况的报表功能。该报表支持分公司筛选、时间范围查询、含税/不含税选择和数据导出功能。

## 功能特点

- **动态表格**: 所有列头都是动态生成的，根据API返回的数据结构自动调整
- **查询条件丰富**: 支持起止日期、分公司多选、含税/不含税选择
- **数据汇总**: 自动计算合计数据并显示在表格底部
- **数据导出**: 支持将查询结果导出为Excel文件
- **用户体验**: 包含加载状态、错误处理、表单验证等完善的交互功能

## 查询条件

### 1. 统计日期（必填）
- 类型：日期范围选择器
- 格式：YYYY-MM-DD
- 说明：查询指定时间范围内的物料收发结存数据
- 默认值：当前月份的第一天至最后一天

### 2. 分公司（可选）
- 类型：多选下拉框
- 说明：可选择多个分公司进行筛选，不选择则查询所有分公司
- 数据源：通过`GetDeptInfoCaches`接口获取分公司列表

### 3. 税费（必选）
- 类型：单选按钮组
- 选项：
  - 含税：显示含税金额
  - 不含税：显示不含税金额
- 默认值：含税

### 4. 操作按钮
- **查询**：执行数据查询操作
- **重置**：重置所有查询条件为默认值
- **导出**：导出当前查询结果为Excel文件

## 接口对接

### 数据查询接口
- **接口名称**: `/api/ERPWeb/InventoryReport/GetMaterialReceiptIssueBalance`
- **接口方法**: `GetMaterialReceiptIssueBalance`
- **请求方式**: POST

#### 请求参数结构
```javascript
{
  "context": {
    "start_time": "2025-01-01T00:00:00Z",  // ISO格式开始时间
    "end_time": "2025-01-31T23:59:59Z",    // ISO格式结束时间
    "dept_ids": [1, 2, 3],                 // 分公司ID数组，空数组表示全部
    "is_include_tax": true                 // 是否含税
  }
}
```

#### 响应数据结构
```javascript
{
  "head": {
    "cmd": "string",
    "result": "200",           // 成功状态码
    "describle": "string",     // 错误描述
    "detail": "string"
  },
  "context": {
    "heads": [                 // 动态列头配置
      {
        "name": "物料名称",        // 列显示名称
        "data_symbol": "materialName"  // 数据字段名
      },
      {
        "name": "期初结存",      // 列显示名称
        "data_symbol": "beginBalance"  // 数据字段名
      },
      {
        "name": "本期收入",      // 列显示名称
        "data_symbol": "currentReceipt"  // 数据字段名
      },
      {
        "name": "本期发出",      // 列显示名称
        "data_symbol": "currentIssue"  // 数据字段名
      },
      {
        "name": "期末结存",      // 列显示名称
        "data_symbol": "endBalance"  // 数据字段名
      }
    ],
    "datas": [                // 表格数据（最后一行为合计数据）
      {
        "materialName": "螺丝",
        "beginBalance": 1000,
        "currentReceipt": 500,
        "currentIssue": 300,
        "endBalance": 1200
      },
      {
        "materialName": "螺母",
        "beginBalance": 800,
        "currentReceipt": 200,
        "currentIssue": 150,
        "endBalance": 850
      },
      {
        "materialName": "合计",    // 最后一行为合计行
        "beginBalance": 1800,
        "currentReceipt": 700,
        "currentIssue": 450,
        "endBalance": 2050
      }
    ]
  }
}
```

### 导出接口
- **接口名称**: `/api/ERPWeb/InventoryReport/ExportMaterialReceiptIssueBalance`
- **接口方法**: `ExportMaterialReceiptIssueBalance`
- **请求方式**: POST
- **请求参数**: 与查询接口相同
- **返回结果**: 文件下载链接

## 技术实现

### 核心组件
- **主页面**: `index.vue` - 负责数据展示和业务逻辑
- **查询组件**: `component/sub-req.vue` - 负责查询条件的展示和处理

### 主要功能模块

#### 1. 动态表格列生成
```javascript
buildDynamicColumns(heads) {
  this.customSettingList = [];
  heads.forEach((head, index) => {
    this.customSettingList.push({
      id: index + 1,
      label: head.name,
      prop: head.data_symbol,
      width: "120",
      align: index === 0 ? "left" : "right",
      signIndex: index,
      sortable: false,
    });
  });
}
```

#### 2. 数据处理和合计计算
```javascript
processTableData(datas, heads) {
  // 分离普通数据和合计数据
  const normalData = datas.slice(0, -1);
  const summaryData = datas[datas.length - 1];
  
  // 处理普通数据（格式化数值）
  // 处理合计数据（显示在表格底部）
}
```

#### 3. 日期处理
```javascript
formatDateToISO(dateStr, timeStr = '00:00:00') {
  // 将YYYY-MM-DD格式转换为ISO格式
  // 包含时区处理和错误验证
}
```

## 错误处理

### 1. 网络错误
- 显示用户友好的错误提示
- 自动重置加载状态
- 记录详细错误日志

### 2. 数据验证
- 必填字段验证
- 日期范围合理性检查
- 数据格式验证

### 3. 导出异常
- 验证是否有数据可导出
- 处理文件下载失败情况
- 显示导出进度提示

## 使用说明

1. **选择统计日期**：默认显示当前月份，可手动调整时间范围
2. **选择分公司**：可多选，不选择时查询所有分公司数据
3. **选择税费模式**：根据需要选择含税或不含税显示模式
4. **执行查询**：点击查询按钮获取数据
5. **导出数据**：查询成功后可点击导出按钮下载Excel文件
6. **重置条件**：点击重置按钮恢复默认查询条件

## 注意事项

1. **权限控制**：页面已配置相应的权限控制，需要有相应权限才能访问
2. **数据量限制**：大数据量查询可能需要较长时间，已添加加载状态提示
3. **浏览器兼容性**：支持现代浏览器，建议使用Chrome、Firefox等
4. **网络依赖**：功能依赖于后端API，网络异常时会显示相应提示

## 更新日志

### v1.0.0 (2025-01-16)
- 初始版本发布
- 实现基础查询功能
- 支持动态表格展示
- 添加导出功能
- 完善错误处理机制 