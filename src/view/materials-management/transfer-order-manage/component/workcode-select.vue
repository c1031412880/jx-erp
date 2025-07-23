<template>
  <el-select
    v-model="text"
    filterable
    remote
    placeholder="请输入工单号"
    :loading="loading"
    @change="onChange"
    :remote-method="remoteMethod"
    size="mini"
    clearable>
    <el-option
      v-for="item in workcodeList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
    </el-select>
</template>
<script>
export default {
  data() {
    return {
      workcodeList: [],
      allList: [],
      text: '',
      loading: false,
      queryForm: {
        start_date: '',
        end_date: '',
        work_code: '',
        page_index: 1,
        page_size: 20
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.queryList()
  },
  watch: {
    value: {
      handler: function(val) {
        this.setData(val)
        this.text = val
      },
      immediate: true
    }
  },
  methods: {
    setData(val) {
      // 设置30条数据
      let start = 0
      let end = 31
      let len = this.allList.length
      if (val && len > 30) {
        let curIndex = this.allList.findIndex(item => item.value == val)
        if (curIndex != -1) {
          if (curIndex >= 15 && curIndex < (len -16)) {
            start = curIndex - 15
            end = curIndex + 16
          } else if (curIndex >= (len - 16)) {
            start = len - 31
            end = len
          }
        }
      }
      this.workcodeList = this.allList.slice(start, end)
    },
    remoteMethod(query) {
      if (query) {
        this.workcodeList = this.allList.filter(item => {
          return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1
        }).slice(0, 31)
      } else {
        this.setData(this.value)
      }
    },
    queryList() {
      this.loading = true
      // 获取过去进7天到未来2天的时间范围
      let start_date = this.$moment().subtract(7, 'days').format('YYYY-MM-DD')
      let end_date = this.$moment().add(2, 'days').format('YYYY-MM-DD')
      this.$client.getMaintRepairSimpleData({
        start: start_date,
        end: end_date
      }).then(res => {
        this.loading = false
        if (res.head.result == "200") {
          let data = res.context
          // 剔除数组data子对象中state属性为5和7的数据
          data = data.filter(item => {
            return item.state != 5 || item.state != 7
          })
          this.allList = data.map(item => {
            let value = item.work_code
            let vehicle_name = item.vehicle_info ? item.vehicle_info.vehicle_name : ''
            let vehicle_number = item.vehicle_info ? item.vehicle_info.vehicle_number : ''
            let department_name = item.department_info ? item.department_info.department_name : ''
            let label = value + "(" + vehicle_number +"-" + vehicle_name + " - "+department_name+")"
            let repair_pick = item.repair_pick
            let vehicle_info = item.vehicle_info
            return {
              value,
              vehicle_name,
              label,
              repair_pick,
              vehicle_info
            }
          })
          this.setData(this.value)
        } else {
          this.allList = []
        }
      }).catch(err => {
        this.loading = false
      })
    },
    onClear() {
      this.text = ''
      this.queryForm = {
        start_date: '',
        end_date: '',
        work_code: '',
        page_index: 1,
        page_size: 20
      }
    },
    onChange(val) {
      let info = ''
      if (val) {
        info = this.workcodeList.filter(item => item.value == val)[0]
      }
      this.$emit('on-change', info)
      this.$emit('input', val)
    }
  },
}
</script>
