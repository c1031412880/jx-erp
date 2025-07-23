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
        报废提醒
      </p>
      <el-button type="primary" size="mini" @click="openAddScrapRuleSettingPop('add')" v-if="$isPowerShow('add')"
        >添加规则</el-button
      >
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
        <el-table-column fixed prop="c_rules_name" label="规则名称" min-width="120">
        </el-table-column>
        <el-table-column prop="name" label="报废条件" min-width="120">
          <template slot-scope="scope">{{
            showAgeCondition(
              scope.row.i_age_condition_min,
              scope.row.i_age_condition_max
            )
          }}</template>
        </el-table-column>
        <el-table-column
          prop="person_names"
          label="提醒人员"
          show-overflow-tooltip
          min-width="120"
        >
          <!-- <template slot-scope="scope">
            <span v-if="!!scope.row.reminders && scope.row.reminders.length > 0"> {{
              showReminders(scope.row.reminders)
            }}</span>
            <span v-else style="color: #409EFF; cursor: pointer;" @click="openAddScrapRuleSettingPop('edit', scope.row)">设置提醒人员</span>
          </template> -->
        </el-table-column>
        <el-table-column prop="i_warn_days" label="提前提醒天数" min-width="160">
        </el-table-column>
        <el-table-column prop="c_warn_way" label="提醒方式" min-width="120">
          <template slot-scope="scope">
            <span v-if="scope.row.c_warn_way.length > 0">
              {{showTypeWarnWay(scope.row.c_warn_way)}}
            </span>
            <span v-else>--</span>
            
          </template>
        </el-table-column>
        <el-table-column
          prop="c_warn_content"
          label="提醒内容"
          show-overflow-tooltip
          min-width="180"
        >
        </el-table-column>
        <el-table-column prop="date" label="启用状态" min-width="90">
          <template slot-scope="scope">
            <div>
              <el-switch
                v-model="scope.row.i_valid? true:false"
                active-color="#409EFF"
                inactive-color="#ff4949"
                @change="activeMaintDiscardRule(scope.row)"
                :disabled="!$isPowerShow('edit')"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="name" label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="openAddScrapRuleSettingPop('edit', scope.row)" v-if="$isPowerShow('edit')"
              >编辑</el-button
            >
            <el-popconfirm
              v-if="$isPowerShow('del')"
              @confirm="deleteMaintDiscardRule(scope.row)"
              title="确定删除此报废提醒吗？">
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <vehicle-maintenance-dialog
      ref="maintDiscard"
      :dialogBool.sync="isShowScrapRuleSettingDialog"
      :curType="curSettingType"
      @save-add-edit-maintdiscard="saveAddEditMaintdiscard"
    >
    </vehicle-maintenance-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import vehicleMaintenanceDialog from "./vehicle-maintenance-dialog";
export default {
  components: {
    vehicleMaintenanceDialog
  },
  props: {
    TableHeight: [Number],
  },
  data() {
    return {
      data: [],
      loading: false,
      isShowScrapRuleSettingDialog: false,
      curSettingType: 'add'
    };
  },
  mounted() {
    this.loadMaintDiscardData()
  },
  methods: {
    showAgeCondition(minAge, maxAge) {
      let showText = `${minAge} < 车龄 <= ${maxAge} `;
      return showText;
    },
    showReminders(reminderLsit) {
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
    // 获取报废规则列表
    loadMaintDiscardData() {
      this.loading = true;
      // let parmas = this.form;
      this.$client
        .getMaintDiscardList()
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
     
    // 打开报废提醒设置弹窗
    openAddScrapRuleSettingPop(type,rowInfo) {
      this.curSettingType = type;
      this.isShowScrapRuleSettingDialog = true;
      if(this.curSettingType == 'edit') {
        // // alert(JSON.stringify(rowInfo))
        // this.$refs.maintDiscard.ruleForm.i_id = rowInfo.i_id;
        // this.$refs.maintDiscard.ruleForm.c_rules_name =
        //   rowInfo.c_rules_name;
        // this.$refs.maintDiscard.ruleForm.i_age_condition_min =
        //   rowInfo.i_age_condition_min;
        // this.$refs.maintDiscard.ruleForm.i_age_condition_max =
        //   rowInfo.i_age_condition_max;
        // this.$refs.maintDiscard.ruleForm.reminders = rowInfo.reminders;
        // this.$refs.maintDiscard.ruleForm.i_warn_days = rowInfo.i_warn_days;
        // this.$refs.maintDiscard.ruleForm.i_warn_way = rowInfo.i_warn_way;
        // this.$refs.maintDiscard.ruleForm.i_valid = rowInfo.i_valid;
        // this.$refs.maintDiscard.i_valid = !!rowInfo.i_valid? true: false;
        // this.$refs.maintDiscard.remindType = rowInfo.c_warn_way;

        this.$nextTick(() => {
          this.$refs.maintDiscard.setData(rowInfo)
        })
      }
    },
    // 编辑保存 报废规则
    saveAddEditMaintdiscard(maintainForm) {
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
        .addMaintDiscardRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadMaintDiscardData();
            this.isShowScrapRuleSettingDialog = false;
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

    // 删除报废规则
    deleteMaintDiscardRule(rowInfo) {
      let parmas = {
        context: [],
      };
      parmas.context[0] = rowInfo.i_id;
      console.log(parmas);
      this.$client
        .deleteMaintDiscardRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadMaintDiscardData();
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
    // 启用/禁用报废设置
    activeMaintDiscardRule(rowInfo) {
      let parmas = {
        id: rowInfo.i_id,
        enable: !!rowInfo.i_valid ? "0" : "1",
      };
      console.log(parmas);
      this.$client
        .annualMaintDiscardEnabRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadMaintDiscardData();
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
