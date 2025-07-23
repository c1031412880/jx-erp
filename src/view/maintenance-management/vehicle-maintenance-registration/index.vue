<template>
  <div class="vehicle-maintenance-registration">
    <sub-req
      ref="head"
      :isSetHour="isSetHour"
      @on-ok="onSubmit"
      @on-add="addMaintenanceInfo"
      @on-del="deleteSelectInfo"
      @on-export="exportFile"
      @on-screen="onScreen"
      @on-set="onSetRepairHours"
      @on-save="onSaveRepairHours"
    ></sub-req>
    <!-- //高级筛选 -->
    <drawer-dialog
      ref="drawerDialog"
      :drawer.sync="isShowDrawerDialog"
      @on-ok="onSubmit"
    ></drawer-dialog>
    <tr-table
      ref="table"
      :data="data"
      :loading="loading"
      :selectionShow="true"
      :TableHeight="TableHeight"
      :tableHeaderList="canRendererTableHeader"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedList"
      :spanMethodType="['column']"
      :rowspanObj="rowspanObj"
      :mergekeys="mergekeys"
      :isShowSummary="true"
      :sumTotal="sumTotal"
      :sumColumnIndex="sumColumnIndex"
    >
      <template slot-scope="scope" slot="names">
        <el-input
          type="textarea"
          v-model="scope.data.names"
          size="mini"
          :rows="2"
          placeholder="请输入维修项目名称"
          :disabled="isSetHour"
        ></el-input>
        <!-- <span v-else>{{scope.data.names}}</span> -->
      </template>
      <template slot-scope="scope" slot="hours">
        <span v-if="!!scope.data.shop_names">
          {{ scope.data.shop_names }}:
          <el-input-number
            :disabled="isSetHour"
            size="mini"
            style="width: 80px"
            :controls="false"
            :min="0"
            :precision="2"
            v-model="scope.data.shop_hours"
          ></el-input-number>
        </span>
      </template>
      <template slot-scope="scope" slot="person">
        <el-select
          v-if="!isSetHour"
          v-model="scope.data.person_ids"
          placeholder="请选择维修人员"
          size="mini"
          multiple
          clearable
        >
          <el-option
            v-for="item in scope.data.shop_persons"
            :key="item.person_id"
            :label="item.name"
            :value="item.person_id"
          ></el-option>
        </el-select>
        <span v-else>{{ scope.data.person }}</span>
      </template>
      <template slot-scope="scope" slot="vehicle_name">
        <span v-if="scope.data.vehicle_info == null"></span>
        <span v-else>{{ scope.data.vehicle_info.vehicle_name }}</span>
      </template>
      <template slot-scope="scope" slot="vehicle_number">
        <span v-if="scope.data.vehicle_info == null"></span>
        <span v-else>{{ scope.data.vehicle_info.vehicle_number }}</span>
      </template>
      <template slot-scope="scope" slot="department_name">
        <span v-if="scope.data.vehicle_info == null"></span>
        <span v-else>{{ scope.data.vehicle_info.department_name }}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button
          type="text"
          size="mini"
          v-if="$isPowerShow('edit')"
          @click="editRowInfo(scope.data)"
        >
          编辑
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="$isPowerShow('search')"
          @click="detailRowInfo(scope.data)"
        >
          详情
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="$isPowerShow('del') && scope.data.state == 7"
          @click="deleteRowInfo(scope.data, 1)"
        >
          删除
        </el-button>
        <el-button
          type="text"
          size="mini"
          v-if="$isPowerShow('cancel') && scope.data.state != 7"
          @click="cancelRowInfo(scope.data)"
        >
          报废
        </el-button>
        <!-- <el-button type="text" size="mini" @click="onSetRepairHours(scope.data, scope.index)">{{!!scope.data.isSetHour ? '保存工时' : '编辑工时'}}</el-button> -->
        <el-button
          type="text"
          size="mini"
          v-if="scope.data.state == 6"
          @click="auditOrder(scope.data, 4)"
        >
          反审核
        </el-button>
        <el-button type="text" size="mini" v-else @click="auditOrder(scope.data, 6)">
          审核
        </el-button>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    ></el-pagination>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
    <set-info-dialog
      ref="setInfoDialog"
      :dialogBool.sync="InfoDialogVisible"
      :curChangeType="curChangeType"
      @sure-save="sureSaveInfo"
    ></set-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import setInfoDialog from './component/set-info-dialog'
  import drawerDialog from "./component/drawer-dialog";
export default {
  name: 'vehicle-maintenance-registration',
  components: {
    subReq,
    setInfoDialog,
    drawerDialog
  },
  data() {
    return {
      pageInfo: {
          pageIndex: 1,
          pageSize: 20,
          pageCount: 0
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      canRendererTableHeader: null,
      customSettingShowList: null,
      customSettingVialogVisible: false,
      frontFixedNum: 1,
      backFixedNum: 1,
      selectList: [],
      customSettingList: [
        {
          id: 1,
          label: "工单号码",
          prop: "work_code",
          width: "120",
          align: "center",
          signIndex:0,
          sortable:false
        },
        {
          id: 2,
          label: "工单状态",
          prop: "state_detail_name",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:false
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "自编号",
          prop: "vehicle_number",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "线路",
          prop: "line_name",
          width: "120",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "所属组织",
          prop: "department_name",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "维修类别",
          prop: "type_child_name",
          width: "120",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "维修日期",
          prop: "repair_time",
          width: "160",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "维修项目",
          prop: "names",
          width: "160",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "维修工时",
          prop: "hours",
          width: "240",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "维修人员",
          prop: "person",
          width: "200",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "备注",
          prop: "remark",
          width: "140",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "检验员",
          prop: "finish_check_name",
          width: "120",
          align: "center",
          signIndex:12,
          sortable:false
        },
        {
          id: 14,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "160",
          align: "center",
          signIndex:13,
          sortable:false
        },
        {
          id: 15,
          label: "操作人",
          prop: "create_name",
          width: "120",
          align: "center",
          signIndex:14,
          sortable:false
        },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "260",
          align: "center",
          signIndex:15,
          sortable:false
        },
      ],
      InfoDialogVisible: false,
      curChangeType: 'add', //add添加  edit编辑  search详情
      isShowDrawerDialog:false,
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false,
      oldInfo: null,
      check_list: [],
      rowspanObj:{},
      mergekeys: ['work_code', 'state_detail_name', 'vehicle_name', 'vehicle_number', 'line_name', 'department_name', 'type_child_name', 'repair_time', 'remark', 'finish_check_name', 'maint_dept_name', 'create_name', 'operation'],
      sumTotal:{ //约定某一列汇总合计自定义数据
        5: '',
      },
      sumColumnIndex:[5], //要定义的列的索引
      pageInfoData: '', //当前页面所有数据
      totalColumnProps:['hours'],
      isSetHour: true,
      isFirst: false
    }
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.$refs.head.onSubmit();
    })
  },
  methods: {
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.bulidSumColumnTotalInfo();
        this.$forceUpdate();
      }).catch(err => {})
    },
    // 构建和合计的自动计算
    bulidSumColumnTotalInfo() {
      this.sumColumnIndex = [];
      this.sumTotal = {};
      if(!!this.canRendererTableHeader && this.canRendererTableHeader.length > 0) {
        this.canRendererTableHeader.forEach(element => {
          this.totalColumnProps.forEach(item => {
            if(element.prop == item) {
              this.sumTotal[element.signIndex+1] = ''
              this.sumColumnIndex.push(element.signIndex+1)
            }
          });
        });
      }
      this.bulidTotalData()
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 分页获取
    loadData() {
      this.loading = true
      let params = Object.assign({}, this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageSimpletMaintRepairOrder(params)
        .then(res => {
          if (res.head.result == "200") {
            let infoData = JSON.parse(JSON.stringify(res.context.list))
            infoData.forEach(item => {
              item.id = item.id + 'g' + item.shop_id
              // item.isSetHour = false
              // item.person_list = []
            })
            this.data = infoData;
            this.rowspanObj = this.$handleTableSpan(this.mergekeys, this.data, 'work_code', true)
            this.pageInfo.pageCount = res.context.total
            this.pageInfoData = ''
            Object.keys(res.context.summary).forEach(item => {
              this.pageInfoData += (item + ':' + res.context.summary[item] + ' ')
            })
            this.bulidTotalData();
            console.log(this.pageInfoData);
          } else {
            this.$message({ showClose: true, message: res.head.describle, type: "error",});
          };
          this.loading = false;
        })
    },
    //构建底部合计展示数据
    bulidTotalData() {
      if(this.sumColumnIndex.length > 0 && !!this.pageInfoData) {
        this.sumColumnIndex.forEach(item => {
          this.canRendererTableHeader.forEach(element =>{
            if(item == element.signIndex+1) {
              switch (element.prop) {
                case 'hours':
                  this.sumTotal[item] = this.pageInfoData
                  break;
              }
            }
          })
        })
      }
    },
    // 添加事件
    addMaintenanceInfo() {
      this.curChangeType = 'add'
      this.InfoDialogVisible = true
      this.oldInfo = JSON.parse(localStorage.getItem('maintenanceRegisterInfo'))
      if(this.oldInfo) {
        this.$refs['setInfoDialog'].setData(this.oldInfo)
      }
      if(this.isFirst) {
        this.$refs['setInfoDialog'].getShop()
      }
      this.isFirst = true
    },
    // 保存
    sureSaveInfo(form) {
      localStorage.setItem('maintenanceRegisterInfo',JSON.stringify(form))
      let params = {
        context: form
      };
      if(this.curChangeType=='add') {
        this.$client.addSimpleMaintRepairOrder(params)
          .then(res => {
            if(res.head.result == '200') {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功'
              })
              this.$refs.head.onSubmit();
            }else{
              this.$message({
                showClose: true,
                type: "error",
                message: res.head.describle
              })
            }
          })
      }else {
        params.context.id = parseInt(params.context.id)
        console.log(params, 'bianji');
        this.$client.updateSimpleMaintRepairOrder(params)
          .then(res => {
            if(res.head.result == '200') {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功'
              })
              this.$refs.head.onSubmit();
            }else{
              this.$message({
                showClose: true,
                type: "error",
                message: res.head.describle
              })
            }
          })

      }
    },
    // 多选选中
    selectedList(rowList) {
      let arr = []
      rowList.forEach((item,index) => {
        arr.push(parseInt(item.id))
      });
      this.selectList = [...new Set(arr)]
      console.log(rowList, this.selectList);
    },
    // 报废
    cancelRowInfo(row) {
      let params = {}
      params.context = parseInt(row.id)
      this.$confirm('此操作将永久报废该工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelManyMaintRepairOrder(params)
          .then(res => {
            if (res.head.result == "200") {
              this.$refs.head.onSubmit();
              this.$message({
                showClose: true,
                message: "报废成功",
                type: "success",
              });
            } else {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消报废'
        });
      });

    },
    // 批量删除
    deleteSelectInfo() {
      if(this.selectList.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的选项',
          type: "warning",
        });
        return
      }
      const info = null
      this.deleteRowInfo(info,this.selectList.length);
    },
    //删除
    deleteRowInfo(info,i) {
      const h = this.$createElement
      this.$confirm('', '确认删除', {
        message:h('div',null, [
          h('i',{ class:'el-icon-question',style:'color:#f90;font-size:30px;' }),
          h('span',{ style:'margin-left:10px;font-size:16px;line-height:30px;font-weight:600;vertical-align:top;'}, '是否确认删除？'),
          h('p',{ style:'margin:10px 0 0 40px;' },'当前选中'+i+'条记录，确认删除吗')
        ]),
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
       let params = {
          context: []
        };
        if(!!info) {
          params.context[0] = parseInt(info.id)
        }else{
          params.context = this.selectList
        }
        this.$client.DeleteManyMaintRepairOrder(params)
        .then(res => {
          if (res.head.result == "200") {
            this.$refs.head.onSubmit();
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
          } else {
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
      }).catch(err => {
        this.$message.info('已取消删除!')
      })
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectList ]
      if (ids.length) {
        params.ids = ids
      }
      this.$client.EditItemHourMaintRepairOrder(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 更新表格头部
    // updateTableHeader(newestTableHeaderList) {
    //   this.canRendererTableHeader = null;
    //   this.canRendererTableHeader = newestTableHeaderList;
    //   this.$forceUpdate()
    // },
    // 详情
    detailRowInfo(row) {
      console.log(row);
      this.InfoDialogVisible = true
      this.curChangeType = 'search'
      this.$refs['setInfoDialog'].setData(row)
    },
    // 编辑
    editRowInfo(row) {
      this.isFirst = true
      this.InfoDialogVisible = true
      this.curChangeType = 'edit'
      this.$refs['setInfoDialog'].setData(row)
    },
    // 高级筛选
     onScreen() {
      this.isShowDrawerDialog = true;
    },
    // 编辑/保存工时
    onSetRepairHours() {
      // if(this.data[index].isSetHour) {
        // 保存工时
      //   let params = {
      //     context: []
      //   }
      //   let obj = {
      //     id: info.dispatch_id,
      //     order_id: parseInt(info.id),
      //     total_hour: info.shop_hours,
      //     item_names: info.names,
      //     person_ids: info.person_ids
      //   }
      //   params.context.push(obj)
      //   this.$client.EditItemHourMaintRepairOrder(params).then(res => {
      //   if (res.head.result == "200") {
      //     this.data[index].isSetHour = !this.data[index].isSetHour
      //     this.loadData()
      //   } else {
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "error",
      //     });
      //   };
      // })
      // }else {
      //   // 编辑工时
      //   try{
      //     this.$client.getMaintDeptGetPerson({ dept_id: info.maint_dept ,shop_id: info.shop_id}).then((req) => {
      //       if (req.head.result === "200") {
      //         this.data[index].person_list = req.context;
      //       }
      //     });
      //   }catch(err){}
      //   this.data[index].isSetHour = !this.data[index].isSetHour
      // }
      this.isSetHour = false
    },
    // 保存维修工时
    onSaveRepairHours() {
      let info = []
      for(let i = 0; i < this.data.length; i++) {
        let obj = {
          id: this.data[i].dispatch_id,
          order_id: parseInt(this.data[i].id),
          total_hour: this.data[i].shop_hours,
          item_names: this.data[i].names,
          person_ids: this.data[i].person_ids
        }
        info.push(obj)
      }
      let params = {
        context: info
      }
      // console.log(params);
      // return
      this.$client.EditItemHourMaintRepairOrder(params).then(res => {
        if (res.head.result == "200") {
          this.isSetHour = true
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    },
    auditOrder(row, state) {
      let params = {
        context:{}
      }
      params.context.order_id = parseInt(row.id)
      params.context.state = state
      this.$client.updateOrderState(params).then(res => {
        if(res.head.result == "200") {
          this.$message({
            type: 'success',
            message: res.head.describle
          });
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-maintenance-registration {
  height: 100%
  width: 100%
}
</style>
