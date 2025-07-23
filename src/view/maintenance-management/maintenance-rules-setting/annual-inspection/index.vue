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
        年检
      </p>
      <el-button type="primary" size="mini" @click="openAddRuleSettingPop('add')" v-if="$isPowerShow('add')">添加规则</el-button>
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
        <el-table-column prop="name" label="年检条件" min-width="120">
          <template slot-scope="scope">{{
              showAgeCondition(scope.row.i_age_condition_min, scope.row.i_age_condition_max,)
            }}</template>
        </el-table-column>
        <el-table-column prop="name" label="年检频率" min-width="120">
          <template slot-scope="scope">{{
              showTypeCondition(scope.row.i_condition_type)
            }}</template>
        </el-table-column>
        <el-table-column prop="person_names" label="提醒人员" show-overflow-tooltip min-width="120">
          <!-- <template slot-scope="scope">
            <span v-if="!!scope.row.reminders && scope.row.reminders.length > 0"> {{
              showReminders(scope.row.reminders)
            }}</span>
            <span v-else style="color: #409EFF; cursor: pointer;" @click="openAddRuleSettingPop('edit', scope.row)">设置提醒人员</span>
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
        <el-table-column prop="c_warn_content" label="提醒内容" show-overflow-tooltip min-width="180">
        </el-table-column>
        <el-table-column prop="i_valid" label="启用状态" min-width="90">
          <template slot-scope="scope">
            <div>
              <el-switch
                 v-model="scope.row.i_valid? true:false"
                active-color="#409EFF"
                inactive-color="#ff4949"
                @change="activeAnnualInspectionRule(scope.row)"
                :disabled="!$isPowerShow('edit')"
              >
              </el-switch>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="name" label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="openAddRuleSettingPop('edit', scope.row)" v-if="$isPowerShow('edit')"
              >编辑</el-button
            >
            <el-popconfirm
              v-if="$isPowerShow('del')"
              @confirm="deleteAnnualInspectionRule(scope.row)"
              title="确定删除此年检提醒吗？">
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <annual-inspection-dialog
      ref="annualInspection"
      :dialogBool.sync="isShowAnnualInspectionDialog"
      :curType="curSettingType"
      @save-add-edit-annual-inspection="saveAddEditAnnualInspection"
    ></annual-inspection-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import annualInspectionDialog from "./annual-inspection-dialog";
export default {
  components: {
    annualInspectionDialog
  },
  props: {
    // data: {
    //   type: Array,
    //   default: null,
    // },
    // loading: {
    //   type: Boolean,
    //   default: false,
    // },
    TableHeight: [Number],
  },
  data() {
    return {
      loading: false,
      data: [],
      curSettingType: "add",
      isShowAnnualInspectionDialog: false,

    };
  },
  mounted() {
    this.loadAnnualInspectionData();
  },
  methods: {
    showAgeCondition(minAge, maxAge) {
      let showText= `${minAge} < 车龄 <= ${maxAge} `
      return showText
    },
    showTypeCondition(type) {
      let showContent = '';
      switch (type) {
        case 0:
          showContent = '半年一次'
          break;
        case 1:
          showContent = '一年一次'
          break;
        case 2:
          showContent = '两年一次'
          break;
        case 3:
          showContent = '三年一次'
          break;
      
        default:
          break;
      }

      return showContent
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
    // 获取年检列表
    loadAnnualInspectionData() {
      this.loading = true;
      // let parmas = this.form;
      this.$client
        .getAnnualInspectionList()
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
    // 打开年检设置弹窗
    openAddRuleSettingPop(type, rowInfo) {
      this.curSettingType = type;
      // if (this.curSettingType == "edit") {
      //   this.$refs.annualInspection.ruleForm.i_id = rowInfo.i_id;
      //   this.$refs.annualInspection.ruleForm.c_rules_name =
      //     rowInfo.c_rules_name;
      //   this.$refs.annualInspection.ruleForm.i_age_condition_min =
      //     rowInfo.i_age_condition_min;
      //   this.$refs.annualInspection.ruleForm.i_age_condition_max =
      //     rowInfo.i_age_condition_max;
      //   this.$refs.annualInspection.ruleForm.i_condition_type = String(
      //     rowInfo.i_condition_type
      //   );
      //   this.$refs.annualInspection.ruleForm.reminders = rowInfo.reminders;
      //   this.$refs.annualInspection.ruleForm.i_warn_days = rowInfo.i_warn_days;
      //   this.$refs.annualInspection.ruleForm.i_warn_way = rowInfo.i_warn_way;
      //   this.$refs.annualInspection.ruleForm.i_valid = rowInfo.i_valid;
      //   this.$refs.annualInspection.i_valid = !!rowInfo.i_valid? true: false;
      //   this.$refs.annualInspection.remindType = rowInfo.c_warn_way;
      // }
      this.isShowAnnualInspectionDialog = true;
      if (this.curSettingType == "edit") {
        this.$nextTick(() => {
          this.$refs.annualInspection.setData(rowInfo)
        })
      }
    },
    // 删除年检规则
    deleteAnnualInspectionRule(rowInfo) {
      let parmas = {
        context: [],
      };
      parmas.context[0] = rowInfo.i_id;
      console.log(parmas);
      this.$client
        .deleteAnnualInspectionRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadAnnualInspectionData();
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
    // 启用/禁用年检
    activeAnnualInspectionRule(rowInfo) {
      let parmas = {
        id: rowInfo.i_id,
        enable: !!rowInfo.i_valid ? "0" : "1",
      };
      this.$client
        .annualInspectionEnabRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadAnnualInspectionData();
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
    // 保存添加编辑年检信息
    saveAddEditAnnualInspection(annualInspectionForm) {
      // alert(JSON.stringify(annualInspectionForm))
      let successrMessage = "";
      let errorMessage = "";
      let parmas = {
        context: annualInspectionForm,
      };
      if (this.curSettingType == "add") {
        delete parmas.context.i_id;
        successrMessage = "添加成功";
        errorMessage = "添加失败";
      } else {
        successrMessage = "编辑成功";
        errorMessage = "编辑失败";
      }

      this.$client
        .addAnnualInspectionRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadAnnualInspectionData();
            this.isShowAnnualInspectionDialog = false;
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
