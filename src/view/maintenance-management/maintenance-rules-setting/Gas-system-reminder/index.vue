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
        燃气系统检验提醒
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
        >
        <el-table-column fixed prop="rule_name" label="规则名称" min-width="120"></el-table-column>
        <el-table-column fixed prop="rule_type" label="检验类型" min-width="120">
          <template slot-scope="scope">
            {{ getRuleType(scope.row.rule_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="condition_type" label="检验周期" min-width="120">
          <template slot-scope="scope">
            {{ getConditioneType(scope.row.condition_type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="warn_person_name"
          label="提醒人员"
          show-overflow-tooltip
          min-width="120"
        >
        </el-table-column>
        <el-table-column prop="warn_days" label="提前提醒天数" min-width="160"></el-table-column>
        <el-table-column prop="warn_cycle" label="提醒周期" min-width="120">
          <template slot-scope="scope">
            {{ getWarnCycle(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="c_warn_way" label="提醒方式" min-width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.c_warn_way.length > 0">
              {{showTypeWarnWay(scope.row.c_warn_way)}}
            </span>
            <span v-else>--</span>
            
          </template>
        </el-table-column>
        <el-table-column
          prop="warn_content"
          label="提醒内容"
          show-overflow-tooltip
          min-width="180"
        >
        </el-table-column>
        <el-table-column prop="valid" label="启用状态" min-width="90">
          <template slot-scope="scope">
            <div>
              <el-switch
                v-model="scope.row.valid"
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
              v-if="$isPowerShow('del') && !scope.row.valid"
              @confirm="deleteMaintDiscardRule(scope.row)"
              title="确定删除此报废提醒吗？">
              <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Gas-system-dialog
      ref="maintDiscard"
      :dialogBool.sync="isShowScrapRuleSettingDialog"
      :curType="curSettingType"
      @save-add-edit-maintdiscard="saveAddEditMaintdiscard"
    >
    </Gas-system-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import GasSystemDialog from "./Gas-system-dialog";
export default {
  components: {
    GasSystemDialog
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
    // 提醒类型
    getRuleType(rule_type) {
      switch (rule_type) {
        case 1:
          return '气瓶'
        case 2:
          return '安全阀'
        case 3:
          return '压力表'
        default:
          break;
      }
    },
    // 检验周期
    getConditioneType(condition_type) {
      switch (condition_type) {
        case 1:
          return '半年一次'
        case 2:
          return '一年一次'
        case 3:
          return '两年一次'
        case 4:
          return '三年一次'
        default:
          break;
      }
    },
    // 提醒周期
    getWarnCycle(row) {
      return `每${row.warn_cycle}天 提醒一次，提醒时间${row.warn_time}`
    },
    // 获取列表
    loadMaintDiscardData() {
      this.loading = true;
      // let parmas = this.form;
      this.$client
        .GetListGasManage()
        .then((res) => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context
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
        // alert(JSON.stringify(rowInfo))
        setTimeout(() => {
          this.$refs.maintDiscard.setData(rowInfo)
        }, 300);
      }
    },
    // 编辑保存规则
    saveAddEditMaintdiscard(maintainForm) {
      //  alert(JSON.stringify(maintainForm))
      let successrMessage = "";
      let parmas = {
        context: maintainForm,
      };
      if (this.curSettingType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }

      this.$client
        .AddOrUpdateRuleGasManage(parmas)
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

    // 删除规则
    deleteMaintDiscardRule(rowInfo) {
      let parmas = {
        context: [rowInfo.id],
      };
      this.$client
        .DeleteRuleGasManage(parmas)
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
    // 启用/禁用设置
    activeMaintDiscardRule(rowInfo) {
      this.$client
        .EnabRuleGasManage({context:rowInfo.id})
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
