<template>
    <div class="accident-manage">
      <div class="accident-manage-content">
        <sub-req ref="head"
          @on-add="addInfo"
          @on-ok="onSubmit"
          @on-export="exportFile"
          @on-delete="onDelete"
          @on-import="importExcel"
        ></sub-req>

        <tr-table
          ref="table"
          :selectionShow="true" 
          :data="data"
          :tableHeaderList="customSettingList"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedList"
        >
          <template slot-scope="scope" slot="order_state">
            <span :style="`color: ${showColor(scope.data.i_order_state)}`">{{scope.data.order_state}}</span>
          </template>
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="editInfo(scope.data, 'detail')">查看</el-button>
            <el-button type="text" size="mini" @click="editInfo(scope.data, 'edit',true)" v-if="$isPowerShow('edit')">编辑</el-button>
            <el-button type="text" size="mini" @click="editInfo(scope.data, 'edit')" v-if="$isPowerShow('edit') && scope.data.i_order_state != 3">办结</el-button>
             <el-popconfirm
              @confirm="deleteViolationInfo(scope.data)"
              title="是否确删除此条记录？"
              v-if="$isPowerShow('del')">
              <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm>
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
      </div>

      <div class="dialog-box">
        <!-- 添加信息 -->
         <add-dialog
           ref="addDialog"
           :dialogBool.sync="addDialogShow"
           :curChangeType="curChangeType"
           @sure-save-info="sureSaveInfo"
          ></add-dialog>
        <!-- 上传文件 导出文件弹窗组件 -->
        <file-dialog
          :dialogBool.sync="fileDialogVisible"
          :fileData="FileData"
          :typeMessage="'相同车辆違章记录'"
          @on-submit-excel="importICExcel"
        ></file-dialog>
      </div>

    </div>
</template>

<script type="text/ecmascript-6">
  import subReq from './component/sub-req'
  import AddDialog from './component/dialog/add-dialog'
  import fileDialog from "@/components/fileDialog/file-dialog";

  export default {
    name: "violation-manage",
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
        fileDialogVisible: false,
        FileData: {
          url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/违章记录模板.xlsx`,
        },
        queryform: {}, //查询表单
        data: [], //列表
        loading: false,
        TableHeight: 500,
        addDialogShow: false, //添加信息
        customSettingList:[
          {
            id: 1,
            label: "状态",
            prop: "order_state",
            width: "130",
            align: "center",
            signIndex:0,
          },
          {
            id: 2,
            label: "车牌号(自编号)",
            prop: "lincense_plate_number",
            width: "120",
            align: "center",
            signIndex:1,
            sortable: true
          },
          {
            id: 3,
            label: "所属部门",
            prop: "department_name",
            width: "160",
            align: "center",
            signIndex:2,
          },
          {
            id: 4,
            label: "线路",
            prop: "line",
            width: "120",
            align: "center",
            signIndex:3,
          },
          {
            id: 5,
            label: "违章时间",
            prop: "d_violation_date",
            width: "145",
            align: "center",
            signIndex:4,
          },
          {
            id: 6,
            label: "所属组织经办人",
            prop: "dept_handle_name",
            width: "160",
            align: "center",
            signIndex:5,
          },
          {
            id: 7,
            label: "违章驾驶员",
            prop: "driver_name",
            width: "150",
            align: "center",
            signIndex:6,
          },
          {
            id: 8,
            label: "违章地点",
            prop: "c_place",
            width: "150",
            align: "center",
            signIndex:7,
          },
          {
            id: 9,
            label: "违章项目",
            prop: "violation_name",
            width: "150",
            align: "center",
            signIndex:8,
          },
          {
            id: 10,
            label: "违章扣分",
            prop: "score",
            width: "100",
            align: "center",
            signIndex:9,
          },
          {
            id: 11,
            label: "违章罚款",
            prop: "money",
            width: "135",
            align: "center",
            signIndex:10,
          },
          {
            id: 12,
            label: "备注",
            prop: "c_remark",
            width: "135",
            align: "center",
            signIndex:11,
          },
          {
            id: 13,
            label: "交警处理结果",
            prop: "police_result_name",
            width: "135",
            align: "center",
            signIndex:12,
          },
          {
            id: 14,
            label: "教育时间",
            prop: "d_educate_time",
            width: "135",
            align: "center",
            signIndex:13,
          },
          {
            id: 15,
            label: "教育地点",
            prop: "c_educate_address",
            width: "135",
            align: "center",
            signIndex:14,
          },
          {
            id: 16,
            label: "教育人",
            prop: "educate_user_name",
            width: "135",
            align: "center",
            signIndex:15,
          },
          {
            id: 17,
            label: "记录人",
            prop: "record_user_name",
            width: "135",
            align: "center",
            signIndex:16,
          },
          {
            id: 18,
            label: "扣除安全奖金额（元）",
            prop: "b_deduct_safe",
            width: "160",
            align: "center",
            signIndex:17,
          },
          {
            id: 19,
            label: "教育主要内容记录",
            prop: "c_educate_content",
            width: "160",
            align: "center",
            signIndex:18,
          },
          {
            id: 20,
            label: "操作",
            prop: "operation",
            width: "220",
            align: "center",
            signIndex:19,
          }
        ],
        frontFixedNum:1, //前几行固定
        backFixedNum:1, //后几行固定
        selectedIds:[], //勾选的ID
      }
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
      // 导出Excel
      exportFile(){
        let params = Object.assign({},this.queryform);
        this.$client.exportViolationManage(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: res.head.describle})
          }
        })
      },
      // 添加信息
      addInfo(){
        this.addDialogShow = true
        this.curChangeType = 'add'
        // this.$refs['addDialog'].resetData()
      },
      // 表格上点击编辑、查看 获取详情
      editInfo(val,type,bool){
        this.addDialogShow = true;
        this.curChangeType = type;
        this.$nextTick(() => {
          this.$refs['addDialog'].setData(val,bool)
        })
      },
      // 分页切换事件
      handleCurrentChange(idx) {
        this.pageInfo.pageIndex = idx
        this.loadData()
      },
      // 切换每页条数
      handleSizeChange(sizes) {
        this.pageInfo.pageIndex = 1;
        this.pageInfo.pageSize = sizes;
        this.pageInfo.pageCount = 0;
        this.loadData();
      },
      // 查询
      onSubmit(form) {
        this.queryform = form;
        this.pageInfo.pageIndex = 1;
        this.pageInfo.pageCount = 0;
        this.loadData();
      },
      // 加载数据
      loadData() {
        this.loading = true
        let params = {};
        params = Object.assign({},this.queryform);
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
        this.$client.getListViolationManage({context:params})
        .then(res => {
          if (res.head.result === "200") {
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          };
          this.loading = false;
        })
      },
      // 编辑、保存信息
      sureSaveInfo(context){
        let params = {
          context: context
        };
        if(this.curChangeType == 'add') {
          this.$client.addViolationManageInfo(params)
          .then(res => {
            if(res.head.result == '200') {
              this.loadData();
              this.addDialogShow = false;
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功'
              })
            }else{
              this.$message({
                showClose: true,
                type: "error",
                message: res.head.describle
              })
            }
          })
        }else{
          this.$client.EditViolationManage(params)
          .then(res => {
            if(res.head.result == '200') {
              this.loadData();
              this.addDialogShow = false;
              this.$message({
                showClose: true,
                type: 'success',
                message: '保存成功'
              })
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
      // 勾选中的
      selectedList(list) {
        this.selectedIds = [];
        if(list && list.length > 0) {
          list.forEach((item,index) => {
            this.selectedIds.push(item.i_id)
          });
        }
      },
      // 删除
      deleteViolationInfo(row) {
        this.selectedIds = [];
        this.selectedIds.push(row.i_id)
        if(this.selectedIds.length == 1) {
          this.onDelete();
        }
      },
      // 批量删除
      onDelete() {
        if(this.selectedIds.length == 0) {
          this.$message({
            showClose: true,
            message: '请勾选至少一条要移除的',
            type: "warning",
          });
          return
        }
        let parmas = {
          context: this.selectedIds,
        };
        this.$client.batchDeleteViolationManage(parmas)
        .then(res => {
          if(res.head.result == '200') {
            this.selectedIds = [];
            this.loadData();
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          }

        })

      },
      showColor(state) {
        let color = '';
        switch (state) {
          case 1:
            color = '#333333';
            break;
          case 2:
            color = '#F59A23';
            break;
          case 3:
            color = '#95F204';
            break;
        }
        return color
      },
      importExcel() {
        this.fileDialogVisible = true;
      },
       // 导入信息Excel
      importICExcel(val) {
        let formData = new FormData();
        formData.append("file", val.file);
        let params = formData;
        this.$client.importViolationManage(params).then((res) => {
          if (res.head.result == "200") {
            this.form = {};
            // 重置信息
            this.$refs.head.Reset();
            this.loadData();
            this.fileDialogVisible = false;
            this.$message({ message: res.head.describle, type: "success" });
          } else {
            this.fileDialogVisible = false;
            let errorData = [];
            const h = this.$createElement;
            errorData.push(h("p", null, res.head.describle));
            this.$msgbox({
              title: "提示",
              message: h("div", null, errorData),
              confirmButtonText: "确定",
            });
          }
        });
      },
      // 计算表格高度
      setHead(type) {
        setTimeout(() => {
          let maxh = this.$el.offsetHeight
          let th = this.$refs.head.$el.offsetHeight
          let paginationH = this.$refs.paginationH.$el.offsetHeight;
          this.TableHeight = maxh - th - paginationH;
        }, 60)
      }
    },
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .accident-manage
    width 100%
    height 100%
</style>
