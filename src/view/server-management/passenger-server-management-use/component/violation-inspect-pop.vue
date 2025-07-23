<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="1030px"
    fullscreen
    append-to-body
  >
    <div class="el-dialog-div" ref="maintenanceProjectManage">
      <el-card class="box-card left-box">
        <maintenance-project-tree
          ref="organizationTree"
          :organizationTreeHeight="organizationTreeHeight"
          :loading="organizationloading"
          :placeholder="'关键字'"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
          @refresh-tree="refreshTreeList"
          :isShowRefresh="false"
        ></maintenance-project-tree>
      </el-card>
      <el-card class="box-card center-box" ref="centerBox" v-if="!!curSelectedDepartment">
        <el-form :inline="true" size="mini">
          <el-form-item>
            <el-input v-model="form.c_name" placeholder="请输入故障项目名称" clearable>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="reqInspectProjectList"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="resetForm()" icon="el-icon-refresh-left"
              >重置</el-button
            >
          </el-form-item>
          <div class="show-flex-box-r" style="align-items: center; margin-bottom: 15px;flex-wrap: wrap;">
            <!-- <el-form-item label="已选项目："> -->
              <span style="white-space: nowrap;">已选项目：</span>
              <div v-if="selectedProjectList.length">
                <el-tag
                  v-for="(item,index) in selectedProjectList"
                  :key="index"
                  closable
                  :disable-transitions="false"
                  @close="deleteProject(item,index)">
                  {{item.c_name}}
                </el-tag>
              </div>
              
              <span v-else style="color:#909399">暂无选择</span>
              <!-- <el-select v-model="selectedProjectIds" multiple placeholder="请选择" style="width: 90%;" size="mini" disabled>
                <el-option
                  v-for="item in selectedProjectOptions"
                  :key="item.i_id"
                  :label="item.c_name"
                  :value="item.i_id">
                </el-option>
              </el-select>
              <i class="el-icon-circle-close"></i> -->

            <!-- </el-form-item> -->
          </div>
        </el-form>
        

        <tr-table
          ref="trTable"
          :selectionShow="true"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          @on-select-change-row="selectedUserList"
        >
          <template slot-scope="scope" slot="i_enable">
            <span>{{!!scope.data.i_enable? '是': '否'}}</span>
          </template>
        </tr-table>
        <el-pagination
          v-if="curSelectedDepartment && !curSelectedDepartment.type"
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="pageInfo.pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="pageInfo.pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="pageInfo.pageCount"
        ></el-pagination>
      </el-card>
    </div>
    <span class="show-flex-box-r show-flex-center" style="margin-top: 10px;">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="updatePlaybill()"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import maintenanceProjectTree from "@/view/safe-manage/violation-inspect-manage/component/maintenance-project-tree"
export default {
  components: {
    maintenanceProjectTree
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "违规检查奖罚",
    },
    curSelecedType: [String],
    dutyType:[String,Number]
  },
  mounted() {
    
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form:{
        c_name:''
      },
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength: 0,
      organizationTreeHeight:500,
      canRendererTableHeader: [
        {
          id: 1,
          label: "稽查项目名称",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "所属类别",
          prop: "main_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "奖罚标识",
          prop: "model_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "违规类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false
        },
        {
          id: 5,
          label: "奖罚金额（元）",
          prop: "c_fee",
          width: "180",
          align: "center",
          signIndex: 4,
          sortable: true
        },
        {
          id: 6,
          label: "加减分值",
          prop: "n_score",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: true
        },
        {
          id: 7,
          label: "详细说明",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false
        }
      ],
      data: [], //项目列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      loading: false,
      TableHeight: 500,
      curSelectedDepartment:null,
      selectedProjectOptions: [],
      selectedProjectIds:[],
      selectedProjectList:[],
      oldSelectedProjectList:[],
      oldSelectedProjectIds:[],
      tabsSelectMap: {},
      groupId: -1
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.loadOrganizationTree();
        this.$nextTick(() => {
          // alert(this.$refs.maintenanceProjectManage.offsetHeight)
          // let maxh = this.$el.offsetHeight;
          // this.organizationTreeHeight = maxh - 320;
          // let maxh = this.$el.offsetHeight;
          // if (!this.curSelectedDepartment.type) {
          //   this.organizationTreeHeight = maxh - 360;
          //   return;
          // }
          // this.organizationTreeHeight = maxh - 320;
          // this.organizationTreeHeight = this.$refs.maintenanceProjectManage.offsetHeight - 85;
        })
      }
    },

  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setHead(departmentInfo) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
          if (!departmentInfo.type) {
            this.TableHeight = maxh - 360;
            this.organizationTreeHeight = maxh - 300;
            return;
          }
          this.TableHeight = maxh - 320;
          this.organizationTreeHeight = maxh - 260;
        }, 60);
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client
        .getGroupRewardPunish()
        .then(res => {
          this.organizationloading = false;
          if (res.head.result == "200") {
            this.organizationTreeList = res.context;
            this.organizationTreeListLength = this.organizationTreeList.length;
            if(this.organizationTreeListLength){
              this.reqSelectOptions(this.organizationTreeList[0]);
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    // 刷新维修组织分类
    refreshTreeList() {
      this.loading = true;
      this.organizationloading = true;
      this.loadOrganizationTree();
    },
    selectDepartment(departmentInfo) {
      this.form.c_name = '';
      this.curSelectedDepartment = departmentInfo;
      this.reqInspectProjectList(); // 获取稽查项目列表

      this.setHead(departmentInfo)
      this.$nextTick(() => {
        // this.setToggleRowSelection(); //设置表格选中
      })
      // this.groupId = departmentInfo.i_id
    },

    resetForm() {
      this.form.c_name = '';
      this.reqInspectProjectList(); // 获取稽查项目列表
    },
    // 获取项目列表
    reqInspectProjectList() {
      this.oldSelectedProjectList = [...this.selectedProjectList];
      this.loading = true;
      let params = {
        group_id: this.curSelectedDepartment.i_id
      }
      if(this.form.c_name) {
        params.c_name = this.form.c_name
      }
      if (!this.curSelectedDepartment.type) {
        params.page_index = this.pageInfo.pageIndex;
        params.page_size = this.pageInfo.pageSize;
      }
      params = Object.assign({}, params, this.form);
      this.$client
        .getProItems(params)
        .then(res => {
          // console.log(JSON.stringify(res))
          if (res.head.result == "200") {
            this.data = res.context.list;
            // 总分类下需要分页
            if (!this.curSelectedDepartment.type) {
              this.pageInfo.pageCount = res.context.total;
            }
            setTimeout(() => {
              this.loading = false;
            }, 800);
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        })
        .catch(err => {});
    },
    // trySelect() {
    //   let selectRows = []
    //   this.data.forEach(item => {
    //     if (this.selectedProjectIds.indexOf(item.i_id) > -1) {
    //       selectRows.push(item)
    //     }
    //   })
    //   this.tabsSelectMap[this.groupId] = selectRows
    // },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.oldSelectedProjectList = [...this.selectedProjectList];
      this.pageInfo.pageIndex = idx;
      this.reqInspectProjectList(true);
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.oldSelectedProjectList = [...this.selectedProjectList];
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqInspectProjectList(true);
    },
    // 获取全部的项目
    reqSelectOptions(info) {
      if(!info.type) {
        let params = {
          group_id: info.i_id,
          enable: 1  // 只获取启用的项目
        };
        this.$client.getProItems(params)
        .then(res => {
          // console.log(JSON.stringify(res))
          if (res.head.result == "200") {
            this.loading = false;
            this.selectedProjectOptions = res.context.list;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        })
        .catch(err => {});
      }
    },

    // 选中表格勾选框
    selectedUserList(projectList) {
        this.selectedProjectList = projectList;
        this.selectedProjectList.forEach((element,elIndex) => {
          this.oldSelectedProjectList.forEach((item,index) => {
            if(element.i_id == item.i_id) {
              this.oldSelectedProjectList.splice(index,1)
            }
          });
        });
        this.selectedProjectList = [...this.selectedProjectList,...this.oldSelectedProjectList]
      // this.trySelect()
    },
    deleteProject(item,index){
      this.selectedProjectList.splice(index,1)
      this.oldSelectedProjectList.forEach((el,elIndex) => {
        if(el.i_id == item.i_id) {
          this.oldSelectedProjectList.splice(elIndex,1)
        }
      });
      // this.setToggleRowSelection();
    },
    // 设置表格选中
    setToggleRowSelection() {
      this.oldSelectedProjectList.forEach(element => {
        this.data && this.data.forEach((item,index) => {
          if(element.i_id == item.i_id) {
            console.log(item)
            this.$refs.trTable.$refs.table.toggleRowSelection(item);
          }
        });
      });
    },
    updatePlaybill(formName) {
      // let isHaveAward = false
      // let isHavepunishment = false
      // if(this.dutyType === 1) {
      //   this.selectedProjectList.forEach(element => {
      //     if(Number(element.n_score) >= 0) {
      //       isHaveAward = true
      //     }
      //   });
      // }
      // if(isHaveAward) {
      //   this.$message({
      //     showClose: true,
      //     message: '有责，不能选择奖励',
      //     type: 'warning'
      //   });
      //   return
      // }

      // this.selectedProjectList.forEach(element => {
      //   if(Number(element.n_score) < 0) {
      //     isHavepunishment = true
      //   }else{
      //     isHaveAward = true
      //   }
      // });

      // if(isHavepunishment && isHavepunishment) {
      //   this.$message({
      //     showClose: true,
      //     message: '处罚和奖励不能同时选择',
      //     type: 'warning'
      //   });
      //   return
      // }



      this.selectedProjectList.forEach(item => {

        this.selectedProjectIds.push(item.i_id)
      })
      this.$emit("save-add", this.selectedProjectIds, this.selectedProjectList);
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog-div-content {
//   height: 450px;
//   // overflow-y: scroll;
// }
.el-dialog-div {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    // overflow: auto;
  }

  .left-box {
    flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 23vw;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}

.el-dialog-div /deep/ .el-tag + .el-tag {
  margin-left: 10px;
}

</style>

