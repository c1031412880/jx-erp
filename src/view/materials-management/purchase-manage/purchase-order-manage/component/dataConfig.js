export default {
  formModel: {
    material_id: '',
    price: 0,
    count: 0,
    fee: 0,
    remark: '',
    code: '',
    name: '',
    specification: '',
    unit: ''
  },
  detailsHead: [
    {
      id: 1,
      label: "物资编码",
      prop: "code",
      width: "180",
      align: "center",
      signIndex:0
    },
    {
      id: 2,
      label: "物资名称",
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
      label: "计量单位",
      prop: "unit",
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
      label: "数量",
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
      prop: "fee",
      width: "140",
      align: "center",
      signIndex:7
    },
    {
      id: 9,
      label: "备注",
      prop: "remark",
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
  tableHeaderData: [
    {
      id: 1,
      label: "采购单编号",
      prop: "purchase_code",
      width: "140",
      align: "center",
      signIndex:0
    },
    {
      id: 2,
      label: "审核状态",
      prop: "state",
      width: "140",
      align: "center",
      signIndex:1
    },
    {
      id: 3,
      label: "采购日期",
      prop: "purchase_date",
      width: "140",
      align: "center",
      signIndex: 2
    },
    {
      id: 4,
      label: "供应商",
      prop: "supplier_name",
      width: "140",
      align: "center",
      signIndex:3
    },
    {
      id: 5,
      label: "采购员",
      prop: "purchase_user_name",
      width: "140",
      align: "center",
      signIndex:4
    },
    {
      id: 6,
      label: "总金额(元)",
      prop: "total_fee",
      width: "140",
      align: "center",
      signIndex:5
    },
    {
      id: 7,
      label: "采购组织",
      prop: "purchase_dept_name",
      width: "140",
      align: "center",
      signIndex:6
    },
    {
      id: 8,
      label: "采购方式",
      prop: "type_name",
      width: "140",
      align: "center",
      signIndex: 7
    },
    {
      id: 9,
      label: "物资编码",
      prop: "code",
      width: "140",
      align: "center",
      signIndex: 8
    },
    {
      id: 10,
      label: "规格型号",
      prop: "specification",
      width: "140",
      align: "center",
      signIndex:9
    },
    {
      id: 11,
      label: "计量单位",
      prop: "unit",
      width: "140",
      align: "center",
      signIndex:10
    },
    {
      id: 12,
      label: "品牌",
      prop: "brand",
      width: "140",
      align: "center",
      signIndex:11
    },
    {
      id: 13,
      label: "数量",
      prop: "count",
      width: "140",
      align: "center",
      signIndex:12
    },
    {
      id: 14,
      label: "含税单价",
      prop: "price",
      width: "140",
      align: "center",
      signIndex:13
    },
    {
      id: 15,
      label: "金额",
      prop: "fee",
      width: "140",
      align: "center",
      signIndex:14
    },
    {
      id: 16,
      label: "原始物料编码",
      prop: "code",
      width: "140",
      align: "center",
      signIndex:15
    },
    {
      id: 17,
      label: "备注",
      prop: "remark",
      width: "140",
      align: "center",
      signIndex:16
    },
    {
      id: 18,
      label: "提交人",
      prop: "created_name",
      width: "140",
      align: "center",
      signIndex:17
    },
    {
      id: 19,
      label: "提交时间",
      prop: "created_date",
      width: "140",
      align: "center",
      signIndex:18
    },
    {
      id: 20,
      label: "入库仓库",
      prop: "house_name",
      width: "140",
      align: "center",
      signIndex:19
    },
    {
      id: 21,
      label: "入库状态",
      prop: "enter_state",
      width: "140",
      align: "center",
      signIndex:20
    },
    {
      id: 22,
      label: "入库数量",
      prop: "enter_count",
      width: "140",
      align: "center",
      signIndex:21
    },
    {
      id: 23,
      label: "操作",
      prop: "operation",
      width: "140",
      align: "center",
      signIndex: 22
    },
  ],
  mergeKeys: [
    'purchase_code',
    'total_fee',
    'state',
    'purchase_date',
    'supplier_name',
    'purchase_user_name',
    'purchase_dept_name',
    'type_name',
    'remark',
    'created_date',
    'created_name',
    'enter_state',
    'enter_count',
    'operation'
  ]
}
