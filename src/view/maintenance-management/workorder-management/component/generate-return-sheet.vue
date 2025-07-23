<template>
  <div class="generate-return-sheet">
    <el-form>
      <el-form-item label="领料明细：">
        <tr-table
          :data="pickData"
          :loading="loading"
          :spanMethodType="['column']"
          :rowspanObj="rowspanObj"
          :mergekeys="mergeKeys"
          :TableHeight="210"
          :frontFixedNum="1"
          :backFixedNum="1"
          :tableHeaderList="tableHeaderLists1">
          <template slot-scope="scope" slot="operation">
            <el-button type="text" @click="preview(scope.data)" size="mini">生成退料单</el-button>
          </template>
          <template slot-scope="scope" slot="out_code">
            <el-button type="text" @click="goEdit(scope.data.out_code)" size="mini">{{ scope.data.out_code }}</el-button>
          </template>
          <template slot-scope="scope" slot="use_count">
            <el-input-number style="width: 100px" size="mini" :max="scope.data.count || 0" v-model="scope.data.use_count" :controls="false"></el-input-number>
          </template>
        </tr-table>
      </el-form-item>
      <el-form-item>
        <tr-table
          :data="leaveData"
          :spanMethodType="['column']"
          :TableHeight="210"
          :frontFixedNum="1"
          :tableHeaderList="tableHeaderLists2">
          <template slot-scope="scope" slot="remark">
            <el-input style="width: 100px" size="mini" v-model="scope.data.remark" type="textarea"></el-input>
          </template>
        </tr-table>
        <span style="{color: #606266;font-weight:bold;}" slot="label">退料单: <span style="{color: #d3d3d3;font-size:12px;padding-left: 10px;}">说明：下方表格仅为生成退料预览，确认无误点击提交后正式生成退料单</span></span>
      </el-form-item>
    </el-form>
    <el-dialog
      :visible="warehouseLeaveShow"
      fullscreen
      append-to-body
      :before-close="handleClose">
      <warehouse-leave ref="warehouseLeave"></warehouse-leave>
      <span slot="footer" class="dialog-footer">
        <el-button @click="warehouseLeaveShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { formatTime } from "@/utils/index"
import warehouseLeave from "../../../materials-management/warehouse-management/component/warehouse-leave.vue"
import { getUser } from "@/utils/auth"
export default {
  components: { warehouseLeave },
  data() {
    return {
      warehouseLeaveShow: false,
      order_id: '',
      work_code: '',
      tableHeaderLists1: [{
        id: 1,
        label: "操作",
        prop: "operation",
        width: "100",
        align: "center",
        signIndex: 0,
        sortable: false,
      }, {
        id: 2,
        label: "领料单号",
        prop: "code",
        width: "160",
        align: "center",
        signIndex:1
      }, {
        id: 3,
        label: "物料编号",
        prop: "material_code",
        width: "160",
        align: "center",
        signIndex:2
      }, {
        id: 4,
        label: "物料名称",
        prop: "material_name",
        width: "160",
        align: "center",
        signIndex:3
      }, {
        id: 5,
        label: "规格型号",
        prop: "specification",
        width: "160",
        align: "center",
        signIndex:4
      }, {
        id: 6,
        label: "单位",
        prop: "measure_unit_name",
        width: "120",
        align: "center",
        signIndex: 5
      }, {
        id: 7,
        label: "领取数量",
        prop: "count",
        width: "160",
        align: "center",
        signIndex: 6
      }, {
        id: 8,
        label: "实际使用数量",
        prop: "use_count",
        width: "160",
        align: "center",
        signIndex: 7
      }, {
        id: 9,
        label: "领料人",
        prop: "pick_user_name",
        width: "130",
        align: "center",
        signIndex: 8
      }, {
        id: 10,
        label: "领料日期",
        prop: "pick_date",
        width: "160",
        align: "center",
        signIndex:9
      }, {
        id: 11,
        label: "关联出库单号",
        prop: "out_code",
        width: "160",
        align: "center",
        signIndex: 10
      }],
      tableHeaderLists2: [{
        id: 1,
        label: "退料日期",
        prop: "created_date",
        width: "160",
        align: "center",
        signIndex: 0,
        sortable: false,
      }, {
        id: 2,
        label: "物料编号",
        prop: "material_code",
        width: "160",
        align: "center",
        signIndex:1
      }, {
        id: 3,
        label: "物料名称",
        prop: "material_name",
        width: "160",
        align: "center",
        signIndex:2
      }, {
        id: 4,
        label: "规格型号",
        prop: "specification",
        width: "160",
        align: "center",
        signIndex:5
      }, {
        id: 5,
        label: "单位",
        prop: "measure_unit_name",
        width: "120",
        align: "center",
        signIndex: 4
      }, {
        id: 6,
        label: "退还数量",
        prop: "return_count",
        width: "160",
        align: "center",
        signIndex: 5
      }, {
        id: 7,
        label: "退料仓库",
        prop: "warenhouse_name",
        width: "160",
        align: "center",
        signIndex: 6
      }, {
        id: 8,
        label: "退料人",
        prop: "created_name",
        width: "130",
        align: "center",
        signIndex: 7
      }, {
        id: 9,
        label: "备注",
        prop: "remark",
        width: "160",
        align: "center",
        signIndex: 8
      }],
      pickData: [],
      leaveData: [],
      loading: false,
      rowspanObj: {},
      mergeKeys: [
        "operation",
        "code",
        "pick_date",
        "out_code",
        "pick_user_name"
      ]
    }
  },
  mounted () {
    // this.loadData()
  },
  computed: {
    isPreview () {
      return this.pickData.filter(item => item.count - item.use_count > 0).length == this.leaveData.length
    }
  },
  methods: {
    setData (order_id, work_code) {
      this.order_id = order_id
      this.work_code = work_code
      this.leaveData = []
      let param = {
        page_index: 1,
        page_size: 100,
        order_ids: [order_id]
      }
      this.loading = true
      this.$client.getMaintRepairPick(param).then(res => {
        this.pickData = []
        this.loading = false
        if (res.head.result === '200') {
          this.pickData = res.context.list.map((item, index) => {
            let obj = {...item}
            obj.l_id = item.id
            obj.id = index
            obj.use_count = item.count
            obj.pick_date = formatTime(new Date(item.pick_date))
            return obj
          })
          this.rowspanObj = this.$handleTableSpan(this.mergeKeys, this.pickData)
          let codeKey = rowspanObj['code']
          Object.keys(rowspanObj).forEach(key => {
            rowspanObj[key] = codeKey
          })
          this.rowspanObj = rowspanObj
        } else {
          this.pickData = []
        }
      })   
    },
    // 生成退料单预览
    preview(row) {
      this.leaveData = []
      let data = this.pickData.filter(item => item.count - item.use_count > 0)
      let userInfo = JSON.parse(getUser())
      this.leaveData = data.map(el => {
        el.return_count = el.count - el.use_count
        el.remark = ''
        el.created_date = formatTime(new Date())
        el.created_name = userInfo.user_name
        el.created_id = userInfo.user_id
        return el
      })
      if (!this.leaveData.length) {
        this.$message({type: 'warning', message: '所有领料单物料数量均已用完，无需生成退料单！'})
      }
    },
    // 生成退料单
    setRecord() {
      return new Promise((resolve, reject) => {
        let param = {
          context: {
            order_id: this.order_id,
            work_code: this.work_code,
            pick_code: this.leaveData[0].code,
            out_code: this.leaveData[0].out_code,
            created_id: JSON.parse(getUser()).user_id,
            created_date: formatTime(new Date()),
            warenhouse_id: this.leaveData[0].warenhouse_id,
            // created_id: JSON.parse(getUser()).user_name,
            details: this.leaveData.map(item => {
              return {
                material_id: item.material_id,
                count: item.return_count
              }
            })
          }
        }
        this.$client.addMaintRepairRefund(param).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    handleClose() {
      this.warehouseLeaveShow = false
    },
    //查看
    goEdit(out_code) {
      this.warehouseLeaveShow = true
      setTimeout(() => {
        this.$refs.warehouseLeave.getdataTable(null, out_code)
      }, 60)
    },
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>