<template>
  <div class="salary-project-library">
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
    >
      <template slot-scope="scope" slot="state">
        <div v-if="scope.data.is_default"></div>
        <el-switch
          v-else
          v-model="scope.data.state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeState(scope.data.id)"
        ></el-switch>
      </template>
    </tr-table>
    <div class="organization-project-dialog">
      <add-project-dialog
         ref="addProjectDialog"
        :dialogBool.sync="isShowAddProjectDialog"
        :curType="curSelecedType"
        @add-organization="addOrgProjectInfo"
      ></add-project-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import addProjectDialog from "./component/add-project-dialog"
export default {
  name: "salary-project-library",
  components: {
    subReq,
    addProjectDialog,
  },
  data() {
    return {
      data:[], //列表
      canRendererTableHeader: [
        {
          id: 1,
          label: "项目名称",
          prop: "item_name",
          width: "300",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "是否禁用",
          prop: "state",
          width: "100",
          align: "center",
          signIndex: 1,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据

      isShowAddProjectDialog: false,
      curSelecedType: 'add', //添加
    };
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.loadData();
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    loadData() {
      this.loading = true;
      let params = Object.assign({},params,this.form)
      this.$client.GetCheckTemplateTrees(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context
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
    // 添加
    openAddPage() {
      this.isShowAddProjectDialog = true
    },
    // 启用禁用 
    changeState(id) {
      this.$client.UpdateStatePaySlipItem({context:id})
      .then(res => {
        if (res.head.result == "200") {
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
    addOrgProjectInfo(form) {
      this.$client.AddOrUpdatePaySlip({context:form})
      .then(res => {
        if (res.head.result == "200") {
          this.isShowAddProjectDialog = false
          this.loadData()
          this.$message({
            showClose: true,
            message: '新增成功',
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
    },
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - 85 -th;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.salary-project-library{
  width: 100%;
  height: 100%;
}
</style>
