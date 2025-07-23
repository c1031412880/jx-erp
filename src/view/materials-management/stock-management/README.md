# 零库存客户表

## 功能概述

零库存客户表是一个用于查看和统计客户（供应商）零库存情况的报表功能。该功能模仿物料收发结存表的样式，提供了直观的数据展示和查询功能。

## 功能特点

- **动态表格**: 支持动态列配置，可根据后端返回的数据结构自动调整
- **查询条件丰富**: 支持起止日期、供应商多选、含税/不含税选择
- **数据汇总**: 自动计算合计数据并显示在表格底部
- **数据导出**: 支持将查询结果导出为Excel文件
- **用户体验**: 包含加载状态、错误处理、表单验证等完善的交互功能

## 查询条件

### 1. 起止日期（必填）
- 类型：日期范围选择器
- 格式：YYYY-MM-DD
- 说明：查询指定时间范围内的零库存客户数据
- 默认值：当前月份的第一天至最后一天
- 限制：查询时间范围不能超过一年

### 2. 供应商（可选）
- 类型：多选下拉框
- 说明：可选择多个供应商进行筛选，不选择则查询所有供应商
- 数据源：通过`GetProviderPage`接口获取供应商列表
- 支持搜索：可通过关键词搜索供应商

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

## 表格列说明

### 1. 供应商
- 显示供应商名称
- 宽度：200px
- 对齐方式：居中

### 2. 不含税
- 显示不含税金额
- 宽度：130px
- 对齐方式：居中
- 数据类型：数值，参与合计计算

### 3. 含税
- 显示含税金额
- 宽度：130px
- 对齐方式：居中
- 数据类型：数值，参与合计计算

## 接口对接

### 数据查询接口
- **接口名称**: `/api/ERPWeb/InventoryReport/GetZeroStockCustomerBalance`
- **接口方法**: `GetZeroStockCustomerBalance`
- **请求方式**: POST

#### 请求参数结构
```javascript
{
  context: {
    start_time: "2025-06-01 00:00:00",    // 开始时间
    end_time: "2025-06-30 23:59:59",      // 结束时间
    supplier_ids: [1, 2, 3],              // 供应商ID数组（可选）
    is_include_tax: true                   // 是否含税
  }
}
```

#### 响应数据结构
```javascript
{
  head: {
    result: "200",
    describle: "成功"
  },
  context: {
    heads: [
      {
        name: "供应商",
        data_symbol: "supplier_name",
        width: "200",
        is_sum: false,
        data_type: "string"
      },
      {
        name: "不含税",
        data_symbol: "amount_without_tax",
        width: "130",
        is_sum: true,
        data_type: "number"
      },
      {
        name: "含税",
        data_symbol: "amount_with_tax",
        width: "130",
        is_sum: true,
        data_type: "number"
      }
    ],
    datas: [
      {
        supplier_name: "北京供应商A",
        amount_without_tax: 10,
        amount_with_tax: 11.3
      }
    ]
  }
}
```

### 数据导出接口
- **接口名称**: `/api/ERPWeb/InventoryReport/ExportZeroStockCustomerBalance`
- **接口方法**: `ExportZeroStockCustomerBalance`
- **请求方式**: POST

#### 请求参数结构
与查询接口相同

#### 响应数据结构
```javascript
{
  head: {
    result: "200",
    describle: "导出成功"
  },
  context: {
    download_url: "http://example.com/download/file.xlsx"
  }
}
```

## 文件结构

```
src/view/materials-management/stock-management/
├── zero-stock-customer.vue                    # 主页面组件
├── component/
│   └── zero-stock-customer-sub-req.vue       # 查询条件组件
└── README.md                                  # 功能说明文档
```

## 组件依赖

### 主要依赖组件
- `tr-table`: 表格组件，用于显示数据和合计
- `get-supplier-select`: 供应商选择组件

### 工具依赖
- `getDate`: 日期工具函数
- 相关API接口方法

## 使用说明

### 1. 页面访问
- 路由路径：`/materials-management/inventory-management/zero-stock-customer`
- 菜单位置：物资管理 > 库存管理 > 零库存客户表

### 2. 基本操作
1. 选择查询时间范围
2. 可选择特定供应商进行筛选
3. 选择含税或不含税显示方式
4. 点击查询按钮获取数据
5. 查看表格数据和底部合计信息
6. 可导出数据为Excel文件

### 3. 注意事项
- 查询时间范围不能超过一年
- 开始日期不能大于结束日期
- 导出功能需要后端接口支持
- 供应商选择支持多选和搜索

## 开发状态

### 已完成功能
- ✅ 基本页面结构和样式
- ✅ 查询条件组件
- ✅ 表格展示和合计功能
- ✅ 供应商选择组件
- ✅ 模拟数据展示
- ✅ 响应式布局
- ✅ 错误处理和用户反馈

### 待完成功能
- ⏳ 后端接口对接
- ⏳ 数据导出功能实现
- ⏳ 高级筛选选项
- ⏳ 数据缓存优化

## 样式特点

- 采用现代化的卡片式设计
- 支持响应式布局，适配不同屏幕尺寸
- 统一的配色方案和交互效果
- 清晰的数据展示和合计显示
- 友好的用户操作提示

## 扩展建议

1. **更多筛选条件**: 可增加物料分类、仓库等筛选条件
2. **图表展示**: 可增加图表形式展示零库存趋势
3. **数据钻取**: 支持点击供应商查看详细数据
4. **批量操作**: 支持批量处理零库存客户
5. **定时任务**: 支持定时生成零库存报告 