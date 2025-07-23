<template>
  <div class="install-info" style="height: 470px; overflow-x: hidden">
    <div class="use-table-record show-flex-box-c" style="margin: 0 20px">
      <el-form :inline="true" size="mini">
        <el-row>
          <el-form-item label="违法日期范围:">
            <el-date-picker
              v-model="date"
              type="daterange"
              range-separator="至"
              start-placeholder="选择开始日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              end-placeholder="选择结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reqViolationRecordList">
              查询
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <div class="table">
        <tr-table
          :selectionShow="true"
          :data="dataList"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="0"
          :backFixedNum="0"
        ></tr-table>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    curChangeType: {
      type: String,
      default: 'add'
    },
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      date: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: '违法日期',
          prop: 'd_violation_date',
          width: '130',
          align: 'center',
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: '驾驶员',
          prop: 'driver_name',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: '自编号',
          prop: 'vehicle_number',
          width: '130',
          align: 'center',
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: '车牌号',
          prop: 'lincense_plate_number',
          width: '165',
          align: 'center',
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: '所属组织',
          prop: 'department_name',
          width: '130',
          align: 'center',
          signIndex: 4,
          sortable: false
        },
        {
          id: 6,
          label: '线路',
          prop: 'line',
          width: '130',
          align: 'center',
          signIndex: 5,
          sortable: false
        },
        {
          id: 7,
          label: '违法项目',
          prop: 'violation_name',
          width: '130',
          align: 'center',
          signIndex: 6,
          sortable: false
        },
        {
          id: 8,
          label: '违法地点',
          prop: 'c_place',
          width: '130',
          align: 'center',
          signIndex: 7,
          sortable: false
        },
        {
          id: 9,
          label: '扣分',
          prop: 'score',
          width: '130',
          align: 'center',
          signIndex: 8,
          sortable: false
        },
        {
          id: 10,
          label: '罚款',
          prop: 'money',
          width: '130',
          align: 'center',
          signIndex: 9,
          sortable: false
        },
        {
          id: 11,
          label: '交警处理结果',
          prop: 'state',
          width: '130',
          align: 'center',
          signIndex: 10,
          sortable: false
        },
        {
          id: 12,
          label: '备注',
          prop: 'c_remark',
          width: '130',
          align: 'center',
          signIndex: 11,
          sortable: false
        }
      ],
      TableHeight: 400,
      curInfo: {}, //当前操作的记录
      dataList: [],
      loading: false
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.setData(this.info)
  },
  methods: {
    // 初始化数据
    resetData() {
      this.date = []
    },
    // 数据回显
    setData(val) {
      this.curInfo = val
      this.reqViolationRecordList()
    },
    // 获取违法记录
    reqViolationRecordList() {
      this.loading = true
      let parmas = {
        i_driver_id: []
      }
      if (this.date.length > 0) {
        parmas.begin = this.date[0] + ' 00:00:00'
        parmas.end = this.date[1] + ' 23:59:59'
      }
      parmas.i_driver_id.push(this.curInfo.id)
      this.$client.getListViolationManage({ context: parmas }).then(res => {
        if (res.head.result == '200') {
          this.dataList = res.context.list
          this.loading = false
        } else {
          this.loading = false
          this.dataList = []
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
        this.loading = false
      })
    },
    // 重置
    Reset() {
      this.date = []
      this.reqViolationRecordList()
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.install-info /deep/ .el-input {
  width: 420px;
}

.install-info /deep/ .el-input--mini {
  width: 420px;
}

.install-info/deep/ .el-date-editor {
  width: 420px;
}
</style>
