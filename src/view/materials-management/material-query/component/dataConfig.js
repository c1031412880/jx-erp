export default {
  collectionTableHeaderData: [
    {
      id: 1,
      label: "领料单号",
      prop: "code",
      width: "140",
      align: "center",
      signIndex:0
    },
    {
      id: 2,
      label: "领料日期",
      prop: "pick_date",
      width: "160",
      align: "center",
      signIndex:1
    },
    {
      id: 3,
      label: "登记日期",
      prop: "created_date",
      width: "200",
      align: "center",
      signIndex:2
    },
    {
      id: 4,
      label: "待料时长（分钟）",
      prop: "waiting_time",
      width: "200",
      align: "center",
      signIndex:3
    },
    {
      id:5,
      label: "物料编码",
      prop: "material_code",
      width: "200",
      align: "center",
      signIndex:4
    },
    {
      id: 6,
      label: "物料名称",
      prop: "material_name",
      width: "160",
      align: "center",
      signIndex:5
    },
    {
      id: 7,
      label: "规格型号",
      prop: "specification",
      width: "160",
      align: "center",
      signIndex:6
    },
    {
      id: 8,
      label: "单位",
      prop: "measure_unit_name",
      width: "120",
      align: "center",
      signIndex: 7
    },
    {
      id: 9,
      label: "领取数量",
      prop: "count",
      width: "160",
      align: "center",
      signIndex: 8
    },
    {
      id: 10,
      label: "关联工单号",
      prop: "work_code",
      width: "130",
      align: "center",
      signIndex: 9
    },
    {
      id: 11,
      label: "关联出库单号",
      prop: "out_code",
      width: "130",
      align: "center",
      signIndex: 10
    },
    {
      id: 12,
      label: "车辆",
      prop: "lp_num",
      width: "130",
      align: "center",
      signIndex: 11
    },
    {
      id: 13,
      label: "自编号",
      prop: "lp_self_number",
      width: "130",
      align: "center",
      signIndex: 12
    },
    {
      id: 14,
      label: "领料人",
      prop: "pick_user_name",
      width: "130",
      align: "center",
      signIndex: 13
    },
    {
      id: 15,
      label: "仓库",
      prop: "warenhouse_name",
      width: "130",
      align: "center",
      signIndex: 14
    },
    {
      id: 16,
      label: "备注",
      prop: "remark",
      width: "130",
      align: "center",
      signIndex: 15
    },
    {
      id: 17,
      label: "操作",
      prop: "operation",
      width: "240",
      align: "center",
      signIndex: 16
    },
  ],
  returnTableHeaderData: [{
    id: 1,
    label: "退料单号",
    prop: "code",
    width: "140",
    align: "center",
    signIndex:0
  },
  {
    id: 2,
    label: "退料日期",
    prop: "created_date",
    width: "160",
    align: "center",
    signIndex:1
  },
  {
    id: 3,
    label: "物料编码",
    prop: "groupgo",
    width: "200",
    align: "center",
    signIndex:2
  },
  {
    id: 4,
    label: "物料名称",
    prop: "material_name",
    width: "160",
    align: "center",
    signIndex:3
  },
  {
    id: 5,
    label: "规格型号",
    prop: "specification",
    width: "160",
    align: "center",
    signIndex:4
  },
  {
    id: 6,
    label: "单位",
    prop: "measure_unit_name",
    width: "120",
    align: "center",
    signIndex: 6
  },
  {
    id: 7,
    label: "退料数量",
    prop: "count",
    width: "160",
    align: "center",
    signIndex: 6
  },
  {
    id: 8,
    label: "关联工单号",
    prop: "work_code",
    width: "130",
    align: "center",
    signIndex: 7
  },
  {
    id: 9,
    label: "关联退料入库单",
    prop: "in_code",
    width: "160",
    align: "center",
    signIndex: 8
  },
  {
    id: 10,
    label: "车辆",
    prop: "lp_num",
    width: "130",
    align: "center",
    signIndex: 9
  },
  {
    id: 11,
    label: "退料人",
    prop: "created_name",
    width: "130",
    align: "center",
    signIndex: 10
  },
  {
    id: 12,
    label: "仓库",
    prop: "warenhouse_name",
    width: "130",
    align: "center",
    signIndex: 11
  },
  {
    id: 13,
    label: "备注",
    prop: "remark",
    width: "130",
    align: "center",
    signIndex: 12
  },
  {
    id: 14,
    label: "操作",
    prop: "operation",
    width: "240",
    align: "center",
    signIndex: 13
  }],
  mergeKeys: [
    "code",
    "pick_date",
    "work_code",
    "lp_num",
    "out_code",
    "pick_user_name",
    "warenhouse_name",
    "waiting_time",
    "remark",
    "operation"
  ],
  returnMergeKeys: [
    "code",
    "created_date",
    "work_code",
    "lp_num",
    "in_code",
    "created_name",
    "warenhouse_name",
    "remark",
    "operation"
  ]
}
