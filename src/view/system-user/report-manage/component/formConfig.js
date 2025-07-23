const tagList = [
  {
    tag: 'input',
    label: '输入框'
  },
  {
    tag: 'select',
    label: '下拉选择框'
  },
  {
    tag: 'picker',
    label: '日期'
  },
]

const tagDataMap = {
  'picker': [
    {
      label: '日期',
      value: {
        type: 'date'
      }
    },
    {
      label: '日期时间',
      value: {
        type: 'datetime'
      }
    },
  ]
}

const formConfig = {
  tagList: tagList,
  tagDataMap: tagDataMap
}

export default formConfig
