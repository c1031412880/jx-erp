<template>
  <div class="">
    <el-tabs v-model="activeName">
      <el-tab-pane label="领料单" name="1">
        <tr-table
          :data="l_data"
          :tableHeaderList="l_tableHeaderList"
          :TableHeight="TableHeight"
          :rowspanObj="l_rowspanObj"
          :mergekeys="l_mergeKeys"
          :loading="l_loading"
          :isFixedEmptyPlaceholder="false">
        </tr-table>
      </el-tab-pane>
      <el-tab-pane label="退料单" name="2">
        <tr-table
          :data="t_data"
          :tableHeaderList="t_tableHeaderList"
          :TableHeight="TableHeight"
          :rowspanObj="t_rowspanObj"
          :mergekeys="t_mergeKeys"
          :loading="t_loading"
          :isFixedEmptyPlaceholder="false">
        </tr-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { formatTime } from "@/utils/index"
export default {
  data() {
    return {
      activeName: '1',
      TableHeight: 250,
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      l_data: [],
      t_data: [],
      l_loading: false,
      t_loading: false,
      l_tableHeaderList: [{
        id: 1,
        label: "领料单号",
        prop: "code",
        width: "150",
        align: "center",
        signIndex: "",
        sortable: false,
      }, {
        id: 2,
        label: "物料编号",
        prop: "material_code",
        width: "130",
        align: "center",
        signIndex: 1,
        sortable: false,
      }, {
        id: 3,
        label: "物料名称",
        prop: "material_name",
        width: "130",
        align: "center",
        signIndex: 2,
        sortable: false,
      }, {
        id: 4,
        label: "规格型号",
        prop: "specification",
        width: "130",
        align: "center",
        signIndex: 3,
        sortable: false,
      }, {
        id: 5,
        label: "单位",
        prop: "measure_unit_name",
        width: "130",
        align: "center",
        signIndex: 4,
        sortable: false,
      }, {
        id: 6,
        label: "领取数量",
        prop: "count",
        width: "130",
        align: "center",
        signIndex: 5,
        sortable: false,
      }, {
        id: 7,
        label: "领料人",
        prop: "pick_user_name",
        width: "130",
        align: "center",
        signIndex: 6,
        sortable: false,
      }, {
        id: 8,
        label: "领料类型",
        prop: "pick_type_name",
        width: "130",
        align: "center",
        signIndex: 7,
        sortable: false,
      }, {
        id: 9,
        label: "领料日期",
        prop: "pick_date",
        width: "130",
        align: "center",
        signIndex: 8,
        sortable: false,
      }, {
        id: 10,
        label: "出库单编号",
        prop: "out_code",
        width: "160",
        align: "center",
        signIndex: 9,
        sortable: false,
      }, {
        id: 11,
        label: "领料仓库",
        prop: "warenhouse_name",
        width: "130",
        align: "center",
        signIndex: 10,
        sortable: false,
      }, {
        id: 12,
        label: "备注",
        prop: "remark",
        width: "130",
        align: "center",
        signIndex: 11
      }],
      t_tableHeaderList: [{
        id: 1,
        label: "退料单号",
        prop: "code",
        width: "150",
        align: "center",
        signIndex: "",
        sortable: false,
      }, {
        id: 2,
        label: "物料编号",
        prop: "material_code",
        width: "130",
        align: "center",
        signIndex: 1,
        sortable: false,
      }, {
        id: 3,
        label: "物料名称",
        prop: "material_name",
        width: "130",
        align: "center",
        signIndex: 2,
        sortable: false,
      }, {
        id: 4,
        label: "规格型号",
        prop: "specification",
        width: "130",
        align: "center",
        signIndex: 3,
        sortable: false,
      }, {
        id: 5,
        label: "单位",
        prop: "measure_unit_name",
        width: "130",
        align: "center",
        signIndex: 4,
        sortable: false,
      }, {
        id: 6,
        label: "退料数量",
        prop: "count",
        width: "130",
        align: "center",
        signIndex: 5,
        sortable: false,
      }, {
        id: 7,
        label: "退料人",
        prop: "created_name",
        width: "130",
        align: "center",
        signIndex: 6,
        sortable: false,
      }, {
        id: 8,
        label: "退料日期",
        prop: "created_date",
        width: "130",
        align: "center",
        signIndex: 7,
        sortable: false,
      }, {
        id: 9,
        label: "退料入库单编号",
        prop: "in_code",
        width: "160",
        align: "center",
        signIndex: 8,
        sortable: false,
      }, {
        id: 10,
        label: "退料仓库",
        prop: "warenhouse_name",
        width: "130",
        align: "center",
        signIndex: 9,
        sortable: false,
      }, {
        id: 11,
        label: "备注",
        prop: "remark",
        width: "130",
        align: "center",
        signIndex: 10
      }],
      l_mergeKeys: [
        "code",
        "pick_user_name",
        "pick_date",
        "out_code"
      ],
      l_rowspanObj: {},
      t_mergeKeys: [
        "code",
        "pick_user_name",
        "created_date",
        "in_code"
      ],
      t_rowspanObj: {}
    }
  },
  mounted() {},
  methods: {
    loadData(order_id) {
      this.order_id = order_id
      this.activeName = '1'
      let param = {
        page_index: this.pageInfo.pageIndex,
        page_size: this.pageInfo.pageSize,
        order_ids: [this.order_id]
      }
      this.queryMaterial_l(param)
      this.queryMaterial_t(param)
    },
    queryMaterial_l(param) {
      this.l_loading = true
      this.$client.getMaintRepairPick(param).then(res => {
        this.l_data = []
        this.l_loading = false
        if (res.head.result == "200") {
          this.l_data = res.context.list.map((item, index) => {
            let obj = {...item}
            obj.l_id = item.id
            obj.id = index
            obj.pick_date = formatTime(new Date(item.pick_date))
            return obj
          })
          if(!!this.l_data && this.l_data.length) {
            let rowspanObj = this.$handleTableSpan(this.l_mergeKeys, this.l_data)
            console.log(rowspanObj)
            let codeKey = rowspanObj['code']
            Object.keys(rowspanObj).forEach(key => {
              rowspanObj[key] = codeKey
            })
            this.l_rowspanObj = rowspanObj
          }
          
        }
      })
    },
    queryMaterial_t(param) {
      this.t_loading = true
      this.$client.getMaintRepairRefund(param).then(res => {
        this.t_data = []
        this.t_loading = false
        if (res.head.result == "200") {
          this.t_data = res.context.list.map((item, index) => {
            let obj = {...item}
            obj.t_id = item.id
            obj.id = index
            obj.created_date = formatTime(new Date(item.created_date))
            return obj
          })
          if(!!this.t_data && this.t_data.length) {
            let rowspanObj = this.$handleTableSpan(this.t_mergeKeys, this.t_data)
            let codeKey = rowspanObj['code']
            Object.keys(rowspanObj).forEach(key => {
              rowspanObj[key] = codeKey
            })
            this.t_rowspanObj = rowspanObj
          }
        }
      })
    },
  }
}
</script>