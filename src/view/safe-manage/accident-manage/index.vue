<template>
  <div class="accident-manage">
    <div class="accident-manage-content">
      <sub-req
        ref="head"
        :isCanDelete="isCanDelete"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-delete="onDelete"
        @on-scrap="batchScrap"
        @on-import="openImportPage"
      ></sub-req>

      <tr-table
        ref="table"
        :selectionShow="true"
        :data="accidentData"
        :tableHeaderList="customSettingList"
        :TableHeight="TableHeight"
        :loading="loading || headerLoading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
        @sort-table-change="sortTableChange"
      >
        <template slot-scope="scope" slot="vehicle_number">
          <el-link type="primary" @click="jumpVehicleManage(scope.data.lincense_plate_number)">
            {{ scope.data.vehicle_number }}
          </el-link>
        </template>
        <template slot-scope="scope" slot="lincense_plate_number">
          <el-link type="primary" @click="jumpVehicleManage(scope.data.lincense_plate_number)">
            {{ scope.data.lincense_plate_number }}
          </el-link>
        </template>
        <!-- <template slot-scope="scope" slot="driver_name">
            <el-link type="primary" @click="jumpDriverSafetyfileManage(scope.data.driver_name)">{{scope.data.driver_name}}</el-link>
          </template> -->
        <template slot-scope="scope" slot="n_loss_fee">
          <el-link type="primary" @click="checkAccidentfee(scope.data, 'detail')">
            {{ scope.data.n_loss_fee ? scope.data.n_loss_fee : 0 }}
          </el-link>
        </template>
        <template slot-scope="scope" slot="ex_state">
          <el-link :type="showStateColor(scope.data)" :underline="false">
            {{ scope.data.ex_state ? scope.data.ex_state : '' }}
          </el-link>
        </template>
        <template slot-scope="scope" slot="is_compounding">
          <span>{{ scope.data.is_compounding ? '是' : '否' }}</span>
        </template>
        <template slot-scope="scope" slot="is_responsibility">
          <span>{{ scope.data.is_responsibility ? '是' : '否' }}</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button
            type="text"
            size="mini"
            @click="editInfo(scope.data, 'edit')"
            v-if="$isPowerShow('edit_acc')"
            :disabled="!scope.data.ex_can_edit"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="editInfo(scope.data, 'detail')"
            v-if="$isPowerShow('search_acc')"
          >
            查看
          </el-button>
          <el-popconfirm
            @confirm="deleteCurRowInfo(scope.data)"
            title="是否确删除此条记录？"
            v-if="$isPowerShow('del_acc')"
          >
            <el-button
              slot="reference"
              type="text"
              size="mini"
              style="margin: 0 10px"
              :disabled="!scope.data.ex_can_delete"
            >
              删除
            </el-button>
          </el-popconfirm>
          <el-button
            type="text"
            size="mini"
            @click="dealWithAccident(scope.data, 'detail')"
            v-if="$isPowerShow('search_acc') && scope.data.ex_can_dispose"
            :disabled="!scope.data.ex_can_dispose"
          >
            处理
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="cancellation(scope.data)"
            v-if="$isPowerShow('search_acc') && !!scope.data.ex_can_cancel"
            :disabled="!scope.data.ex_can_cancel"
          >
            撤销
          </el-button>
        </template>
      </tr-table>

      <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      ></el-pagination>
    </div>

    <div class="dialog-box">
      <!-- 添加信息 -->
      <add-dialog
        ref="addDialog"
        :dialogBool.sync="addDialogShow"
        :curChangeType="curChangeType"
        @sure-save-info="sureSaveInfo"
      ></add-dialog>
      <!-- 表格自定义组件 -->
      <!-- <custom-setting
            :dialogBool.sync="customSettingVialogVisible"
            :customSettingList="customSettingList"
            :canRendererTableHeader="canRendererTableHeader"
            :customSettingShowList="customSettingShowList"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
          ></custom-setting> -->
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'相同记录'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
    </div>
  </div>
</template>

<script>
import subReq from './component/sub-req'
import AddDialog from './component/dialog/add-dialog'
import fileDialog from '@/components/fileDialog/file-dialog'

export default {
  name: 'accident-manage',
  components: {
    subReq,
    AddDialog,
    fileDialog
  },
  data() {
    return {
      curChangeType: 'add', //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      filedialogVisible: false,
      queryform: {}, //查询表单
      accidentData: [], //列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addDialogShow: false, //添加信息
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: '事故编号',
          prop: 'c_accident_code',
          width: '130',
          align: 'center',
          signIndex: 0
        },
        {
          id: 2,
          label: '自编号',
          prop: 'vehicle_number',
          width: '130',
          align: 'center',
          signIndex: 1,
          sortable: true
        },
        {
          id: 3,
          label: '车牌号',
          prop: 'lincense_plate_number',
          width: '120',
          align: 'center',
          signIndex: 2
        },
        {
          id: 4,
          label: '所属部门',
          prop: 'department_name',
          width: '160',
          align: 'center',
          signIndex: 3,
          sortable: true
        },
        {
          id: 5,
          label: '线路',
          prop: 'line',
          width: '120',
          align: 'center',
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: '事故发生时间',
          prop: 'd_accident_date',
          width: '145',
          align: 'center',
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: '驾驶员',
          prop: 'driver_name',
          width: '120',
          align: 'center',
          signIndex: 6
        },
        {
          id: 8,
          label: '事故性质',
          prop: 'accident_nature',
          width: '120',
          align: 'center',
          signIndex: 7
        },
        {
          id: 9,
          label: '事故原因',
          prop: 'accident_reason',
          width: '150',
          align: 'center',
          signIndex: 8
        },
        {
          id: 10,
          label: '事故地点',
          prop: 'c_accident_address',
          width: '100',
          align: 'center',
          signIndex: 9
        },
        {
          id: 11,
          label: '事故地点类别',
          prop: 'accident_address_type',
          width: '150',
          align: 'center',
          signIndex: 10
        },
        {
          id: 12,
          label: '事故分类',
          prop: 'accident_type',
          width: '100',
          align: 'center',
          signIndex: 11
        },
        {
          id: 13,
          label: '事故类型',
          prop: 'accident_lx',
          width: '100',
          align: 'center',
          signIndex: 12
        },
        {
          id: 14,
          label: '是否私了',
          prop: 'is_compounding',
          width: '100',
          align: 'center',
          signIndex: 13
        },
        {
          id: 15,
          label: '客伤评定无责事故',
          prop: 'is_responsibility',
          width: '100',
          align: 'center',
          signIndex: 14
        },
        {
          id: 16,
          label: '事故责任',
          prop: 'accident_duty',
          width: '135',
          align: 'center',
          signIndex: 15
        },
        {
          id: 17,
          label: '事故等级',
          prop: 'accident_category',
          width: '140',
          align: 'center',
          signIndex: 16
        },
        {
          id: 18,
          label: '事故类别',
          prop: 'accident_type_category',
          width: '140',
          align: 'center',
          signIndex: 17
        },
        {
          id: 19,
          label: '事故描述',
          prop: 'c_describe',
          width: '200',
          align: 'center',
          signIndex: 18
        },
        {
          id: 20,
          label: '人伤金额',
          prop: 'accident_total_fee',
          width: '140',
          align: 'center',
          signIndex: 19
        },
        {
          id: 21,
          label: '车辆维修金额',
          prop: 'n_actual_fee',
          width: '150',
          align: 'center',
          signIndex: 20
        },
        {
          id: 22,
          label: '保险理赔金额',
          prop: 'n_insurance_pay_fee',
          width: '150',
          align: 'center',
          signIndex: 21
        },
        {
          id: 23,
          label: '他人赔付金额',
          prop: 'n_personal_fee',
          width: '150',
          align: 'center',
          signIndex: 22
        },
        {
          id: 24,
          label: '事故净损失',
          prop: 'n_loss_fee',
          width: '150',
          align: 'center',
          signIndex: 23
        },
        {
          id: 25,
          label: '经办人',
          prop: 'agent',
          width: '140',
          align: 'center',
          signIndex: 24
        },
        {
          id: 26,
          label: '扣减安全里程',
          prop: 'n_result_mile',
          width: '160',
          align: 'center',
          signIndex: 25
        },
        {
          id: 27,
          label: '安全奖扣款',
          prop: 'n_result_cost',
          width: '140',
          align: 'center',
          signIndex: 26
        },
        {
          id: 28,
          label: '处理状态',
          prop: 'ex_state',
          width: '135',
          align: 'center',
          signIndex: 27
        },
        {
          id: 29,
          label: '处理人',
          prop: 'disposer',
          width: '135',
          align: 'center',
          signIndex: 28
        },
        {
          id: 30,
          label: '处理日期',
          prop: 'd_result_date',
          width: '140',
          align: 'center',
          signIndex: 29
        },
        {
          id: 31,
          label: '处理意见',
          prop: 'c_result_remark',
          width: '140',
          align: 'center',
          signIndex: 30
        },
        {
          id: 32,
          label: '操作',
          prop: 'operation',
          width: '220',
          align: 'center',
          signIndex: 31
        }
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      curSelectedId: '', // 当前选中的ID
      selectedIds: [], //勾选可删除的ID
      selectedListIds: [], //勾选的所有ID
      isCanDelete: true,
      titlesId: '', //当前表头的id
      menu_code: '',
      headerLoading: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK + '/Files/TempFiles/事故管理导入模板.xlsx'
      },
      filedialogVisible: false
    }
  },
  created() {
    // this.menu_code = this.$route.meta.code
    // this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // updateTableHeader(newestTableHeaderList) {
    //   this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
    //     this.canRendererTableHeader = null;
    // this.customSettingShowList = null;
    //     this.reqTitleTable()
    //   }).catch(err => {

    //   })
    // },
    // // 获取表头
    // reqTitleTable() {
    //   this.headerLoading = true;
    //   this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
    //     this.titlesId = res.titlesId;
    //     this.canRendererTableHeader = res.canRendererTableHeader;
    //     this.customSettingList = res.customSettingList;
    // this.customSettingShowList = res.customSettingShowList;
    //     this.$forceUpdate();
    //     setTimeout(() =>{
    //       this.headerLoading = false;
    //     },600)
    //   }).catch(err => {
    //     setTimeout(() =>{
    //       this.headerLoading = false;
    //     },600)
    //   })
    // },
    // 跳转到车辆信息管理
    jumpVehicleManage(lp_num) {
      this.$router.push({
        name: 'vehinfo-manage',
        params: {
          name: lp_num
        }
      })
    },
    // 跳转到驾驶员档案安全管理
    jumpDriverSafetyfileManage(driver_name) {
      this.$router.push({
        name: 'driver-safetyfile-manage',
        params: {
          driverName: driver_name
        }
      })
    },
    // 打开导入弹窗
    openImportPage() {
      this.filedialogVisible = true
    },
    // 导入
    onSubmitExcel(exportInfo) {
      let formData = new FormData()
      formData.append('file', exportInfo.file)
      formData.append('type', exportInfo.radio)

      let params = formData
      this.$client.importAccidentRecord(params).then(res => {
        if (res.head.result == '200') {
          this.loadData()
          this.filedialogVisible = false
          this.$message({ message: res.head.describle, type: 'success' })
        } else {
          this.filedialogVisible = false
          let errorData = []
          const h = this.$createElement
          errorData.push(h('p', null, res.head.describle))
          this.$msgbox({
            title: '提示',
            message: h('div', null, errorData),
            confirmButtonText: '确定'
          })
        }
      })
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.queryform)
      let ids = [...this.selectedListIds]
      if (ids.length) {
        params.ids = ids
      }
      this.$client.exportAccidentRecord(params).then(res => {
        if (res.head.result == '200') {
          window.location.href = res.context
          this.$message({ type: 'success', message: '导出成功' })
        } else {
          this.$message({ type: 'error', message: '导出失败' })
        }
      })
    },
    // 批量删除
    onDelete() {
      if (this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的',
          type: 'warning'
        })
        return
      }
      let parmas = {
        context: this.selectedIds
      }
      this.$client.deleteAccidentInfo(parmas).then(res => {
        if (res.head.result == '200') {
          this.selectedIds = []
          // // 清除勾选
          // this.$refs.table.handleSelectionChange([]);
          this.loadData()
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 打印事故等级表
    batchScrap() {
      if (this.selectedListIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请选择要打印的数据',
          type: 'error'
        })
        return
      } else if (this.selectedListIds.length > 1) {
        this.$message({
          showClose: true,
          message: '目前只支持打印一条数据',
          type: 'error'
        })
        return
      } else {
        let params = {
          context: {
            object_id: 60,
            enable: 1
          }
        }
        this.$client
          .GetByPage(params)
          .then(req => {
            let data = req.context.list
            if (!data.length) {
              this.$message({
                showClose: true,
                message: '暂无该表单打印模板,请到打印模板管理确认.',
                type: 'error'
              })
              return false
            }
            if (data.length == 1) {
              let url =
                window.newHttpConfig.printUrl +
                '/html/preview?appid=' +
                window.newHttpConfig.printUrl_appid +
                '&_u=' +
                data[0].file_name +
                '&id=' +
                this.selectedListIds[0]
              window.open(url, '_blank')
            }
          })
          .catch(err => {
            console.log(err)
            this.$message({
              showClose: true,
              message: '服务出错,请联系开发人员.',
              type: 'error'
            })
          })
      }
    },
    // 添加信息
    addInfo() {
      this.addDialogShow = true
      this.curChangeType = 'add'
      this.$refs['addDialog'].resetData()
    },
    // // 打开自定义表格头部弹窗
    // openSettingPageEvent() {
    //   this.customSettingVialogVisible = true;
    // },
    // 表格上点击编辑、查看 获取详情
    editInfo(val, type) {
      this.addDialogShow = true
      this.curChangeType = type
      this.$refs['addDialog'].setData(val)
      this.$refs['addDialog'].activeName = 'first'
    },
    // 删除
    deleteCurRowInfo(row) {
      this.selectedIds = []
      if (this.selectedIds.length == 0) {
        this.selectedIds.push(row.i_id)
        // 删除
        this.onDelete()
      }
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageSize = sizes
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 查询
    onSubmit(form) {
      this.queryform = form
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {}
      params = Object.assign({}, this.queryform)
      params.page_index = this.pageInfo.pageIndex
      params.page_size = this.pageInfo.pageSize
      this.$client.getAccidentRecordList(params).then(res => {
        if (res.head.result == '200') {
          this.accidentData = res.context.list
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
        this.loading = false
      })
    },
    // 编辑、保存信息
    sureSaveInfo(context, type, approveStepList) {
      if (type == 'saveAndClose') {
        // 提交流程
        this.submitApplyMembershipForm(context, type, approveStepList)
      }

      if (type == 'save') {
        delete context.flow_id
        delete context.flow_code
        this.sureSaveSumbitFormData(context, type)
      }
    },
    // 发起流程获取code和流程id  （发起流程）
    submitApplyMembershipForm(context, type, approveStepList) {
      console.log(approveStepList)
      if (approveStepList.length) {
        let params = {
          context: approveStepList
        }
        this.$client
          .StartFlowRecord(params)
          .then(res => {
            if (res.head.result == '200') {
              context.flow_id = res.context.id
              context.flow_code = res.context.code
              context.is_start_flow = true
              if (!!context.flow_id && !!context.flow_code) {
                this.sureSaveSumbitFormData(context, type)
              }
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: 'error'
              })
            }
          })
          .catch(err => {})
      } else {
        delete context.flow_id
        delete context.flow_code
        this.sureSaveSumbitFormData(context, type)
      }
    },
    // 确定保存或提交发起审批流程数据
    sureSaveSumbitFormData(context, type) {
      let params = {
        context: context
      }
      if (!context.i_id) {
        this.$client.addAccidentRecordInfo(params).then(res => {
          if (res.head.result == '200') {
            // this.form = {};
            if (this.curChangeType == 'add') {
              this.queryform = {}
              this.pageInfo.pageCount = 0
              this.pageInfo.pageIndex = 1
              setTimeout(() => {
                this.$refs.head.onSubmit()
              }, 100)
            } else {
              this.loadData()
            }
            // type: save保存、 saveAndClose保存关闭窗口
            if (type == 'saveAndClose') {
              this.addDialogShow = false
              this.$message({
                showClose: true,
                type: 'success',
                message: `${context.flow_id ? '保存并提交审批成功' : '保存成功'}`
              })
            } else {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功'
              })
            }
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: res.head.describle
            })
          }
        })
      } else {
        this.$client.EditAccidentRecordInfo(params).then(res => {
          if (res.head.result == '200') {
            // this.form = {};
            if (this.curChangeType == 'add') {
              this.queryform = {}
              this.pageInfo.pageCount = 0
              this.pageInfo.pageIndex = 1
              setTimeout(() => {
                this.$refs.head.onSubmit()
              }, 100)
            } else {
              this.loadData()
            }
            // type: save保存、 saveAndClose保存关闭窗口
            if (type == 'saveAndClose') {
              this.addDialogShow = false
              this.$message({
                showClose: true,
                type: 'success',
                message: `${context.flow_id ? '保存并提交审批成功' : '保存成功'}`
              })
            } else {
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功'
              })
            }
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: res.head.describle
            })
          }
        })
      }
    },

    // 勾选中的
    selectedList(list) {
      this.selectedIds = []
      this.selectedListIds = []
      this.isCanDelete = true
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          this.selectedListIds.push(item.i_id)
          if (!!item.ex_can_delete) {
            this.selectedIds.push(item.i_id)
          } else {
            this.isCanDelete = false
          }
        })
      }
    },
    // 显示不通状态下的颜色
    // 1未发起处理2处理中3处理完成4已驳回5已作废
    showStateColor(val) {
      let colorType = ''
      switch (val.state) {
        case 1:
        case 4:
          colorType = 'danger'
          break
        case 2:
          colorType = 'warning'
          break
        case 3:
          colorType = 'primary'
          break
        case 5:
          colorType = 'info'
          break
      }
      return colorType
    },
    // 查看事故费用
    checkAccidentfee(val, type) {
      this.curChangeType = type
      this.$refs['addDialog'].setData(val)
      this.addDialogShow = true
      this.$refs['addDialog'].activeName = 'six'
    },
    // 处理事故 打开事故详情申请流程单
    dealWithAccident(info) {
      // this.$router.push({
      //   name:'accident-detail-dispose',
      //   params: {}
      // })
      this.$router.push({
        path: `/news-details/${info.i_id}/事故详情${info.c_accident_code}/60`,
        params: { id: info.i_id, model: 60 }
      })
    },
    // 申请流程作废
    cancellation(info) {
      // let params = {
      //   context: [info.i_id]
      // }
      // this.$client.InvalidAccidentAccidentManage(params)
      // .then(res => {
      //   if(res.head.result == '200') {
      //     this.loadData();
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "success",
      //     });
      //   }else{
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "success",
      //     });
      //   }
      // })

      this.$confirm('此操作将撤回这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$client.CancelFlowRecord({ context: info.flow_id }).then(req => {
            if (req.head.result === '200') {
              this.loadData()
              eventOn.$emit('update-upcoming-matter')
              this.$message({
                message: req.head.describle,
                type: 'success'
              })
            } else {
              this.$message.error(req.head.describle)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消撤回'
          })
        })
    },
    // 表头排序
    sortTableChange(sortFrom) {
      if (!!sortFrom) {
        const map = {
          department_name: 1,
          line: 2,
          d_accident_date: 3
        }
        let info = {
          order_sort: map[sortFrom.sort],
          order_ase: sortFrom.ase
        }
        this.queryform = Object.assign(this.queryform, info)
      } else {
        delete this.queryform.order_sort
        delete this.queryform.order_ase
      }
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.loadData()
    },
    // 计算表格高度
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - th - paginationH
      }, 60)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-manage
  width 100%
  height 100%
</style>
