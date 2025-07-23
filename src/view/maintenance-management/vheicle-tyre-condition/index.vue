<template>
  <div class="vheicle-tyre-condition">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportFile"
    ></sub-req>

    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="operation">
        <el-button @click="editVehicleTyreInfo(scope.data)" type="primary" size="mini" v-if="$isPowerShow('edit')">编辑</el-button>
        <!-- <el-popconfirm @confirm="deleteScrapVehicle(scope.data)" title="是否确删除此条记录？" v-if="$isPowerShow('del')">
          <el-button slot="reference" type="danger" size="mini">删除</el-button>
        </el-popconfirm> -->
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
      :total="pageInfo.pageCount">
    </el-pagination>

    <edit-info-dialog
      ref="editInfoDialog"
      @on-load="loadData"
      :dialogBool.sync="editDialogShow"
      ></edit-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import editInfoDialog from "./component/edit-info-dialog";
export default {
  name: "vheicle-tyre-condition",
  components: {
    subReq,
    editInfoDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      selectId: 0,
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum:1, //前几行固定
      backFixedNum:1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        // {
        //   id: 3,
        //   label: "轮胎规格型号",
        //   prop: "tyre_model_brand",
        //   width: "160",
        //   align: "center",
        //   signIndex: 2,
        // },
        {
          id: 3,
          label: "左前轮",
          prop: "left_front_wheel",
          width: "300",
          align: "center",
          signIndex: 2,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "编号",
              prop: "left_front_code",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "随车里程",
              prop: "left_front_miles",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "安装日期",
              prop: "left_front_date",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "轮胎品牌",
              prop: "left_front_brand",
              width: "120",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 4,
          label: "右前轮",
          prop: "right_front_wheel",
          width: "300",
          align: "center",
          signIndex: 3,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "编号",
              prop: "right_front_code",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "随车里程",
              prop: "right_front_miles",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "安装日期",
              prop: "right_front_date",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "轮胎品牌",
              prop: "right_front_brand",
              width: "120",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 5,
          label: "左后外轮",
          prop: "left_rear_outer_wheel",
          width: "300",
          align: "center",
          signIndex: 4,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "编号",
              prop: "left_rear_outer_code",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "随车里程",
              prop: "left_rear_outer_miles",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "安装日期",
              prop: "left_rear_outer_date",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "轮胎品牌",
              prop: "left_rear_outer_brand",
              width: "120",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 6,
          label: "左后内轮",
          prop: "left_rear_inner_wheel",
          width: "300",
          align: "center",
          signIndex: 5,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "编号",
              prop: "left_rear_inner_code",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "随车里程",
              prop: "left_rear_inner_miles",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "安装日期",
              prop: "left_rear_inner_date",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "轮胎品牌",
              prop: "left_rear_inner_brand",
              width: "120",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 7,
          label: "右后外轮",
          prop: "right_rear_outer_wheel",
          width: "300",
          align: "center",
          signIndex: 6,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "编号",
              prop: "right_rear_outer_code",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "随车里程",
              prop: "right_rear_outer_miles",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "安装日期",
              prop: "right_rear_outer_date",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "轮胎品牌",
              prop: "right_rear_outer_brand",
              width: "120",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 8,
          label: "右后内轮",
          prop: "right_rear_inner_wheel",
          width: "300",
          align: "center",
          signIndex: 7,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "编号",
              prop: "right_rear_inner_code",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "随车里程",
              prop: "right_rear_inner_miles",
              width: "120",
              align: "center",
              sortable:false,
            },
            {
              label: "安装日期",
              prop: "right_rear_inner_date",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "轮胎品牌",
              prop: "right_rear_inner_brand",
              width: "120",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 8,
        },
        
      ],
      canRendererTableHeader: null,
      editDialogShow: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {} 
      params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetTyreConditionsTyreManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = []
            let info = res.context.list;
            if(info && info.length) {
              info.forEach(item => {
                let addressInfo = (name) => item.tyres.filter(sing => name == sing.position_name)[0]
                let leftFront = addressInfo('左前轮')
                let rightFront = addressInfo('右前轮')
                let leftOuterFront = addressInfo('左后外轮')
                let leftInnerFront = addressInfo('左后内轮')
                let RightOuterFront = addressInfo('右后外轮')
                let RightInnerFront = addressInfo('右后内轮')
                
                let obj = {
                  id: item.vehicle_id,
                  vehicle_id: item.vehicle_id,
                  dept_name: item.dept_name,
                  vehicle_number: item.vehicle_number,
                  vehicle_name: item.vehicle_name,
                  details: item.tyres ? [...item.tyres] : [],
                  // 左前轮
                  left_front_code: leftFront ? leftFront.code : '',
                  left_front_miles: leftFront ? leftFront.total_miles : '',
                  left_front_date: leftFront ? leftFront.install_date : '',
                  left_front_brand: leftFront ? leftFront.brand : '',
                  // 右前轮
                  right_front_code: rightFront ? rightFront.code : '',
                  right_front_miles: rightFront ? rightFront.total_miles : '',
                  right_front_date: rightFront ? rightFront.install_date : '',
                  right_front_brand: rightFront ? rightFront.brand : '',
                  // 左后外轮
                  left_rear_outer_code: leftOuterFront ? leftOuterFront.code : '',
                  left_rear_outer_miles: leftOuterFront ? leftOuterFront.total_miles : '',
                  left_rear_outer_date: leftOuterFront ? leftOuterFront.install_date : '',
                  left_rear_outer_brand: leftOuterFront ? leftOuterFront.brand : '',
                  // 左后内轮
                  left_rear_inner_code: leftInnerFront ? leftInnerFront.code : '',
                  left_rear_inner_miles: leftInnerFront ? leftInnerFront.total_miles : '',
                  left_rear_inner_date: leftInnerFront ? leftInnerFront.install_date : '',
                  left_rear_inner_brand: leftInnerFront ? leftInnerFront.brand : '',
                  // 右后外轮
                  right_rear_outer_code: RightOuterFront ? RightOuterFront.code : '',
                  right_rear_outer_miles: RightOuterFront ? RightOuterFront.total_miles : '',
                  right_rear_outer_date: RightOuterFront ? RightOuterFront.install_date : '',
                  right_rear_outer_brand: RightOuterFront ? RightOuterFront.brand : '',
                  // 右后内轮
                  right_rear_inner_code: RightInnerFront ? RightInnerFront.code : '',
                  right_rear_inner_miles: RightInnerFront ? RightInnerFront.total_miles : '',
                  right_rear_inner_date: RightInnerFront ? RightInnerFront.install_date : '',
                  right_rear_inner_brand: RightInnerFront ? RightInnerFront.brand : '',
                }
                this.data.push(obj)
              })
            }
            console.log(this.selectId,'this.selectId');
            
            if(this.selectId) {
              this.$refs.editInfoDialog.setData(this.data.filter(item => item.id == this.selectId)[0])
            }
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
    // 编辑车辆轮胎信息
    editVehicleTyreInfo(row) {
      this.editDialogShow = true
      this.selectId = row.id
      this.$refs.editInfoDialog.setData(row)
    },
    // 导出Excel
    exportFile(){
      this.$message({type: 'success', message: '导出成功'})
      return
      let params = Object.assign({}, this.form);
      this.$client.ExportTyreRecord(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    deleteScrapVehicle(){},
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vheicle-tyre-condition {
  width: 100%;
  height: 100%;
}
</style>
