<template>
  <div class="vehicletype-maintenance-statistics">
    <sub-req ref="head" @on-ok="onSubmit" @on-btn-export="exportFile"></sub-req>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading">
      <!-- 回厂小修 -->
      <template slot-scope="scope" slot="type_959676">
        <el-button @click="outVehicleMan(scope.data, 'xx')" type="text" style="width: 100%">{{scope.data.type_959676}}</el-button>
      </template>
      <!-- 大修 -->
      <template slot-scope="scope" slot="type_959677">
        <el-button @click="outVehicleMan(scope.data, 'dx')" type="text" style="width: 100%">{{scope.data.type_959677}}</el-button>
      </template>
      <!-- 夜间抢修 -->
      <template slot-scope="scope" slot="type_959685">
        <el-button @click="outVehicleMan(scope.data, 'yqx')" type="text" style="width: 100%">{{scope.data.type_959685}}</el-button>
      </template>
      <!-- 白天抢修 -->
      <template slot-scope="scope" slot="type_959686">
        <el-button @click="outVehicleMan(scope.data, 'bqx')" type="text" style="width: 100%">{{scope.data.type_959686}}</el-button>
      </template>
      <!-- 一保 -->
      <template slot-scope="scope" slot="type_959687">
        <el-button @click="outVehicleMan(scope.data, 'yb')" type="text" style="width: 100%">{{scope.data.type_959687}}</el-button>
      </template>
      <!-- 二保 -->
      <template slot-scope="scope" slot="type_959688">
        <el-button @click="outVehicleMan(scope.data, 'eb')" type="text" style="width: 100%">{{scope.data.type_959688}}</el-button>
      </template>
      <!-- 三包 -->
      <template slot-scope="scope" slot="type_1708609">
        <el-button @click="outVehicleMan(scope.data, 'sb')" type="text" style="width: 100%">{{scope.data.type_1708609}}</el-button>
      </template>
    </tr-table>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import { formatDateTime } from '@/utils/index'
export default {
  name: "vehicletype-maintenance-statistics",
  components: {
    subReq
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  data() {
    return {
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      canRendererTableHeader: null,
    }
  },
  methods: {
    outVehicleMan(val, type) {
      let arr = this.form.month.split('-')
      let startArr = formatDateTime(new Date(arr[0], arr[1] - 1, 1)).split(' ')
      let start_date = startArr[0]
      let end_date = formatDateTime(new Date(arr[0], arr[1], 0, 23,59,59))
      let info = {}
      switch (type) {
        case 'xx':
          info={
            start_date,
            end_date,
            type_child: 959676,
            // veh_type: val. vehicle_kind_id
          }
          break
        case 'dx':
          info={
            start_date,
            end_date,
            type_child: 959677,
            // veh_type: val. vehicle_kind_id
          }
          break
        case 'yqx':
          info={
            start_date,
            end_date,
            type_child: 959685,
            // veh_type: val. vehicle_kind_id
          }
          break
        case 'bqx':
          info={
            start_date,
            end_date,
            type_child: 959686,
            // veh_type: val. vehicle_kind_id
          }
          break
        case 'yb':
          info={
            start_date,
            end_date,
            type_child: 959687,
            // veh_type: val. vehicle_kind_id
          }
          break
        case 'eb':
          info={
            start_date,
            end_date,
            type_child: 959688,
            // veh_type: val. vehicle_kind_id
          }
          break
        case 'sb':
          info={
            start_date,
            end_date,
            type_child: 1708609,
            // veh_type: val. vehicle_kind_id
          }
          break
      }
      // console.log(info);
      this.$router.push({
        name:'vehicle-maintenance-statistics',
        params: info
      })
    },
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 加载数据
    loadData() {
      this.$client.GetTitleVehicleKindRepairCount(this.form).then(req => {
        if(req.head.result === '200') {
          let dataList = req.context
          dataList.splice(0, 1)
          this.canRendererTableHeader = dataList
        }else {
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      })
      this.loading = true
      this.$client.GetTyreCountVehicleKindRepairCount(this.form).then(req => {
        this.loading = false
        if(req.head.result === '200') {
          this.data = req.context
        }else {
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      })
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      this.$client.ExportVehicleKindRepairCount(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicletype-maintenance-statistics {
  height: 100%;
  width: 100%;
}
</style>
