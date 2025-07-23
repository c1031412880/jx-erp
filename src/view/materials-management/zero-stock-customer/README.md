# 零库存客户表

## 模块说明
零库存客户表是物料管理系统中的一个重要功能模块，用于查询和展示零库存客户的相关信息。

## 文件结构
```
zero-stock-customer/
├── index.vue              # 主页面组件
├── component/
│   └── sub-req.vue        # 查询条件组件
└── README.md              # 说明文档
```

## 功能特性
- **零库存查询**: 查询指定时间范围内的零库存客户信息
- **供应商筛选**: 支持多选供应商进行数据筛选
- **含税/不含税切换**: 支持含税和不含税数据的切换查看
- **数据导出**: 支持将查询结果导出为Excel文件
- **实时计算**: 自动计算不含税和含税金额的合计
- **响应式布局**: 支持不同屏幕尺寸的自适应显示

## 页面组件

### 主页面 (index.vue)
- 负责整体页面布局和数据管理
- 集成查询条件组件和表格展示组件
- 处理数据加载、处理和错误管理
- 提供模拟数据用于开发和测试

### 查询条件组件 (component/sub-req.vue)
- 日期范围选择器（支持最大一年范围）
- 供应商多选下拉框
- 含税/不含税单选按钮
- 查询、重置、导出功能按钮

## API接口

### 查询接口
```javascript
// 接口方法名：GetZeroStockCustomerBalance
// 请求参数：
{
  context: {
    start_time: "2024-01-01 00:00:00",  // 开始时间
    end_time: "2024-01-31 23:59:59",    // 结束时间
    supplier_ids: [1, 2, 3],            // 供应商ID列表（可选）
    is_include_tax: true                 // 是否含税
  }
}

// 响应格式：
{
  head: {
    result: "200",
    describle: "成功"
  },
  context: {
    heads: [                             // 列头配置
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
    datas: [                             // 数据列表
      {
        supplier_name: "北京供应商A",
        amount_without_tax: 10.00,
        amount_with_tax: 11.30
      }
    ]
  }
}
```

### 导出接口
```javascript
// 接口方法名：ExportZeroStockCustomerBalance
// 请求参数：与查询接口相同
// 响应格式：
{
  head: {
    result: "200",
    describle: "导出成功"
  },
  context: {
    download_url: "http://example.com/export.xlsx"  // 下载链接
  }
}
```

## 数据结构

### 表格数据字段
- `supplier_name`: 供应商名称
- `amount_without_tax`: 不含税金额
- `amount_with_tax`: 含税金额

### 查询条件字段
- `start_date`: 开始日期 (YYYY-MM-DD格式)
- `end_date`: 结束日期 (YYYY-MM-DD格式)
- `supplier_ids`: 供应商ID数组
- `is_include_tax`: 是否含税 (boolean)

## 权限配置
- 权限码：`10032500`
- 路由路径：`/materials-management/zero-stock-customer`
- 菜单标题：零库存客户表

## 开发注意事项

1. **日期验证**: 查询时间范围不能超过一年
2. **数据处理**: 所有数值计算需要处理浮点数精度问题
3. **错误处理**: 完整的错误捕获和用户友好的错误提示
4. **性能优化**: 大数据量时考虑分页或虚拟滚动
5. **响应式设计**: 确保在不同设备上的良好体验

## 使用说明

1. **进入页面**: 通过物料管理菜单进入零库存客户表
2. **设置条件**: 选择查询日期范围，可选择供应商和税费类型
3. **查询数据**: 点击查询按钮获取数据
4. **查看结果**: 在表格中查看零库存客户信息和合计数据
5. **导出数据**: 有数据时可点击导出按钮下载Excel文件

## 更新记录

### v1.0.0 (2024-01-20)
- 初始版本发布
- 支持基本的查询和导出功能
- 模拟数据用于开发测试

## 技术依赖
- Vue 2.x
- Element UI
- Axios (HTTP请求)
- 自定义表格组件 (tr-table)
- 供应商选择组件 (get-supplier-select)

## 待完成功能
- [ ] 后端API接口对接
- [ ] 实际数据展示
- [ ] Excel导出功能实现
- [ ] 数据缓存优化
- [ ] 打印功能 