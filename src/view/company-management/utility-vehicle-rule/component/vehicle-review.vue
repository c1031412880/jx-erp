<template>
  <div class="vehicle-review">
    <div ref="header" style="display:flex;align-items:center;margin-bottom:15px">
      <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
      <p style="margin-left:25px;color:#000;font-size:16px;">年检</p>
      <el-button type="primary" style="margin-left:80px" size="medium" @click="add">添加规则</el-button>
    </div>
    <tr-table
      :data="data"
      :tableHeaderList="customSettingList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
    > 
      <template slot-scope="scope" slot="abbreviation_person">
        <el-tooltip class="item" effect="dark" :content="scope.data.person_names" placement="top">
          <span>{{scope.data.abbreviation_person}}</span>
        </el-tooltip>
      </template>
      <template slot-scope="scope" slot="enable">
        <el-switch v-model="scope.data.enable" :active-value="1" :inactive-value="0" active-color="#13ce66" @change="changeSwitch(scope.data.id,scope.data.enable)"></el-switch>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editRowInfo(scope.data)">编辑</el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" :disabled="scope.data.enable == 1" >删除</el-button>
        </el-popconfirm>
      </template>
    </tr-table>

    <review-rule-dialog
      ref="reviewRuleDialog"
      :dialogBool.sync="ruleDialog"
      :title="informationDialogTitle"
      :curSelecedType="curSelecedType"
      @on-ok="submit"
    ></review-rule-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import reviewRuleDialog from '../rule-dialog/review-rule-dialog'
export default {
  name: "vehicle-review",
  components: {reviewRuleDialog},
  props: {
    TableHeight: [Number],
  },
  data() {
    return {
      loading: false,
      ruleDialog: false,
      informationDialogTitle: '添加',
      curSelecedType: 'add',
      data: [],
      customSettingList:[
         {
          id: 1,
          label: "规则名称",
          prop: "rule_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "年检条件",
          prop: "condition_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "年检周期",
          prop: "interval_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "提醒人员",
          prop: "abbreviation_person",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "提前提醒天数",
          prop: "warn_day",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "提醒方式",
          prop: "warn_type_name",
          width: "100",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "提醒内容",
          prop: "warn_content",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "启用状态",
          prop: "enable",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData()
    });
  },
  methods: {
    // 删除
    deleteRowInfo(row) {
      this.$client.DeleteBusMsgYear({context:[row.id]}).then(res =>{
        if (res.head.result == "200") {
            this.loadData()
            this.$message({
              showClose: true,
              message: res.head.describle,
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
    // 新增
    add() {
      this.curSelecedType = "add"
      this.informationDialogTitle = '添加'
      this.ruleDialog = true
    },
    // 编辑
    editRowInfo(row) {
      this.curSelecedType = "edit"
      this.informationDialogTitle = '编辑'
      this.ruleDialog = true
      setTimeout(() => {
        this.$refs['reviewRuleDialog'].setData(row)
      }, 200);
    },
    // 启用、禁用
    changeSwitch(id,enable) {
      let params = {
        id: id,
        enable: enable
      }
      this.$client.EnableBusMsgYear({context:params}).then(res =>{
        if (res.head.result == "200") {
            this.loadData()
            this.$message({
              showClose: true,
              message: res.head.describle,
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
    // 保存
    submit(form,type) {
      if (type == "add") {
        this.$client.CreateBusMsgYear({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.ruleDialog = false
            this.loadData()
            this.$message({
              showClose: true,
              message: res.head.describle,
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
      } else {
        this.$client.UpdateBusMsgYear({context:form}).then(res =>{
          console.log('res',res);
          if (res.head.result == "200") {
            this.ruleDialog = false
            this.loadData()
            this.$message({
              showClose: true,
              message: res.head.describle,
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
      }
    },
    // 数据加载
    loadData() {
      this.loading = true;
      this.$client.GetBusMsgYearList()
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
            this.data.forEach(item =>{
              let names = item.person_names.split("、")
              if (names.length > 3) {
                item.abbreviation_person = `${names[0]}、${names[1]}等${names.length}人`
              }else {
                item.abbreviation_person = item.person_names
              }
            })
            console.log('data',JSON.parse(JSON.stringify(this.data)));
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
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.vehicle-review {
  width: 100%;
  height: 100%;
}
</style>