<template>
  <div class="dept-promotion-statistics">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="ExportBicycle"
      @on-edit="editAll"
      @on-save="saveAll"
      >
    </sub-req>

    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
    >
      <template slot-scope="scope" slot="voice_message">
        <el-input v-model="scope.data.voice_message" v-if="isEditAll || (type == 'edit' && rowIndex == scope.index)"></el-input>
        <span v-else>{{ scope.data.voice_message }}</span>
      </template>
      <template slot-scope="scope" slot="car_rental">
        <el-input v-model="scope.data.car_rental" v-if="isEditAll || (type == 'edit' && rowIndex == scope.index)"></el-input>
        <span v-else>{{ scope.data.car_rental }}</span>
      </template>
      <template slot-scope="scope" slot="lost_car">
        <el-input v-model="scope.data.lost_car" v-if="isEditAll || (type == 'edit' && rowIndex == scope.index)"></el-input>
        <span v-else>{{ scope.data.lost_car }}</span>
      </template>
      <template slot-scope="scope" slot="out_side">
        <el-input v-model="scope.data.out_side" v-if="isEditAll || (type == 'edit' && rowIndex == scope.index)"></el-input>
        <span v-else>{{ scope.data.out_side }}</span>
      </template>
      <template slot-scope="scope" slot="loss_car">
        <el-input v-model="scope.data.loss_car" v-if="isEditAll || (type == 'edit' && rowIndex == scope.index)"></el-input>
        <span v-else>{{ scope.data.loss_car }}</span>
      </template>
      <template slot-scope="scope" slot="remark">
        <el-input v-model="scope.data.remark" v-if="isEditAll || (type == 'edit' && rowIndex == scope.index)"></el-input>
        <span v-else>{{ scope.data.remark }}</span>
      </template>

      <template slot-scope="scope" slot="operation">
        <el-button v-if="isEditAll || (type == 'edit' && rowIndex == scope.index)" type="primary" size="mini" @click="save(scope.data,scope.index)">保存</el-button>
        <el-button v-else type="primary" size="mini" @click="edit(scope.data,scope.index)">编辑</el-button>
      </template>
    </tr-table>

    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    >
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
export default {
  name: 'dept-promotion-statistics',
  components: {
    subReq,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [],
      typeList: [],
      sumTotal: null,
      sumColumnIndex: [],
      rowIndex: null,
      type: 'detail',
      isEditAll: false

    }
  },
  mounted() {
    this.reqWorkOrderDataDictionary()
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPassengerBicycleTotals({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list

            this.data.forEach(item => {
              for (const key in item.passenger_total) {
                this.typeList.forEach((child,index) => {
                  if (key == child.c_name) {
                    item[`type${index}`] = item.passenger_total[key]
                  }
                })
              }
            })
            this.sumTotal = {}
            this.sumColumnIndex = []
            let summary = res.context.summary
            this.customSettingList.forEach(item => {
              for (const key in summary) {
                if (item.label == key) {
                  this.sumTotal[item.id] = summary[key]
                  this.sumColumnIndex.push(item.id)
                }
              }
            })
            console.log('sumTotal',JSON.parse(JSON.stringify(this.sumTotal)));
            console.log('sumColumnIndex',JSON.parse(JSON.stringify(this.sumColumnIndex)));
            
            this.$refs.table.headerDragend()

            this.pageInfo.pageCount = res.context.total
            
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 组装数据表头
    getCustomSettingList() {
      let L = this.typeList.length
      let settingList1 = [
        {
          id: 1,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 0,
        },
      ]
      let settingList2 = [
        {
          id: L + 2,
          label: "小计",
          prop: "total",
          width: "130",
          align: "center",
          signIndex: L + 1,
        },
        {
          id: L + 3,
          label: "语音留言",
          prop: "voice_message",
          width: "130",
          align: "center",
          signIndex: L + 2 ,
        },
        {
          id: L + 4,
          label: "租车量",
          prop: "car_rental",
          width: "130",
          align: "center",
          signIndex: L + 3 ,
        },
        {
          id: L + 5,
          label: "车辆状态",
          prop: "voice_message",
          width: "130",
          align: "center",
          signIndex: L + 4 ,
          nestedTablesHeader: [
            {
              label: "盗窃车辆丢失",
              prop: "lost_car",
              width: "120",
              align: "center",
              id: 101,
              signIndex: 100,
            },
            {
              label: "车辆遗失登记",
              prop: "out_side",
              width: "120",
              align: "center",
              id: 102,
              signIndex: 101,
            },
            {
              label: "晚上在外车辆",
              prop: "loss_car",
              width: "120",
              align: "center",
              id: 103,
              signIndex: 102,
            },
          ]
        },
        {
          id: L + 6,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: L + 5 ,
        },
        {
          id: L + 7,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: L + 6,
        },
      ]
      let settingList3 = []
      this.typeList.forEach((item,index) => {
        let obj = {
          id: index + 2,
          label: item.c_name,
          prop: `type${index}`,
          width: "100",
          align: "center",
          signIndex: index + 1,
        }
        settingList3.push(obj)
      })

      this.customSettingList = [...settingList1,...settingList3,...settingList2]

    },
     // 获取工单类型数据字典
     reqWorkOrderDataDictionary() {
      this.workOrderType = '';
      let context = ['passenger-service-work-order-type-bicycle']
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        if (req.head.result === '200') {
          if (req.context.length) {
            this.typeList = req.context[0].dic_detls;
            this.getCustomSettingList()
            this.$refs.head.onSubmit()
          }
        }
      })
    },
    // 导出
    ExportBicycle() {
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ExportBicycle({context:params}).then(res => {
        if(res.head.result == "200") {
          window.location.href = res.context;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
          this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 编辑 
    edit(row,index) {
      this.rowIndex = index
      this.type = 'edit'
    },
    // 单个保存
    save(row) {
      this.$client.UpdatePassengerBicycleTotal({context: [row]}).then(res => {
        if (res.head.result == "200") {
          this.type = "detail"
          this.rowIndex = null
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    editAll() {
      if (this.data.length > 0) {
        this.isEditAll = true
        this.$refs.head.isEdit = false
      }
    },
    // 批量保存
    saveAll() {
      this.$client.UpdatePassengerBicycleTotal({context: this.data}).then(res => {
        if (res.head.result == "200") {
          this.isEditAll = false
          this.$refs.head.isEdit = true
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.dept-promotion-statistics
  height: 100%
  width: 100%
</style>