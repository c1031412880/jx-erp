<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="750px" >
    <div class="information-dialog-box" style="height:400px;overflow-x:hidden">
      <el-form :inline="true" size="mini" label-width="120px" ref="form" :model="form">
        <el-form-item label="指标年份：">
          <el-date-picker
            v-model="year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            :clearable="false"
            @change="selectedYear"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
         <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="成本" name="first">
            <div class="show-flex-box-r">
               <el-form-item label="主营成本:" prop="main_cost">
                <el-input
                  placeholder="请输入主营成本"
                  v-model="form.main_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.main_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="税金及附加:" prop="tax_additional">
                <el-input
                  placeholder="请输入税金及附加"
                  v-model="form.tax_additional"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.tax_additional = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="财务费用:" prop="finance_cost">
                <el-input
                  placeholder="请输入财务费用"
                  v-model="form.finance_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.finance_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="管理费用:" prop="manage_cost">
                <el-input
                  placeholder="请输入管理费用"
                  v-model="form.manage_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.manage_cost = $event.target.value"
                  @input="TotalCostIndicators"
                  disabled
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
              <el-form-item label="成本指标合计:" prop="">
               <span style="color:#D9001B;">{{TotalCostIndicatorsNum}}</span>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
              <i style="float:left;width: 6px;height: 18px; background: #409EFF;"></i> 
              <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">管理费用明细</p>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="管理人员工资:" prop="manage_person_wage">
                <el-input
                  placeholder="请输入管理人员工资"
                  v-model="form.manage_person_wage"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.manage_person_wage = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="派遣人员费用:" prop="send_person_wage">
                <el-input
                  placeholder="请输入派遣人员费用"
                  v-model="form.send_person_wage"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.send_person_wage = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="五险一金:" prop="five_insurance">
                <el-input
                  placeholder="请输入五险一金"
                  v-model="form.five_insurance"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.five_insurance = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="公什费:" prop="company_cost">
                <el-input
                  placeholder="请输入公什费"
                  v-model="form.company_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.company_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="印刷费:" prop="printing_cost">
                <el-input
                  placeholder="请输入印刷费"
                  v-model="form.printing_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.printing_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <!-- 少 -->
              <el-form-item label="通讯费:" prop="connect_cost">
                <el-input
                  placeholder="请输入通讯费"
                  v-model="form.connect_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.connect_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <!-- 少 -->
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="水电费:" prop="hydroelectric_cost">
                <el-input
                  placeholder="请输入水电费"
                  v-model="form.hydroelectric_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.hydroelectric_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="公务车费用:" prop="official_cost">
                <el-input
                  placeholder="请输入公务车费用"
                  v-model="form.official_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.official_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="维修费:" prop="repair_cost">
                <el-input
                  placeholder="请输入维修费"
                  v-model="form.repair_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.repair_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="租金:" prop="rent_cost">
                <el-input
                  placeholder="请输入租金"
                  v-model="form.rent_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.rent_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="审计诉讼咨询:" prop="audit_cost">
                <el-input
                  placeholder="请输入审计诉讼咨询"
                  v-model="form.audit_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.audit_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="卫生费:" prop="health_cost">
                <el-input
                  placeholder="请输入卫生费"
                  v-model="form.health_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.health_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="差旅费:" prop="travel_cost">
                <el-input
                  placeholder="请输入差旅费"
                  v-model="form.travel_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.travel_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="招待费:" prop="entertain_cost">
                <el-input
                  placeholder="请输入招待费"
                  v-model="form.entertain_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.entertain_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="员工培训费:" prop="employee_training_cost">
                <el-input
                  placeholder="请输入员工培训费"
                  v-model="form.employee_training_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.employee_training_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="残保金:" prop="residual_protect_cost">
                <el-input
                  placeholder="请输入残保金"
                  v-model="form.residual_protect_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.residual_protect_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="折旧、摊销:" prop="depreciation_cost">
                <el-input
                  placeholder="请输入折旧、摊销"
                  v-model="form.depreciation_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.depreciation_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="老人卡、IC卡:" prop="ic_cost">
                <el-input
                  placeholder="请输入老人卡、IC卡"
                  v-model="form.ic_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.ic_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="工会经费:" prop="union_funds_cost">
                <el-input
                  placeholder="请输入工会经费"
                  v-model="form.union_funds_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.union_funds_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="代发工资:" prop="payroll">
                <el-input
                  placeholder="请输入代发工资"
                  v-model="form.payroll"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.payroll = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="党建费用:" prop="party_cost">
                <el-input
                  placeholder="请输入党建费用"
                  v-model="form.party_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.party_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="其他:" prop="income_other">
                <el-input
                  placeholder="请输入其他"
                  v-model="form.income_other"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.income_other = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="福利费:" prop="welfare_cost">
                <el-input
                  placeholder="请输入福利费"
                  v-model="form.welfare_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.welfare_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="公车费用:" prop="bus_cost">
                <el-input
                  placeholder="请输入公车费用"
                  v-model="form.bus_cost"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.bus_cost = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="收入" name="second">
            <div class="show-flex-box-r">
               <el-form-item label="票款收入:" prop="fare_income">
                <el-input
                  placeholder="请输入票款收入"
                  v-model="form.fare_income"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.fare_income = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="其他收入:" prop="other_income">
                <el-input
                  placeholder="请输入其他收入"
                  v-model="form.other_income"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.other_income = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
              <el-form-item label="小计:" prop="">
               <span style="color:#D9001B;">{{SubtotalIncome}}</span>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="营业外收支" name="third">
            <div class="show-flex-box-r">
               <el-form-item label="政府补亏:" prop="government_bk">
                <el-input
                  placeholder="请输入政府补亏"
                  v-model="form.government_bk"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.government_bk = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="购车补贴:" prop="rebates">
                <el-input
                  placeholder="请输入购车补贴"
                  v-model="form.rebates"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.rebates = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="油、电补:" prop="oil_electric">
                <el-input
                  placeholder="请输入油、电补"
                  v-model="form.oil_electric"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.oil_electric = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="旧车回购:" prop="old_repo">
                <el-input
                  placeholder="请输入旧车回购"
                  v-model="form.old_repo"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.old_repo = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="处罚:" prop="punishment">
                <el-input
                  placeholder="请输入处罚"
                  v-model="form.punishment"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.punishment = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
              <el-form-item label="车辆报废损失:" prop="scrappage_loss">
                <el-input
                  placeholder="请输入车辆报废损失"
                  v-model="form.scrappage_loss"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.scrappage_loss = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
            </div>
            <div class="show-flex-box-r">
               <el-form-item label="其他:" prop="revenue_other">
                <el-input
                  placeholder="请输入其他"
                  v-model="form.revenue_other"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.revenue_other = $event.target.value"
                  @input="TotalCostIndicators"
                ></el-input>
              </el-form-item>
             <div class="show-flex-box-r">
              <el-form-item label="小计:" prop="">
               <span style="color:#D9001B;">{{nonoperatingRevenuesTotal}}</span>
              </el-form-item>
            </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: '经营指标设定'
    }
  },
  data() {
    return {
      activeName: 'first',
      year:'',
      form:{
        "id": 0,
        "year": '',
        "main_cost": '',
        "tax_additional": '',
        "finance_cost": '',
        "manage_cost": '',
        "manage_person_wage": '',
        "send_person_wage": '',
        "five_insurance": '',
        "company_cost": '',
        "printing_cost": '',
        "hydroelectric_cost": '',
        "official_cost": '',
        "repair_cost": '',
        "rent_cost": '',
        "audit_cost": '',
        "health_cost": '',
        "travel_cost": '',
        "entertain_cost": '',
        "employee_training_cost": '',
        "residual_protect_cost": '',
        "depreciation_cost": '',
        "ic_cost": '',
        "union_funds_cost": '',
        "payroll": '',
        "party_cost": '',
        "income_other": '',
        "welfare_cost": '',
        "bus_cost": '',
        "fare_income": '',
        "other_income": '',
        "government_bk": '',
        "rebates": '',
        "oil_electric": '',
        "old_repo": '',
        "punishment": '',
        "scrappage_loss": '',
        "revenue_other": '',
        "cunting_wage": '',
        "but_cost": '',
        "connect_cost": ''
      },
      TotalCostIndicatorsNum: 0, //成本指标合计
      SubtotalIncome:0, //收入小计
      nonoperatingRevenuesTotal: 0, //营业外收支小计
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.setDate();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
     // 设置默认为当前年
    setDate() {
      let date = new Date();
      let Y = date.getFullYear()
      // let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      this.year = Y.toString()
      this.form.year = this.year
      if(!!this.year){
        this.loadDetailFinanceAnalysis()
      }
    },
    // 选择年份
    selectedYear(val) {
      if(!!val)  {
        this.form.year = val
        this.loadDetailFinanceAnalysis()
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    // 加载查询年度指标
    loadDetailFinanceAnalysis() {
      let params = {year:this.year};
      this.$client.DetailFinanceAnalysis(params).then(req => {
        if (req.head.result === '200') {
          if(!!req.context) {
            for (const key in this.form) {
              if (Object.hasOwnProperty.call(req.context, key)) {
                this.form[key] = req.context[key];
              }
            }
          }else{
            this.$refs['form'].resetFields();
          }
          this.TotalCostIndicators();

        }else{
          this.data = [];
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.data = [];
        console.log(err)
      })
    },
    // 计算成本指标合计
    TotalCostIndicators() {
      let info = {...this.form}
      // console.log(info)
      this.TotalCostIndicatorsNum  = 0;
      this.form.manage_cost = 0;
      this.SubtotalIncome = 0;
      this.nonoperatingRevenuesTotal = 0;
      for (const key in info) {
        if (Object.hasOwnProperty.call(info, key)) {
          switch (key) {
            case 'main_cost':
            case 'tax_additional':
            case 'finance_cost':
            case 'manage_cost':
              this.TotalCostIndicatorsNum = this.TotalCostIndicatorsNum + Number(info[key])
              break;
            case 'manage_person_wage':
            case 'send_person_wage':
            case 'five_insurance':
            case 'company_cost':
            case 'printing_cost':
            case 'hydroelectric_cost':
            case 'official_cost':
            case 'repair_cost':
            case 'rent_cost':
            case 'audit_cost':
            case 'health_cost':
            case 'travel_cost':
            case 'entertain_cost':
            case 'employee_training_cost':
            case 'residual_protect_cost':
            case 'depreciation_cost':
            case 'ic_cost':
            case 'union_funds_cost':
            case 'payroll':
            case 'party_cost':
            case 'income_other':
            case 'welfare_cost':
            case 'bus_cost':
            case 'connect_cost':
              this.form.manage_cost = this.form.manage_cost + Number(info[key])
              break;
            case 'fare_income':
            case 'other_income':
              this.SubtotalIncome = this.SubtotalIncome + Number(info[key])
              break;
            case 'government_bk':
            case 'rebates':
            case 'oil_electric':
            case 'old_repo':
            case 'punishment':
            case 'scrappage_loss':
            case 'revenue_other':
              this.nonoperatingRevenuesTotal = this.nonoperatingRevenuesTotal + Number(info[key])
              break;


          }
        }
      }
    },
    // 保存
    updatePlaybill() {
      let info = {...this.form}
      this.$emit("save-administrative-expenses",info)
    },
   
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.information-dialog-box {
  height: 400px;
  overflow-y: scroll;
}

.information-dialog-box /deep/ .el-date-editor {
  width: 200px;
}
.information-dialog-box /deep/.el-select,.el-select--mini {
  width: 200px;
}
.information-dialog-box /deep/ .el-input,.el-input--mini{
  width: 200px;
}

</style>
