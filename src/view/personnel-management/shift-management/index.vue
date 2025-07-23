<template>
  <div class="shift-management" v-loading="addLoading" element-loading-text="正在重新生成考勤结果，请稍等">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <template slot-scope="scope" slot="attendance_time">
        <span>{{bulidAttendanceTime(scope.data)}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
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
      :total="pageInfo.pageCount"
    >
    </el-pagination>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "shift-management",
  components: {
    subReq,
    informationDialog,
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
      addLoading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "新增班次",
      customSettingList: [
        {
          id: 1,
          label: "班次名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "考勤时间",
          prop: "attendance_time",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      seletedIds:[],
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {
        context:{}
      }
      params.context = Object.assign({}, this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageOaKqbc(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
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
    // 拼接考勤时间
    bulidAttendanceTime(info) {
      let timeStr = '';
      if(!!info.child && info.child.length) {
        info.child .forEach((item,index) => {
          if(index === 0) {
            timeStr = item.up_time+ '-'+ item.down_time
          }else{
            timeStr = timeStr + ',' + item.up_time + '-'+ item.down_time
          }
          
        });
      }
      return timeStr
    },

    // 编辑、添加
    saveAddEdit(form,type) {
      console.log(form)
      this.addLoading = true
      // type = 1 的时候校验班次 是否被使用
      form.is_check_use  = type
      // return
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
        this.$client.AddOaKqbc(parmas).then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.addLoading = false
        })
      } else {
        successrMessage = "编辑成功";
         this.$client.UpdateOaKqbc(parmas).then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          }else if (res.head.result == "205") {
            this.$confirm(res.head.describle, '是否确认修改', {
              distinguishCancelAndClose: true,
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              this.saveAddEdit(form,2)
              }).catch(() => {
                this.$message({
                  showClose: true,
                  message: '已取消',
                  type: "warning",
                });
              });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.addLoading = false
        })
      }
      
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "新增班次";
      this.informationDialogShow = true;
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
    selectedUpkeepPlanList(list) {
      this.seletedIds = [];
      list.forEach((item,index) => {
        this.seletedIds.push(item.id)
      });
    },
    
    // 编辑
    editRowInfo(form) {
      this.curSelecedType = "edit";
      // this.$refs.informationDialog.form.id = form.id;
      // this.$refs.informationDialog.form.c_name = form.c_name;
      // this.$refs.informationDialog.form.c_remark = form.c_remark;
      this.$refs.informationDialog.setData(form)
      this.informationDialogTitle = "班次编辑";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: info.id
      };
      
      this.$client.DeleteOaKqbc(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
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
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.shift-management {
  width: 100%;
  height: 100%;
}
</style>
