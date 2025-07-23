const headerData = {
  'first':[
    {
      id: 1,
      label: "自编号",
      prop: "vehicle_number",
      width: "150",
      align: "center",
      signIndex:0,
      sortable:true
    },
    {
      id: 2,
      label: "车牌号",
      prop: "vehicle_name",
      width: "140",
      align: "center",
      signIndex:1,
      sortable:true
    },
    {
      id: 3,
      label: "保险种类",
      prop: "type_name",
      width: "110",
      align: "center",
      signIndex:2,
      sortable:true
    },
    {
      id: 4,
      label: "投保日期",
      prop: "insurance_start",
      width: "110",
      align: "center",
      signIndex:3,
      sortable:true
    },
    {
      id: 5,
      label: "到期日期",
      prop: "insurance_end",
      width: "130",
      align: "center",
      signIndex:4,
      sortable:true
    },
    {
      id: 6,
      label: "投保金额",
      prop: "insure_fee",
      width: "120",
      align: "center",
      signIndex:5,
      sortable:true
    },
    {
      id: 7,
      label: "实付金额",
      prop: "actual_fee",
      width: "130",
      align: "center",
      signIndex:6,
      sortable:true
    },
    {
      id: 8,
      label: "保险公司",
      prop: "company_name",
      width: "120",
      align: "center",
      signIndex:7,
      sortable:true
    },
    {
      id: 9,
      label: "保险单号",
      prop: "insurance_code",
      width: "120",
      align: "center",
      signIndex:8,
      sortable:true
    }
  ],
  'second':[
    {
      id: 1,
      label: "驾驶员",
      prop: "driver_name",
      width: "150",
      align: "center",
      signIndex: 0,
      sortable: true,
    },
    {
      id: 2,
      label: "自编号",
      prop: "vehicle_number",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    },
     {
      id: 3,
      label: "车牌号",
      prop: "lincense_plate_number",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    },
     {
      id: 4,
      label: "所属组织",
      prop: "department_name",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    },
    {
      id: 5,
      label: "线路",
      prop: "line",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: true,
    }, 
    {
      id: 6,
      label: "事故发生时间",
      prop: "d_accident_date",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
    },
     {
      id: 7,
      label: "事故责任",
      prop: "accident_duty",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
    {
      id: 8,
      label: "事故地点",
      prop: "c_accident_address",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
      {
      id: 9,
      label: "事故类别",
      prop: "accident_category",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
     {
      id: 10,
      label: "事故描述",
      prop: "c_describe",
      width: "120",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
    {
      id: 11,
      label: "人伤金额",
      prop: "accident_total_fee",
      width: "160",
      align: "center",
      signIndex: 1,
      sortable: false,
      
    },
     {
      id: 12,
      label: "车辆维修金额",
      prop: "n_actual_fee",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
     {
      id: 13,
      label: "保险理赔金额",
      prop: "n_insurance_pay_fee",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
     {
      id: 14,
      label: "他人赔付金额",
      prop: "n_personal_fee",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
     {
      id: 15,
      label: "事故净损失",
      prop: "n_loss_fee",
      width: "130",
      align: "center",
      signIndex: 1,
      sortable: false
    },
  ],
}

export default headerData