<template>
  <div class="annual-inspection">
    <div class="annual-inspection-title show-flex-box-r">
      <div style="width: 6px; height: 20px; background: #409eff"></div>
      <p
        style="
          margin: 0px 30px 0px 15px;
          color: #666666;
          font-size: 17px;
          font-weight: bold;
        "
      >
        保养设置
      </p>
      <el-button type="primary" size="mini" @click="addFristMantainRulePop('add')" v-if="$isPowerShow('add')">添加一保规则</el-button>
      <el-button type="primary" size="mini" @click="addSecondMantainRulePop('add')" v-if="$isPowerShow('add')">添加二保规则</el-button>
    </div>
    <div class="rule-table">
      <el-table
        :data="data"
        style="width: 100%"
        empty-text="暂无数据"
        fit
        v-loading="loading"
        :height="TableHeight"
        :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
        :cell-style="{fontSize: '13px', padding: '4px 0px'}"
        :default-sort="{ prop: 'id', order: 'descending' }"
        >>
        <el-table-column prop="c_rules_name" label="规则名称" min-width="120" fixed>
        </el-table-column>
        <el-table-column fixed prop="c_rules_name" label="保养类型" min-width="120">
           <template slot-scope="scope">{{scope.row.c_rules_type == '1'?'一保':'二保'}}</template>
        </el-table-column>
        <el-table-column prop="i_condition_type" label="保养条件" min-width="120">
          <template slot-scope="scope">{{scope.row.i_condition_type == '1'?'最近保养日期':'累计行驶里程'}}</template>
        </el-table-column>
        <el-table-column prop="name" label="保养频率" min-width="120">
          <template slot-scope="scope">
             <span v-if="!!scope.row.i_condition_month">{{showTypeCondition(scope.row.i_condition_month)}}</span>
             <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="保养里程" min-width="120">
          <template slot-scope="scope">
            <span v-if="!!scope.row.i_condition_mile">{{scope.row.i_condition_mile}}公里</span>
            <span v-else>--</span>   
          </template>
        </el-table-column>
        <el-table-column prop="person_names" label="提醒人员" show-overflow-tooltip min-width="120">
          <!-- <template slot-scope="scope">
            <span v-if="!!scope.row.reminders && scope.row.reminders.length > 0"> {{
              showReminders(scope.row.reminders)
            }}</span>
            <span v-else style="color: #409EFF; cursor: pointer;" @click="handleEdit(scope.row)">设置提醒人员</span>
          </template> -->
        </el-table-column>
        <el-table-column  label="提前提醒天数或公里" min-width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.i_condition_type == '1'">
              <span v-if="scope.row.i_warn_days"> {{scope.row.i_warn_days}}天</span>
              <span v-if="scope.row.i_warn_miles">{{scope.row.i_warn_miles}}公里</span>
            </div>
            <span v-else>{{scope.row.i_warn_miles}}公里</span>
          </template>
        </el-table-column>
        <el-table-column prop="c_warn_way" label="提醒方式" min-width="120">
           <template slot-scope="scope">
            <span v-if="!!scope.row.c_warn_way &&　scope.row.c_warn_way.length > 0">
              {{showTypeWarnWay(scope.row.c_warn_way)}}
            </span>
            <span v-else>--</span>
            
          </template>
        </el-table-column>
        <el-table-column prop="c_warn_content" label="提醒内容" show-overflow-tooltip min-width="180">
        </el-table-column>
        <el-table-column prop="i_valid" label="启用状态" min-width="90">
          <template slot-scope="scope">
            <div>
              <el-switch
                v-model="scope.row.i_valid? true:false"
                active-color="#409EFF"
                inactive-color="#ff4949"
                @change="activeMaintainRule(scope.row)"
                :disabled="!$isPowerShow('edit')"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="name" label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" v-if="$isPowerShow('edit')"
              >编辑</el-button
            >
            <el-popconfirm
              v-if="$isPowerShow('del')"
              @confirm="deleteMaintainRule(scope.row)"
              title="确定删除此保养提醒吗？">
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <frist-maintain-dialog
      ref="fristMaintain"
      :dialogBool.sync="isShowFristMaintainDialog"
      :curType="curSettingType"
      @save-add-edit-maintain="saveAddEditMaintain"
    ></frist-maintain-dialog>
    <second-maintain-dialog
      ref="secondMaintain"
      :dialogBool.sync="isShowSecondMaintainDialog"
      :curType="curSettingType"
      @save-add-edit-maintain="saveAddEditMaintain"
    ></second-maintain-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import fristMaintainDialog from "./frist-maintain-dialog";
import secondMaintainDialog from "./second-maintain-dialog";
export default {
  components: {
    fristMaintainDialog,
    secondMaintainDialog
  },
  props: {
    TableHeight: [Number],
  },
  data() {
    return {
      visible: false,
      data: [],
      loading: false,
      isShowFristMaintainDialog: false,
      isShowSecondMaintainDialog: false,
      curSettingType: "add",
    };
  },
  mounted() {
    this.loadMaintainData();
  },
  methods: {
    // 修改回调
    handleEdit(row) {
      if(row.c_rules_type == '1') {
        this.addFristMantainRulePop('edit',row)
      }else{
        this.addSecondMantainRulePop('edit',row)
      }
    },

    showTypeCondition(type) {
      let showContent = '';
      switch (type) {
        case 1:
          showContent = '每月一次'
          break;
        case 3:
          showContent = '三月一次'
          break;
        case 6:
          showContent = '半年一次'
          break;
        case 12:
          showContent = '一年一次'
          break;
      
        default:
          break;
      }

      return showContent
    },

    showReminders(reminderLsit) {
      console.log(reminderLsit)
      let showText = '';
      if(reminderLsit.length == 1) {
        showText = reminderLsit[0].c_name 
      }else if(reminderLsit.length == 2) {
        showText = reminderLsit[0].c_name + ',' + reminderLsit[1].c_name
      } else if(reminderLsit.length > 2) {
        showText = reminderLsit[0].c_name + ',' + reminderLsit[1].c_name + '等' + reminderLsit.length + '人';
      }
      return showText
    },

    showTypeWarnWay(warnWayLsit) {
      let showText = '';
      warnWayLsit.forEach(element => {
        showText += element + '、'
      });

      return showText
    },

    // 获取保养规则列表
    loadMaintainData() {
      this.loading = true;
      // let parmas = this.form;
      this.$client
        .getMaintainList()
        .then((res) => {
          // console.log(JSON.stringify(res));
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
        })
        .catch((err) => {
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 编辑保存 保养规则
    saveAddEditMaintain(maintainForm) {
      //  alert(JSON.stringify(maintainForm))
      let successrMessage = "";
      let parmas = {
        context: maintainForm,
      };
      if (this.curSettingType == "add") {
        delete parmas.context.i_id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }

      this.$client
        .addMaintainRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadMaintainData();
            if (maintainForm.c_rules_type == "1") {
              this.isShowFristMaintainDialog = false;
            } else {
              this.isShowSecondMaintainDialog = false;
            }
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
    // 启用/禁用保养设置
    activeMaintainRule(rowInfo) {
      let parmas = {
        id: rowInfo.i_id,
        enable: !!rowInfo.i_valid ? "0" : "1",
      };
      this.$client
        .annualMaintainEnabRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadMaintainData();
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
    // 删除保养规则
    deleteMaintainRule(rowInfo) {
      let parmas = {
        context: [],
      };
      parmas.context[0] = rowInfo.i_id;
      this.$client
        .deleteMaintainRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadMaintainData();
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
    // 打开一保添加编辑设置弹窗
    addFristMantainRulePop(type, rowInfo) {
      this.curSettingType = type;
      // if (this.curSettingType == "edit") {
      //   // alert(JSON.stringify(rowInfo))
      //   this.$refs.fristMaintain.ruleForm.i_id = rowInfo.i_id;
      //   this.$refs.fristMaintain.ruleForm.c_rules_type = rowInfo.c_rules_type;
      //   this.$refs.fristMaintain.ruleForm.c_rules_name = rowInfo.c_rules_name;
      //   this.$refs.fristMaintain.ruleForm.i_condition_type = String(
      //     rowInfo.i_condition_type
      //   );
      //   this.$refs.fristMaintain.ruleForm.i_condition_month = String(
      //     rowInfo.i_condition_month
      //   );
      //   this.$refs.fristMaintain.ruleForm.i_condition_mile =
      //     rowInfo.i_condition_mile;
      //   this.$refs.fristMaintain.ruleForm.reminders = rowInfo.reminders;
      //   this.$refs.fristMaintain.ruleForm.i_warn_days = rowInfo.i_warn_days;
      //   this.$refs.fristMaintain.ruleForm.i_warn_miles = rowInfo.i_warn_miles;
      //   this.$refs.fristMaintain.ruleForm.i_gen_play_day =
      //     rowInfo.i_gen_play_day;
      //   this.$refs.fristMaintain.ruleForm.i_warn_way = rowInfo.i_warn_way;
      //   this.$refs.fristMaintain.ruleForm.i_valid = rowInfo.i_valid;
      //   this.$refs.fristMaintain.i_valid = !!rowInfo.i_valid? true: false;
      //   this.$refs.fristMaintain.ruleForm.i_auto_flow = rowInfo.i_auto_flow;
      //   this.$refs.fristMaintain.i_auto_flow = !!rowInfo.i_auto_flow? true: false;
      //   this.$refs.fristMaintain.remindType = rowInfo.c_warn_way;
      // }
      this.isShowFristMaintainDialog = true;
      if (this.curSettingType == "edit") {
        this.$nextTick(() => {
          this.$refs.fristMaintain.setData(rowInfo)
        })
      }
    },

    // 打开二保添加编辑设置弹窗
    addSecondMantainRulePop(type,rowInfo) {
      this.curSettingType = type;
      // if (this.curSettingType == "edit") {
      //   // alert(JSON.stringify(rowInfo))
      //   this.$refs.secondMaintain.ruleForm.i_id = rowInfo.i_id;
      //   this.$refs.secondMaintain.ruleForm.c_rules_type = rowInfo.c_rules_type;
      //   this.$refs.secondMaintain.ruleForm.c_rules_name = rowInfo.c_rules_name;
      //   this.$refs.secondMaintain.ruleForm.i_age_condition_min = rowInfo.i_age_condition_min;
      //   this.$refs.secondMaintain.ruleForm.i_age_condition_max = rowInfo.i_age_condition_max;
      //   this.$refs.secondMaintain.ruleForm.i_condition_mile = rowInfo.i_condition_mile;
      //   this.$refs.secondMaintain.ruleForm.i_condition_month = rowInfo.i_condition_month;
      //   this.$refs.secondMaintain.ruleForm.i_warn_miles = rowInfo.i_warn_miles;
      //   this.$refs.secondMaintain.ruleForm.reminders = rowInfo.reminders;
      //   this.$refs.secondMaintain.ruleForm.i_warn_miles = rowInfo.i_warn_miles;
      //   this.$refs.secondMaintain.ruleForm.i_gen_play_day = rowInfo.i_gen_play_day;
      //   this.$refs.secondMaintain.ruleForm.i_warn_way = rowInfo.i_warn_way;
      //   this.$refs.secondMaintain.ruleForm.i_valid = rowInfo.i_valid;
      //   this.$refs.secondMaintain.i_valid = !!rowInfo.i_valid? true: false;
      //   this.$refs.secondMaintain.ruleForm.i_auto_flow = rowInfo.i_auto_flow;
      //   this.$refs.secondMaintain.i_auto_flow = !!rowInfo.i_auto_flow? true: false;
      //   this.$refs.secondMaintain.remindType = rowInfo.c_warn_way;
      // }
      this.isShowSecondMaintainDialog = true;
      if (this.curSettingType == "edit") {
        this.$nextTick(() => {
          this.$refs.secondMaintain.setData(rowInfo)
        })
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.annual-inspection {
  padding: 20px;

  .annual-inspection-title {
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
