<template>
  <div class="monthly-report-assessment-indicators">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req
        ref="head"
        @on-add="openAddPage"
        @on-ok="onSubmit"
      ></sub-req>
      <tr-table
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      >
        <template slot-scope="scope" slot="state_name">
          <span :style="{'color': outColor(scope.data.state)}"> {{ scope.data.state_name }} </span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" style="margin-left: 10px;" @click="editRowInfo(scope.data,'detail')">查看</el-button>
          <el-button type="text" size="mini" style="margin-left: 10px;" v-if="($isPowerShow('admin') || (scope.data.user_id == userId || scope.data.write_person_list.indexOf(userId) != -1)) && scope.data.state != 2" @click="editRowInfo(scope.data,'edit',$isPowerShow('admin'))">编辑</el-button>
        </template>
      </tr-table>
      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50,]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </div>
    <div class="organization-project-dialog">
      <add-classify-dialog
        ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :curType="curType"
        @save-add-edit-organization="saveOrEdit"
      ></add-classify-dialog>
      <reminder-rules-dialog
        ref="setRulesInfo"
        :dialogBool.sync="isShowRulesDialog"
        @on-ok="setRules"
      ></reminder-rules-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import reminderRulesDialog from "./component/reminder-rules-dialog"
import addClassifyDialog from "./component/add-classify-dialog"
import { getUser } from '@/utils/auth';

export default {
  name: "monthly-report-assessment-indicators",
  components: {
    subReq,
    addClassifyDialog,
    reminderRulesDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 30,
        pageCount: 0,
      },
      visible: false,
      placeholder: "请输入关键词",
      curType: 'add', //添加分类
      isShowRulesDialog: false,
      isShowAddClassifyDialog: false,
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "编号",
          prop: "flow_code",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "创建人",
          prop: "user_name",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "所在部门",
          prop: "dept_name",
          width: "120",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "申请日期",
          prop: "request_date",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "考核年份",
          prop: "check_year",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "处理状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 6,
        },
      ],
      loading: false,
      TableHeight:500,

      form:{}, //查询表单数据
      userId: ''
    };
  },
  mounted() {
    this.setHead()
    let userInfo = JSON.parse(getUser());
    this.userId = Number(userInfo.user_id);
  },
  methods: {
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh -th - 35;
      }, 60);
    },
    // 审批单状态
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break;
        case 1:
          return '#F58A40'
          break;
        case 2:
          return '#0CB780'
          break;
        case 3:
          return '#F2260E'
          break;
        case 4:
          return '#999999'
          break;
      }
    },
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetPageListCheckCompletedReport(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {
        this.loading = false;
      })
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          this.curType = 'add'
          this.isShowAddClassifyDialog = true;
          break;
        case "remind":
          this.$nextTick(() => {
            this.isShowRulesDialog = true;
          })
          break;
      }
    },
    // 新增或编辑指标 
    saveOrEdit(params) {
      if (params.form_data.id == 0) {
        this.$client.InsertCheckCompletedReport({context:params}).then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowAddClassifyDialog = false;
            this.$message({
              showClose: true,
              message: '保存成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
      } else {
        this.$client.UpdateCheckCompletedReport({context:params}).then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.isShowAddClassifyDialog = false;
            this.$message({
              showClose: true,
              message: '更新成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
      }
    },
    // 查看 编辑
    editRowInfo(info,type,isAdmin) {
      // 有流程 去审批单 
      if (info.state > 0 && type == 'detail') {
        this.$router.push({
          path: `/news-details/${info.id}/待办事项:集团经营业绩考核指标完成情况跟踪月报表/5240`
        })
      } else {
        if (type == 'detail') {
          this.curType = type 
        } else {
          this.curType = 'edit' 
          if (info.user_id == this.userId) {
            this.curType = 'add'
          }
          if (info.write_person_list.indexOf(this.userId) != -1) {
            this.curType = 'edit'
            if (info.user_id == this.userId) {
              this.curType = 'all'
            }
          }
        }
        if(!!info) {
          this.$client.GetDetailCheckCompletedReport({id:info.id}).then((res) => {
            if (res.head.result == "200") {
              this.isShowAddClassifyDialog = true;
              this.$nextTick(() => {
                this.$refs.addClassifyDialog.setData(res.context,isAdmin)
              })
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
          })
          .catch((err) => {});
          
        }
      }

    },
    // 添加
    setRules(form) {
      let params = {
        context: form
      }
      this.$client.InsertOrUpdateNoticeRule(params).then((res) => {
        if (res.head.result == "200") {
          this.isShowRulesDialog = false;
          this.$message({
            showClose: true,
            message: '设置成功',
            type: "success",
          });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
      .catch((err) => {});
    },
     // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData(true);
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData(true);
    },
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportAssessContent(params).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
        
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.monthly-report-assessment-indicators{
  width: 100%;
  height: 100%;
}
</style>
