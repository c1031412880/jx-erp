const formConfig = {
  // 请假单
  1000: {
    fields: [
      {
        label: "请假类型",
        tag: "el-select",
        required: true,
        options: [
          {label: "事假", value: 2},
          {label: "丧假", value: 3},
          {label: "病假", value: 4},
          {label: "年假", value: 5},
          {label: "婚假", value: 6},
          {label: "产假", value: 7},
          {label: "哺乳假", value: 8},
          {label: "工伤假", value: 9},
          {label: "陪产假", value: 10},
          {label: "育儿假", value: 11},
          {label: "独生子女陪护父母假", value: 12},
          {label: "调休", value: 13},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100010,
      },
      {
        label: "请假天数(天)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100020
      }
    ]
  },
  1010: {
    fields: [
      {
        label: "时长(小时)",
        tag: "fc-time-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100030
      }
    ]
  },
  1020: {
    fields: [
      {
        label: "采购金额",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100110
      }
    ]
  },
  1070: {
    fields: [
      {
        label: "申请类型",
        tag: "el-select",
        required: true,
        options: [
          {label: "其他", value: 1},
          {label: "维修", value: 2},
          {label: "财务", value: 3},
          {label: "采购", value: 4},
          {label: "广告公司", value: 5},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100230,
      },
      {
        label: "预估金额",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100231
      }
    ]
  },
  1080: {
    fields: [
      {
        label: "用印类型",
        tag: "el-select",
        required: true,
        // 和公章注销或制作  一致   要改一起改
        options: [
          {label: "公司章", value: 1},
          {label: "公司党委章", value: 2},
          {label: "公司纪委章", value: 3},
          {label: "公司财务专用章", value: 4},
          {label: "董事会章", value: 5},
          {label: "法人章", value: 6},
          {label: "工会章", value: 7},
          {label: "工会法人章", value: 8},
          {label: "工会财务章", value: 9},
          {label: "党支部章", value: 10},
          {label: "党费专用章", value: 11},
          {label: "团支部章", value: 12},
          {label: "部门章", value: 13},
          {label: "总经理章", value: 14},
          {label: "公司章(采招办用)", value: 15},
          {label: "总经理章(采招办用)", value: 16},
          {label: "公交协会章", value: 17},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100040,
      },
      {
        label: "用印数量",
        tag: "fc-amount",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100041,
      }
    ]
  },
  1090: {
    fields: [
      {
        label: "业务负责人",
        tag: "fc-org-select",
        disabled: false,
        required: true,
        cmpType: "custom",
        tabList:['user'],
        maxNum: 99,
        showDuration: true,
        proCondition: true,
        formId: 100070,
      },
      {
        label: "预算金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100110
      }
    ]
  },
  1190: {
    fields: [
      {
        label: "公出时长",
        tag: "fc-time-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100011
      }
    ]
  },
  1140: {
    fields: [
      {
        label: "合同类别",
        tag: "el-select",
        required: true,
        options: [
          {label: "常规合同", value: 1},
          {label: "重大合同", value: 2},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100050,
      }
    ]
  },
  1150: {
    fields: [
      {
        label: "是否外带",
        tag: "el-select",
        required: true,
        options: [
          {label: "是", value: 1},
          {label: "否", value: 2},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100061,
      },
      {
        label: "借阅时长(天)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100060,
      }
    ]
  },
  // 新闻信息
  1160: {
    fields: [
      {
        label: "信息类别",
        tag: "el-select",
        required: true,
        options: [
          { value: 1,label: '常规类信息' },
          { value: 2,label: '经营类信息' },
          { value: 3,label: '人事类信息' },
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100080,
      }
    ]
  },
  // 企业证照借用
  1170: {
    fields: [
      {
        label: "事件程度",
        tag: "el-select",
        required: true,
        options: [
          {label: "一般事项", value: 1},
          {label: "重大事项", value: 2},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100090,
      },
      {
        label: "借用方式",
        tag: "el-select",
        required: true,
        options: [
          {label: "复印", value: 1},
          {label: "外带", value: 2},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100091,
      }
    ]
  },
  // 费用支出
  1210: {
    fields: [
      {
        label: "总金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100100
      }
    ]
  },
  // 公车加油申请
  1220: {
    fields: [
      {
        label: "加油金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100120
      }
    ]
  },
  // 公车维修申请
  1230: {
    fields: [
      {
        label: "预估总金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100130
      }
    ]
  },
  // 预支总金额
  1240: {
    fields: [
      {
        label: "预支总金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100140
      }
    ]
  },
  // 公车保养申请
  1260: {
    fields: [
      {
        label: "预估总金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100150
      }
    ]
  },
  // 预算金额(预算内资金事前审批)
  1250: {
    fields: [
      {
        label: "预算金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100160
      }
    ]
  },
  // 公车借车
  20: {
    fields: [
      {
        label: "公车车辆",
        tag: "el-select",
        required: true,
        options: [],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        dynamic: true,
        formId: 100121,
      },
      {
        label: "用车类型",
        tag: "el-select",
        required: true,
        options: [
          {label: "本地用车", value: 1},
          {label: "出市用车", value: 2},
          {label: "节假日用车", value: 3},
          {label: "过夜用车", value: 4},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100124,
      },
    ]
  },
  // 公车还车
  21: {
    fields: [
      {
        label: "公车车辆",
        tag: "el-select",
        required: true,
        options: [],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        dynamic: true,
        formId: 100122,
      },
    ]
  },
  // 公车预约
  1340: {
    fields: [
      {
        label: "公车车辆",
        tag: "el-select",
        required: true,
        options: [],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        dynamic: true,
        formId: 100123,
      },
      {
        label: "用车类型",
        tag: "el-select",
        required: true,
        options: [
          {label: "本地用车", value: 1},
          {label: "出市用车", value: 2},
          {label: "节假日用车", value: 3},
          {label: "过夜用车", value: 4},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100125,
      },
    ]
  },
  // 离职退休申请
  1350: {
    fields: [
      {
        label: "离职类型",
        tag: "el-select",
        required: true,
        options: [
          {label: "离职", value: 1},
          {label: "退休", value: 2},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100170,
      },
    ]
  },
  // 工会报销
  1360: {
    fields: [
      {
        label: "总金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100180
      }
    ]
  },
  // 合同审批（履约信息版）
  1420: {
    fields: [
      {
        label: "合同类别",
        tag: "el-select",
        required: true,
        options: [
          { value: 1, label: '常规合同'},
          { value: 2, label: '重大合同'}
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100051,
      },
      {
        label: "合同领域",
        tag: "el-select",
        required: true,
        options: [
          {label: "房屋买卖", value: 1},
          {label: "房屋租赁", value: 2},
          {label: "物业服务", value: 3},
          {label: "基建装修", value: 4},
          {label: "旅游", value: 5},
          {label: "供用水电气", value: 6},
          {label: "有线电视", value: 7},
          {label: "邮政", value: 8},
          {label: "通讯", value: 9},
          {label: "融资贷款", value: 10},
          {label: "保险", value: 11},
          {label: "旅客运输", value: 12},
          {label: "汽车销售", value: 13},
          {label: "汽车保养", value: 14},
          {label: "汽车维修", value: 15},
          {label: "劳动用工", value: 16},
          {label: "公积金", value: 17},
          {label: "药品采购", value: 18},
          {label: "国有土地出让", value: 19},
          {label: "土地承包经营权流转", value: 20},
          {label: "征收补偿", value: 21},
          {label: "政府采购", value: 22},
          {label: "专项资金使用", value: 23},
          {label: "课题研究", value: 24},
          {label: "工程建设", value: 25},
          {label: "水利", value: 26},
          {label: "园林", value: 27},
          {label: "科技", value: 28},
          {label: "交通", value: 29},
          {label: "招标投标", value: 30},
          {label: "车辆采购", value: 31},
          {label: "法律服务", value: 32},
          {label: "工程服务", value: 33},
          {label: "其他", value: 34}
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: true,
        disabled: false,
        proCondition: true,
        formId: 100052,
      },
    ]
  },
  // 实操培训反馈表
  1430: {
    fields: [
      {
        label: "离职类型",
        tag: "el-select",
        required: true,
        options: [
          { value: 1, label: '驾驶员'}
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100191,
      },
    ]
  },
  // 公章注销或制作审批单
  1440: {
    fields: [
      {
        label: "申请类型",
        tag: "el-select",
        required: true,
        options: [
          { value: 1, label: '公章注销'},
          { value: 2, label: '公章制作'}
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100200,
      },
      {
        label: "公章类型",
        tag: "el-select",
        required: true,
        // 和用印申请  一致   要改一起改
        options: [
          {label: "公司章", value: 1},
          {label: "公司党委章", value: 2},
          {label: "公司纪委章", value: 3},
          {label: "公司财务专用章", value: 4},
          {label: "董事会章", value: 5},
          {label: "法人章", value: 6},
          {label: "工会章", value: 7},
          {label: "工会法人章", value: 8},
          {label: "工会财务章", value: 9},
          {label: "党支部章", value: 10},
          {label: "党费专用章", value: 11},
          {label: "团支部章", value: 12},
          {label: "部门章", value: 13},
          {label: "总经理章", value: 14},
          {label: "公司章(采招办用)", value: 15},
          {label: "总经理章(采招办用)", value: 16},
          {label: "公交协会章", value: 17},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100201,
      },
    ]
  },
  // 离职退休申请
  1470: {
    fields: [
      {
        label: "离职类型",
        tag: "el-select",
        required: true,
        options: [
          {label: "离职", value: 1},
          {label: "退休", value: 2},
        ],
        cmpType: "custom",
        showDuration: true,
        multiple: false,
        disabled: false,
        proCondition: true,
        formId: 100210,
      },
    ]
  },
  // 差旅报销单
  1480: {
    fields: [
      {
        label: "总金额(元)",
        tag: "fc-date-duration",
        disabled: false,
        required: true,
        cmpType: "custom",
        showDuration: true,
        proCondition: true,
        formId: 100220
      }
    ]
  },
}

export default formConfig
