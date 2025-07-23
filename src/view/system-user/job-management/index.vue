<template>
  <div class="job-manage">
    <div class="job-manage-manage">
      <el-card class="box-card left-box">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;"
        >
          <span style="white-space:nowrap;">部门</span>
        </div>
        <organization-tree
          ref="organizationTree"
          :loading="organizationloading"
          :placeholder="placeholder"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
        ></organization-tree>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox">
        <sub-req
          ref="head"
          @on-add="openAddJobPage"
          @on-ok="onSubmit"
          @delete-Job="deleteJob"
        ></sub-req>
        <tr-table
          :selectionShow="true"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedUpkeepPlanList"
        >
          <template slot-scope="scope" slot="ref_org">
            <!-- <span v-for="(item,index) in scope.data.ref_org" :key="index">{{item}}</span> -->
            <span v-if="!!scope.data.ref_org && scope.data.ref_org.length > 0">{{checkrefOrgShow(scope.data.ref_org)}}</span>
            <span v-else>--</span>
          </template>
          <template slot="state" slot-scope="scope">
            <el-switch
              v-model="scope.data.state"
              :active-value="0"
              :inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeState(scope.data)"
              :disabled="!$isPowerShow('edit')">
            </el-switch>
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
      </el-card>
    </div>
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit-job="saveAddEditJob"
    ></information-dialog>

    <!-- <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting> -->
  </div>
</template>

<script type="text/ecmascript-6">
import organizationTree from "./component/organization-tree";
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "job-management",
  components: {
    subReq,
    informationDialog,
    organizationTree
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
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "职位",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        // {
        //   id: 2,
        //   label: "职位描述",
        //   prop: "c_remark",
        //   width: "130",
        //   align: "center",
        //   signIndex: 1,
        //   sortable: false,
        // },
        // {
        //   id: 3,
        //   label: "在职职位人数",
        //   prop: "position_count",
        //   width: "130",
        //   align: "center",
        //   signIndex: 2,
        //   sortable: true,
        // },
        {
          id: 2,
          label: "所属部门",
          prop: "dept_name",
          width: "180",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "职务",
          prop: "show_postition_name",
          width: "100",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "职级",
          prop: "show_rank_name",
          width: "100",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "是否启用",
          prop: "state",
          width: "100",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      jobIds:[],
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      placeholder: "请输入关键字",
      departmentInfo: null
    };
  },
  mounted() {
    this.loadData();
    this.loadOrganizationTree()
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    changeState(row) {
      this.curSelecedType = 'edit'
      this.saveAddEditJob(row)
    },
    // 选择某一部门
    selectDepartment(departmentInfo) {
      this.departmentInfo = departmentInfo

      this.form.dept_id = departmentInfo.parent_id === 0 ? '' : departmentInfo.dept_id
      this.loadData()
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client.getOrganizationTree()
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length; 
          this.organizationloading = false;
          if( this.organizationTreeList.length == 0) {
              this.isFirstOrganization = true;
            }
          // if(this.curSelectedDepartment && !this.organizationloading) {
          //   // 重新定位到目前组织树中
          //     this.locationCurNode();
          //   }
          // } else {
          //   this.organizationloading = false;
          //   this.$message({
          //     showClose: true,
          //     message: res.head.describle,
          //     type: "error",
          //   });
        }
      }).catch(err => {

      })
    },
    // updateTableHeader(newestTableHeaderList) {
    //   this.canRendererTableHeader = null;
    //   this.canRendererTableHeader = newestTableHeaderList;
    //   this.$forceUpdate();
    //   console.log(JSON.stringify(this.canRendererTableHeader));
    // },

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
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getSysPositionList(params)
        .then(res => {
          console.log(JSON.stringify(res));
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

    checkrefOrgShow(refOrgList) {
      let showText = '';
      refOrgList.forEach(item => {
        showText = `${showText}${item},`
      });
      return showText
    },
    // 编辑、添加职位
    saveAddEditJob(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.i_id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .addSysPositionInfo(parmas)
        .then((res) => {
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
        })
        .catch((err) => {});
    },
    // 批量删除职位
    deleteJob() {
      if(this.jobIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的职位',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加职位";
      this.informationDialogShow = true;
      setTimeout(() => {
        this.$refs.informationDialog.form.dept_id = [this.departmentInfo.dept_id]
      }, 100);
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

    openAdvancedFilterPage() {
      this.drawerdialogVisible = true;
    },

    selectedUpkeepPlanList(jobList) {
      this.jobIds = [];
      jobList.forEach((item,index) => {
        this.jobIds.push(item.i_id)
      });
      console.log(JSON.stringify(this.jobIds))
    },
    
    // 编辑
    editRowInfo(form) {
      // console.log(form);
      if(form.i_id === 0) {
        this.$message({
          message: '此驾驶员职位为特殊职位，暂无法修改',
          type: 'warning'
        });
        return
      }
      this.curSelecedType = "edit";
      this.informationDialogShow = true;
      this.informationDialogTitle = "编辑职位";
      let dept_id = []
      let postition_name = []
      let rank_name = []
      if (form.dept_id) {
        dept_id = form.dept_id.split(',')
        for (let index = 0; index < dept_id.length; index++) {
          dept_id[index] = Number(dept_id[index])
        }
      }
      if (form.postition_name) {
        postition_name = form.postition_name.split(',')
        for (let index = 0; index < postition_name.length; index++) {
          postition_name[index] = Number(postition_name[index])
        }
      }
      if (form.rank_name) {
        rank_name = form.rank_name.split(',')
        for (let index = 0; index < rank_name.length; index++) {
          rank_name[index] = Number(rank_name[index])
        }
      }
      setTimeout(() => {
        this.$refs.informationDialog.form.i_id = form.i_id;
        this.$refs.informationDialog.form.c_name = form.c_name;
        this.$refs.informationDialog.form.dept_id = dept_id;
        this.$refs.informationDialog.form.postition_name = postition_name;
        this.$refs.informationDialog.form.rank_name = rank_name;
        // this.$refs.informationDialog.form.c_remark = form.c_remark;
      }, 100);
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        if(info.i_id === 0) {
          this.$message({
            message: '此驾驶员职位为特殊职位，暂无法删除',
            type: 'warning'
          });
          return
        }
        params.context[0] = info.i_id
      }else{
        let isDelete = true;
        this.jobIds.forEach(item => {
          if(item === 0) {
            isDelete = false
          }
        });
        if(!isDelete) {
          this.$message({
            message: '此驾驶员职位为特殊职位，暂无法删除',
            type: 'warning'
          });

          isDelete = true
          return
        }
        params.context = this.jobIds
      }
      
      this.$client.deleteSysPositionInfo(params)
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
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        // let maxh = this.$el.offsetHeight;
        let maxh = this.$refs.centerBox.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 70;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.job-manage {
  width: 100%;
  height: 100%;
}
.job-manage-manage {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    flex: 0 0 18vw;
    margin: 0 5px 0 0;
    width: 18vw;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}

.job-manage-manage /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}
</style>
