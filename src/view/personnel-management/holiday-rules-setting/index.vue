<template>
  <div class="holiday-rules-setting">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 28px">假期规则</span>
        <el-button style="float: right;" class="el-icon-plus" type="primary" size="mini" @click="editRowInfo(null,'add')">添加</el-button>
      </div>
      <tr-table
        :selectionShow="false"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      >
        <template slot-scope="scope" slot="min_unit">
          <span>{{scope.data.min_unit === 1? '小时':scope.data.min_unit === 2?'半天':scope.data.min_unit === 3?'天':'--'}}</span>
        </template>
        <template slot-scope="scope" slot="time_calculate">
          <span>{{scope.data.time_calculate === 1? '按工作日计算':scope.data.time_calculate === 2?'按自然日计算':'--'}}</span>
        </template>
        <template slot-scope="scope" slot="add_rule">
          <span>{{scope.data.add_rule === 1? '固定额度发放':scope.data.add_rule === 2? scope.data.add_time == 1?'每年1月1日自动发放，按司龄配额':'每年的入职日自动发放，按司龄配额':'--'}}</span>
        </template>
        <template slot-scope="scope" slot="dept_id">
          <span>{{scope.data.dept_id === 0? '全公司':'部分部门'}}</span>
        </template>
        <template slot-scope="scope" slot="state">
          <el-switch
            :value="scope.data.state === 1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.data)"
            >
          </el-switch>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </tr-table>

    </el-card>

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
import informationDialog from "./component/information-dialog";
export default {
  name: "holiday-rules-setting",
  components: {
    informationDialog,
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "假期名称",
          prop: "name",
          width: "150",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "请假单位",
          prop: "min_unit",
          width: "100",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "计算请假时长方式",
          prop: "time_calculate",
          width: "180",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "余额规则",
          prop: "add_rule",
          width: "250",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "适用范围",
          prop: "dept_id",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "启用/禁用",
          prop: "state",
          width: "90",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead();
    });
  },
  methods: {

    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({context:{}}, this.form);
      this.$client.GetByPageLeaveRule(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
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
    // 编辑、添加
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      if(this.curSelecedType == 'add') {
        this.$client.AddLeaveRule(parmas)
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
      }else{
        this.$client.UpdateLeaveRule(parmas)
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
      }
      
      
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
    editRowInfo(form,type) {
      this.curSelecedType = type;
      if(!!form) {
        this.$refs.informationDialog.setData(form);
      }
      this.informationDialogTitle = `${type == 'add'? '假期规则':'编辑假期规则'}`;
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: info.id
      };
      
      this.$client.DelteLeaveRule(params)
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
      })
    },
    // 启用、禁用
    changeState(info) {
      let params = {
        context: {
          id: info.id,
          state: info.state == 1? 2: 1
        }
      };
      this.$client.UpdateStateLeaveRule(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: `${info.state ==1?'禁用成功':'启用成功'}`,
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
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        // let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - 30- 70;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.holiday-rules-setting {
  width: 100%;
  height: 100%;
}
.holiday-rules-setting /deep/ .el-card__header{
  background: #F9F9F9F9;
}
</style>
