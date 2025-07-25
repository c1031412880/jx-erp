export default {
  "formData": {
    "fields": [
      // {
      //   "cmpType": "common",
      //   label: '组织机构',
      //   tag: 'fc-org-select',
      //   tagIcon: 'dept',
      //   defaultValue: { dep: [{ "nodeId": 1, "deptId": 1, "deptName": "xxx公司" }] },
      //   tabList: ['dep'],
      //   buttonType: 'button',
      //   title: '组织机构',
      //   searchable: true,
      //   maxNum: 1,
      //   tagConfig: {
      //     type: 'info',
      //     closable: true,
      //     'disable-transitions': false,
      //     hit: false,
      //     color: undefined,
      //     size: 'small',
      //     effect: 'light'
      //   },
      //   style: { width: '100%' },
      //   span: 24,
      //   labelWidth: null,
      //   disabled: false,
      //   required: true,
      //   regList: [],
      //   changeTag: true,
      //   proCondition: true,
      //   asSummary: false,
      //   "layout": "colFormItem",
      //   "formId": 20,
      //   "renderKey": 1590641662215,
      //   "vModel": "field20"
      // },
      {
        "cmpType": "common",
        "label": "姓名",
        "tag": "el-input",
        "tagIcon": "input",
        "placeholder": "请输入姓名",
        "span": 12,
        "labelWidth": 0,
        "style": {
          "width": "100%"
        },
        "clearable": true,
        "prepend": "",
        "append": "",
        "prefix-icon": "",
        "suffix-icon": "",
        "maxlength": null,
        "show-word-limit": false,
        "readonly": false,
        "disabled": false,
        "required": false,
        "regList": [],
        "changeTag": true,
        "proCondition": false,
        "asSummary": false,
        "formId": 2,
        "renderKey": 1590647662215,
        "layout": "colFormItem",
        "vModel": "field2"
      },
      {
        "cmpType": "common",
        "label": "学历",
        "tag": "el-select",
        "tagIcon": "select",
        "placeholder": "请选择学历",
        "span": 12,
        "labelWidth": 0,
        "style": {
          "width": "100%"
        },
        "clearable": true,
        "disabled": false,
        "required": true,
        "filterable": false,
        "multiple": false,
        "options": [
          {
            "label": "专科",
            "value": "专科"
          },
          {
            "label": "本科",
            "value": "本科"
          },
          {
            "label": "研究生",
            "value": "研究生"
          },
          {
            "label": "博士生",
            "value": "博士生"
          }
        ],
        "regList": [],
        "changeTag": true,
        "proCondition": true,
        "formId": 3,
        "renderKey": 1590647681649,
        "layout": "colFormItem",
        "vModel": "field3"
      },
      {
        "cmpType": "common",
        "label": "性别",
        "tag": "el-radio-group",
        "tagIcon": "radio",
        "span": 12,
        "labelWidth": 0,
        "style": {},
        "optionType": "default",
        "border": false,
        "size": "medium",
        "disabled": false,
        "required": false,
        "options": [
          {
            "label": "男",
            "value": "男"
          },
          {
            "label": "女",
            "value": "女"
          }
        ],
        "regList": [],
        "changeTag": true,
        "proCondition": true,
        "formId": 4,
        "renderKey": 1590647690138,
        "layout": "colFormItem",
        "vModel": "field4",
        "defaultValue": "男"
      },
      // {
      //   "cmpType": "common",
      //   "layout": "rowFormItem",
      //   "rowType": "table",
      //   "tagIcon": "row",
      //   "tag": "fc-input-table",
      //   "type": "table",
      //   "justify": "start",
      //   "align": "top",
      //   "label": "工作经历",
      //   "layoutTree": false,
      //   "children": [
      //     {
      //       "cmpType": "common",
      //       "label": "日期范围",
      //       "tag": "fc-date-duration",
      //       "showDuration": false,
      //       "tagIcon": "date-range",
      //       "defaultValue": null,
      //       "span": 24,
      //       "labelWidth": 0,
      //       "style": {
      //         "width": "100%"
      //       },
      //       "type": "daterange",
      //       "range-separator": "至",
      //       "start-placeholder": "开始日期",
      //       "end-placeholder": "结束日期",
      //       "disabled": false,
      //       "clearable": true,
      //       "required": false,
      //       "format": "yyyy-MM-dd",
      //       "value-format": "yyyy-MM-dd",
      //       "readonly": false,
      //       "regList": [],
      //       "changeTag": true,
      //       "proCondition": true,
      //       "asSummary": false,
      //       "formId": 6,
      //       "renderKey": 1590647800330,
      //       "layout": "colFormItem",
      //       "vModel": "field6"
      //     },
      //     {
      //       "cmpType": "common",
      //       "label": "公司名称",
      //       "tag": "el-input",
      //       "tagIcon": "input",
      //       "placeholder": "请输入公司名称",
      //       "span": 24,
      //       "labelWidth": 0,
      //       "style": {
      //         "width": "100%"
      //       },
      //       "clearable": true,
      //       "prepend": "",
      //       "append": "",
      //       "prefix-icon": "",
      //       "suffix-icon": "",
      //       "maxlength": null,
      //       "show-word-limit": false,
      //       "readonly": false,
      //       "disabled": false,
      //       "required": true,
      //       "regList": [],
      //       "changeTag": true,
      //       "proCondition": false,
      //       "asSummary": false,
      //       "formId": 7,
      //       "renderKey": 1590647831276,
      //       "layout": "colFormItem",
      //       "vModel": "field7"
      //     },
      //     {
      //       "cmpType": "common",
      //       "label": "岗位",
      //       "tag": "el-select",
      //       "tagIcon": "select",
      //       "placeholder": "请选择岗位",
      //       "span": 24,
      //       "labelWidth": 0,
      //       "style": {
      //         "width": "100%"
      //       },
      //       "clearable": true,
      //       "disabled": false,
      //       "required": false,
      //       "filterable": false,
      //       "multiple": false,
      //       "options": [
      //         {
      //           "label": "前端",
      //           "value": "前端"
      //         },
      //         {
      //           "label": "后端",
      //           "value": "后端"
      //         },
      //         {
      //           "label": "其他",
      //           "value": "其他"
      //         }
      //       ],
      //       "regList": [],
      //       "changeTag": true,
      //       "proCondition": true,
      //       "formId": 8,
      //       "renderKey": 1590647845533,
      //       "layout": "colFormItem",
      //       "vModel": "field8"
      //     },
      //     {
      //       "cmpType": "common",
      //       "label": "附件",
      //       "tag": "el-upload",
      //       "tagIcon": "upload",
      //       "action": "https://jsonplaceholder.typicode.com/posts/",
      //       "defaultValue": [],
      //       "labelWidth": 0,
      //       "disabled": false,
      //       "required": false,
      //       "accept": "",
      //       "name": "file",
      //       "auto-upload": true,
      //       "showTip": false,
      //       "buttonText": "点击上传附件",
      //       "fileSize": 20,
      //       "sizeUnit": "MB",
      //       "list-type": "text",
      //       "multiple": false,
      //       "regList": [],
      //       "changeTag": true,
      //       "proCondition": false,
      //       "asSummary": false,
      //       "formId": 9,
      //       "span": 24,
      //       "renderKey": 1590647866199,
      //       "layout": "colFormItem",
      //       "vModel": "field9"
      //     }
      //   ],
      //   "actionText": "添加",
      //   "tableConf": {},
      //   "showDivider": false,
      //   "show-summary": false,
      //   "formId": 5,
      //   "span": 24,
      //   "renderKey": 1590647776442,
      //   "vModel": "field5",
      //   "componentName": "row5",
      //   "gutter": 15
      // }
    ],
    "formRef": "elForm",
    "formModel": "formData",
    "size": "small",
    "labelPosition": "right",
    "labelWidth": 100,
    "formRules": "rules",
    "gutter": 15,
    "disabled": false,
    "span": 12,
    "formBtns": true
  },
}