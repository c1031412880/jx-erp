<template>
  <el-dialog
    :visible="dialogBool"
    title="提醒规则设置"
    :before-close="dialogClose"
    top="20px"
    width="960px">
    <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
    <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">提醒规则信息</p>
    <el-form 
      ref="form" 
      :model="form" 
      :rules="basicRules" 
      label-width="100px"
      size="mini">
      <el-row>
        <el-col :span="24">
          <el-button size="mini" type="primary" @click="saveReminderInfo">保存</el-button>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提醒方式：" prop="remind_type">
            <el-checkbox-group v-model="form.remind_type">
              <el-checkbox :label="1" >系统推送</el-checkbox>
              <el-checkbox :label="2">app推送</el-checkbox>
              <el-checkbox :label="3">短信通知</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="提前提醒：" prop="remind_before_day">
            <p>预计完结日期前
              <el-input-number style="width: 60px" v-model="form.remind_before_day" :min="0" label="描述文字" :precision="0" :controls="false"></el-input-number>
              天开始提醒。
            </p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="提醒周期：" prop="remind_rat">
            <p>每次间隔
              <el-input-number style="width: 60px" v-model="form.remind_rat" :min="0" label="描述文字" :precision="0" :controls="false"></el-input-number>
              天，提醒一次，提醒时间
              <el-time-select
                v-model="form.remind_date"
                style="width: 100px;"
                :picker-options="{
                  start: '06:00',
                  step: '00:15',
                  end: '19:00'
                }"
                placeholder="请选择时间">
              </el-time-select>
            </p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="合同管理员:" prop="name">
            <get-department-select-tree
              ref="personalTree2"
              v-model="form.remind_user"
              :isShowCheckbox="true"
              :placeholder="'请选择合同管理员'"
              :isContainEmp="true"
              :isExportMultiple="true"
              :isCheckStrictly="false"
            ></get-department-select-tree>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="float:left;width: 6px;height: 16px; background: #409EFF;"></div>
    <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;">提醒人员信息</p>
    <el-button size="mini" type="primary" @click="openAddInfo">添加</el-button>
    <tr-table
      ref="trTable"
      :data="data"
      :TableHeight="460"
      :loading="loading"
      :tableHeaderList="canRendererTableHeader">
      <template slot-scope="scope" slot="is_remind">
        <span>{{ scope.data.is_remind ? '是' : '否' }}</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button size="mini" type="primary" @click="editReminderUser(scope.data)">编辑</el-button>
        <el-button size="mini" type="danger" @click="delReminderUser(scope.data)">删除</el-button>
      </template>
    </tr-table>
    <span slot="footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
    </span>

    <set-info-dialog
      ref="setInfoDialog"
      :dialogBool.sync="setInfoDialog"
      @save-add-edit="updatePlaybill"
    ></set-info-dialog>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import setInfoDialog from "./set-info-dialog";
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    setInfoDialog,
    getDepartmentSelectTree
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        id: 0,
        remind_type: [],
        remind_before_day: 0,
        remind_rat: 0,
        remind_date: '',
        dept_id: -1,
        remind_user: [],
      },
      basicRules: {},
      userListMap: {}, //组织人员映射
      data: [], //项目列表
      loading: false,
      setInfoDialog: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "部门名称",
          prop: "dept_names",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "提醒人员",
          prop: "person_names",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "是否提醒导入人",
          prop: "is_remind",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "80",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else {
        this.GetReminderList()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取列表
    GetReminderList() {
      this.$client.GetRulesErpContractRemind()
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.filter(item => {
            return item.dept_id != -1
          })
          let info = res.context.filter(item => {
            return item.dept_id == -1
          })
          
          
          if(info && info.length > 0) {
            this.form = Object.assign({},this.form, info[0])
          }
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
    },
    // 保存规则
    saveReminderInfo() {
      let info = {context: {}}
      info.context = Object.assign({}, this.form);
      this.updatePlaybill(info)
    },
    // 添加提醒人员
    openAddInfo() {
      this.setInfoDialog = true
    },
    // 编辑提醒人员
    editReminderUser(row) {
      this.setInfoDialog = true
      setTimeout(() => {
        this.$refs.setInfoDialog.setData(row)
      }, 30);
    },
    // 删除提醒人员
    delReminderUser(row) {
      let params = { context: row.id}
      this.$client.DeleteRuleErpContractRemind(params)
        .then(res => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: "success"
            });
            this.GetReminderList()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            })
          }
        })
    },
    // 保存 
    updatePlaybill(params) {
      this.$client.UpdateRuleErpContractRemind(params)
        .then(res => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: "success"
            });
            this.setInfoDialog = false
            this.GetReminderList()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error"
            });
          }
        }).catch(err => {console.log(err);})
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  width: 100%;
  height: 100%;
}

</style>

