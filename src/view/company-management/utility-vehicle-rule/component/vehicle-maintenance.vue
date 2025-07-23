<template>
  <div class="vehicle-maintenance">
    <div style="display:flex;align-items:center;margin-bottom:15px">
      <div style="float:left;width: 6px;height: 18px; background: #409EFF;"></div>
      <p style="margin-left:25px;color:#000;font-size:16px;">保养设置</p>
      <el-button type="primary" style="margin-left:80px" size="medium" @click="add(1)">添加一保规则</el-button>
      <el-button type="primary" style="margin-left:20px" size="medium" @click="add(2)">添加二保规则</el-button>
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

    <maintenance-rule-dialog
      ref="maintenanceRuleDialog"
      :type="type"
      :dialogBool.sync="ruleDialog"
      :title="informationDialogTitle"
      :curSelecedType="curSelecedType"
      @on-ok="submit"
    ></maintenance-rule-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import maintenanceRuleDialog from '../rule-dialog/maintenance-rule-dialog'
export default {
  components: {maintenanceRuleDialog},
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
      type: 1,
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
          label: "保养条件",
          prop: "condition_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "保养周期",
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
          label: "提前提醒天数或公里",
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
      this.$client.DeleteBusMsgMaintain({context:[row.id]}).then(res =>{
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
    add(val) {
      this.type = val
      let name = val == 1 ? "一保" : "二保"
      this.curSelecedType = "add"
      this.informationDialogTitle = '添加' + name
      this.ruleDialog = true
    },
    // 编辑
    editRowInfo(row) {
      this.type = row.type
      this.curSelecedType = "edit"
      let name = row.type == 1 ? "一保" : "二保"
      this.informationDialogTitle = '编辑' + name
      this.ruleDialog = true
      setTimeout(() => {
        this.$refs['maintenanceRuleDialog'].setData(row)
      }, 200);
    },
    // 启用、禁用
    changeSwitch(id,enable) {
      let params = {
        id: id,
        enable: enable
      }
      this.$client.EnableBusMsgMaintain({context:params}).then(res =>{
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
        this.$client.CreateBusMsgMaintain({context:form}).then(res =>{
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
        this.$client.UpdateBusMsgMaintain({context:form}).then(res =>{
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
      this.$client.GetBusMsgMaintainList()
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
