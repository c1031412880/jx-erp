const headerData = {
  'first':[
    {
      id: 1,
      label: "工单号码",
      prop: "work_code",
      width: "120",
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
      label: "维修车间",
      prop: "maint_dept_name",
      width: "120",
      align: "center",
      signIndex:8,
      sortable:true
    },
    {
      id: 10,
      label: "优先级",
      prop: "priority_name",
      width: "100",
      align: "center",
      signIndex:9,
      sortable:true
    },
    {
      id: 11,
      label: "检验时间",
      prop: "check_time",
      width: "135",
      align: "center",
      signIndex:10,
      sortable:true
    },
    {
      id: 12,
      label: "检验备注",
      prop: "check_describe",
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
      label: "工时费",
      prop: "total_hours_fees",
      width: "110",
      align: "center",
      signIndex:13,
      sortable:true
    },
    {
      id: 15,
      label: "材料费",
      prop: "total_materials",
      width: "110",
      align: "center",
      signIndex:14,
      sortable:true
    },
    {
      id: 16,
      label: "接修时间",
      prop: "receive_time",
      width: "150",
      align: "center",
      signIndex:15,
      sortable:true
    },
    {
      id: 17,
      label: "完工时间",
      prop: "finish_time",
      width: "150",
      align: "center",
      signIndex:16,
      sortable:true
    },
    {
      id: 18,
      label: "完工单",
      prop: "wgd",
      width: "120",
      align: "center",
      signIndex:17,
      sortable:false
    }
  ],
  'second':[
    // {
    //   id: 1,
    //   label: "驾驶员",
    //   prop: "driver_name",
    //   width: "150",
    //   align: "center",
    //   signIndex: 0,
    //   sortable: true,
    // },
    // {
    //   id: 2,
    //   label: "自编号",
    //   prop: "vehicle_number",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: true,
    // },
    //  {
    //   id: 3,
    //   label: "车牌号",
    //   prop: "lincense_plate_number",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: true,
    // },
    //  {
    //   id: 4,
    //   label: "所属组织",
    //   prop: "department_name",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: true,
    // },
    // {
    //   id: 5,
    //   label: "线路",
    //   prop: "line",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: true,
    // }, 
    // {
    //   id: 6,
    //   label: "事故发生时间",
    //   prop: "d_accident_date",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false,
    // },
    //  {
    //   id: 7,
    //   label: "事故责任",
    //   prop: "accident_duty",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false,
      
    // },
    // {
    //   id: 8,
    //   label: "事故地点",
    //   prop: "c_accident_address",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false,
      
    // },
    //   {
    //   id: 9,
    //   label: "事故类别",
    //   prop: "accident_category",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false,
      
    // },
    //  {
    //   id: 10,
    //   label: "事故描述",
    //   prop: "c_describe",
    //   width: "120",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false,
      
    // },
    // {
    //   id: 11,
    //   label: "人伤金额",
    //   prop: "accident_total_fee",
    //   width: "160",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false,
      
    // },
    //  {
    //   id: 12,
    //   label: "车辆维修金额",
    //   prop: "n_actual_fee",
    //   width: "130",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false
    // },
    //  {
    //   id: 13,
    //   label: "保险理赔金额",
    //   prop: "n_insurance_pay_fee",
    //   width: "130",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false
    // },
    //  {
    //   id: 14,
    //   label: "他人赔付金额",
    //   prop: "n_personal_fee",
    //   width: "130",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false
    // },
    //  {
    //   id: 15,
    //   label: "事故净损失",
    //   prop: "n_loss_fee",
    //   width: "130",
    //   align: "center",
    //   signIndex: 1,
    //   sortable: false
    // },
  ],
}

export default headerData