const headerData = {
  'first':[
    {
      id: 1,
      label: "工单号码",
      prop: "work_code",
      width: "150",
      align: "center",
      signIndex:0,
      sortable:true
    },
    {
      id: 2,
      label: "工单状态",
      prop: "state_detail_name",
      width: "140",
      align: "center",
      signIndex:1,
      sortable:true
    },
    {
      id: 3,
      label: "自编号",
      prop: "vehicle_number",
      width: "110",
      align: "center",
      signIndex:2,
      sortable:true
    },
    {
      id: 4,
      label: "车牌号",
      prop: "vehicle_name",
      width: "110",
      align: "center",
      signIndex:3,
      sortable:true
    },
    {
      id: 5,
      label: "所属组织",
      prop: "department_name",
      width: "130",
      align: "center",
      signIndex:4,
      sortable:true
    },
    {
      id: 6,
      label: "车辆型号",
      prop: "vehicle_kind_name",
      width: "120",
      align: "center",
      signIndex:5,
      sortable:true
    },
    {
      id: 7,
      label: "工单类别",
      prop: "type_child_name",
      width: "130",
      align: "center",
      signIndex:6,
      sortable:true
    },
    {
      id: 8,
      label: "报修时间",
      prop: "repair_time",
      width: "120",
      align: "center",
      signIndex:7,
      sortable:true
    },
    {
      id: 9,
      label: "报修地点",
      prop: "maint_dept_name",
      width: "120",
      align: "center",
      signIndex:8,
      sortable:true
    },
    {
      id: 10,
      label: "报修内容",
      prop: "describe",
      width: "120",
      align: "center",
      signIndex:9,
      sortable:true
    },
    {
      id: 11,
      label: "维修项目",
      prop: "item_name",
      width: "135",
      align: "center",
      signIndex:10,
      sortable:true
    },
    {
      id: 12,
      label: "维修人员",
      prop: "person_name",
      width: "140",
      align: "center",
      signIndex:11,
      sortable:true
    },
    {
      id: 13,
      label: "总工时",
      prop: "total_hours",
      width: "110",
      align: "center",
      signIndex:12,
      sortable:true
    },
    {
      id: 14,
      label: "材料费",
      prop: "total_materials",
      width: "110",
      align: "center",
      signIndex:13,
      sortable:true
    },
    {
      id: 15,
      label: "工时费",
      prop: "total_hours_fees",
      width: "150",
      align: "center",
      signIndex:14,
      sortable:true
    },
    {
      id: 15,
      label: "总费用",
      prop: "total_fees",
      width: "150",
      align: "center",
      signIndex:14,
      sortable:true
    },
    {
      id: 16,
      label: "完工时间",
      prop: "finish_check_time",
      width: "150",
      align: "center",
      signIndex:15,
      sortable:true
    },
    {
      id: 17,
      label: "出厂时间",
      prop: "out_time",
      width: "120",
      align: "center",
      signIndex:16,
      sortable:false
    },
     {
      id: 18,
      label: "工单备注",
      prop: "remark",
      width: "120",
      align: "center",
      signIndex:17,
      sortable:false
    },
  ],
  'second':[
    {
      id: 1,
      label: "出库单号",
      prop: "leave_num",
      width: "150",
      align: "center",
      signIndex: 0,
      sortable: true,
    },
    {
      id: 2,
      label: "出库类型",
      prop: "leave_type",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    },
     {
      id: 3,
      label: "出库仓库",
      prop: "house_name",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    },
     {
      id: 4,
      label: "出库日期",
      prop: "leave_date",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    },
     {
      id: 5,
      label: "领料人",
      prop: "pick_name",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    }, 
    {
      id: 6,
      label: "物料编码",
      prop: "material_code",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
    },
     {
      id: 7,
      label: "物料名称",
      prop: "material_name",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
    {
      id: 8,
      label: "规格型号",
      prop: "specification",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
      {
      id: 9,
      label: "计量单位",
      prop: "measure_unit_name",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
     {
      id: 10,
      label: "品牌",
      prop: "brand",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
    {
      id: 11,
      label: "出库数量",
      prop: "count",
      width: "160",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
     {
      id: 12,
      label: "单价",
      prop: "price",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
     {
      id: 13,
      label: "总金额",
      prop: "total_price",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
     {
      id: 14,
      label: "批次",
      prop: "batch_no",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
     {
      id: 15,
      label: "备注",
      prop: "remark",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
  ],
  'third':[{
    id: 1,
    label: "自编号",
    prop: "self_id",
    width: "140",
    align: "center",
    signIndex: 0
  }, {
    id: 2,
    label: "车牌号",
    prop: "lincense_plate_number",
    width: "140",
    align: "center",
    signIndex: 1
  }, {
    id: 3,
    label: "日期",
    prop: "date",
    width: "140",
    align: "center",
    signIndex: 2
  }, {
    id: 4,
    label: "里程（KM）",
    prop: "mile",
    width: "140",
    align: "center",
    signIndex: 3
  }, {
    id: 5,
    label: "来源",
    prop: "origitype",
    width: "140",
    align: "center",
    signIndex: 4
  }, {
    id: 6,
    label: "录入人员",
    prop: "create_user_name",
    width: "140",
    align: "center",
    signIndex: 5
  }, {
    id: 7,
    label: "录入时间",
    prop: "create",
    width: "140",
    align: "center",
    signIndex: 6
  }]
}

export default headerData