export default {
  state: [
    {label: '未审核', value: 1},
    {label: '已审核', value: 2},
    {label: '取消审核', value: 3},
  ],
  type: [
    {label: '日常', value: 1},
    {label: '月度', value: 2},
    {label: '季度', value: 3},
    {label: '年度', value: 4},
    {label: '盘查', value: 5},
  ],
  headData: [
    {
      id: 1,
      label: "名称（物料编码）",
      prop: "code",
      width: "250",
      align: "center",
      signIndex:0
    },
    {
      id: 2,
      label: "物料名称",
      prop: "name",
      width: "140",
      align: "center",
      signIndex:1
    },
    {
      id: 3,
      label: "规格型号",
      prop: "specification",
      width: "140",
      align: "center",
      signIndex:2
    },
    {
      id: 4,
      label: "单位",
      prop: "unit",
      width: "140",
      align: "center",
      signIndex:3
    },
    {
      id: 5,
      label: "库存数量",
      prop: "inventory_count",
      width: "140",
      align: "center",
      signIndex:4
    },
    {
      id: 6,
      label: "实存数量",
      prop: "real_count",
      width: "140",
      align: "center",
      signIndex:5
    },
    {
      id: 7,
      label: "盘点差异",
      prop: "difference",
      width: "140",
      align: "center",
      signIndex:6
    },
    {
      id: 8,
      label: "盈亏金额（元）",
      prop: "fee",
      width: "140",
      align: "center",
      signIndex: 7
    },
    {
      id: 9,
      label: "盘点状态",
      prop: "state",
      width: "140",
      align: "center",
      signIndex:8
    },
    {
      id: 10,
      label: "操作",
      prop: "operation",
      width: "140",
      align: "center",
      signIndex:9
    },
  ],
  TableHeight: 300,
  frontFixedNum: 1,
  backFixedNum: 1,
  formModel: {
    material_id: '',
    code: '',
    name: '',
    specification: '',
    unit: '',
    inventory_count: '',
    real_count: '',
    difference: '',
    state: '',
    state_name: ''
  },
  warehousingHeadData: [
    {
      id: 1,
      label: "物料编码",
      prop: "material_code",
      width: "140",
      align: "center",
      signIndex:0
    },
    {
      id: 2,
      label: "物料名称",
      prop: "material_name",
      width: "140",
      align: "center",
      signIndex:1
    },
    {
      id: 3,
      label: "规格型号",
      prop: "specification",
      width: "140",
      align: "center",
      signIndex:2
    },
    {
      id: 4,
      label: "计量单位",
      prop: "measure_unit_name",
      width: "140",
      align: "center",
      signIndex:3
    },
    {
      id: 5,
      label: "品牌",
      prop: "brand",
      width: "140",
      align: "center",
      signIndex:4
    },
    {
      id: 6,
      label: "申请入库数量",
      prop: "count",
      width: "140",
      align: "center",
      signIndex:5
    },
    {
      id: 7,
      label: "单价",
      prop: "price",
      width: "140",
      align: "center",
      signIndex:6
    },
    {
      id: 8,
      label: "金额",
      prop: "total_price",
      width: "140",
      align: "center",
      signIndex:7
    },
    {
      id: 9,
      label: "批次",
      prop: "batch_no",
      width: "140",
      align: "center",
      signIndex:8
    },
    {
      id: 10,
      label: "供应商",
      prop: "provider_name",
      width: "140",
      align: "center",
      signIndex:9
    },
    {
      id: 11,
      label: "原始物料编码",
      prop: "origin_code",
      width: "140",
      align: "center",
      signIndex:10
    },
    {
      id: 12,
      label: "仓位",
      prop: "position",
      width: "140",
      align: "center",
      signIndex:11
    },
  ],
  issueHeadData: [
    {
      id: 1,
      label: "物料编码",
      prop: "material_code",
      width: "140",
      align: "center",
      signIndex:0
    },
    {
      id: 2,
      label: "物料名称",
      prop: "material_name",
      width: "140",
      align: "center",
      signIndex:1
    },
    {
      id: 3,
      label: "规格型号",
      prop: "specification",
      width: "140",
      align: "center",
      signIndex:2
    },
    {
      id: 4,
      label: "计量单位",
      prop: "measure_unit_name",
      width: "140",
      align: "center",
      signIndex:3
    },
    {
      id: 5,
      label: "品牌",
      prop: "brand",
      width: "140",
      align: "center",
      signIndex:4
    },
    {
      id: 6,
      label: "申请出库数量",
      prop: "count",
      width: "140",
      align: "center",
      signIndex:5
    },
    {
      id: 7,
      label: "单价",
      prop: "price",
      width: "140",
      align: "center",
      signIndex:6
    },
    {
      id: 8,
      label: "总金额",
      prop: "total_price",
      width: "140",
      align: "center",
      signIndex:7
    },
    {
      id: 9,
      label: "当时库存",
      prop: "current_inventory",
      width: "140",
      align: "center",
      signIndex:8
    },
    {
      id: 10,
      label: "全部库存",
      prop: "total_inventory",
      width: "140",
      align: "center",
      signIndex:9
    },
    {
      id: 11,
      label: "批次",
      prop: "batch_no",
      width: "140",
      align: "center",
      signIndex:10
    },
    {
      id: 12,
      label: "备注",
      prop: "remark",
      width: "140",
      align: "center",
      signIndex:11
    },
  ],
}
