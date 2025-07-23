<template>
  <div class="drivers-star-setting-rules">
    <el-row v-loading="loading" :gutter="20">
      <el-col :span="12">
        <h2>新参与评分员工：</h2>
        <p>
          一星：新上岗驾驶员上线工作时间满
          <el-input-number
            size="mini"
            v-model="form.OneStarQualificationMonths"
            :precision="0"
            :controls="false"
            :min="1"
          ></el-input-number>
          个自然月后，有资格参加一星级的评选
        </p>
        <p>
          二星：二星级需连续取得一星级称号&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.TwoStarQualificationMonths"
            :precision="0"
            :controls="false"
            :min="1"
          ></el-input-number>
          个月
        </p>
        <p>
          三星：申报三星级（含）以上需连续取得二星级称号&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.ThreeStarQualificationMonths"
            :precision="0"
            :controls="false"
            :min="1"
          ></el-input-number>
          个月
        </p>
        <h2>升星规则：</h2>
        <p>
          一星级：入职天数&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.OneStarEntryMonths"
            :precision="0"
            :controls="false"
            :min="1"
          ></el-input-number>
          个自然月，一个考评期平均分数&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.OneStarAverageScore"
            :controls="false"
          ></el-input-number>
          分，奖励金额
          <el-input-number
            size="mini"
            v-model="form.OneStarRewardAmount"
            :precision="0"
            :controls="false"
            :min="0"
          ></el-input-number>
          元
        </p>
        <p>
          二星级：一个考评期平均分数&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.TwoStarAverageScore"
            :controls="false"
          ></el-input-number>
          分，奖励金额
          <el-input-number
            size="mini"
            v-model="form.TwoStarRewardAmount"
            :precision="0"
            :controls="false"
            :min="0"
          ></el-input-number>
          元
        </p>
        <p>
          三星级：一个考评期平均分数&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.ThreeStarAverageScore"
            :controls="false"
          ></el-input-number>
          分，奖励金额
          <el-input-number
            size="mini"
            v-model="form.ThreeStarRewardAmount"
            :precision="0"
            :controls="false"
            :min="0"
          ></el-input-number>
          元
        </p>
        <p>
          四星级：一个考评期平均分数&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.FourStarAverageScore"
            :controls="false"
          ></el-input-number>
          分，奖励金额
          <el-input-number
            size="mini"
            v-model="form.FourStarRewardAmount"
            :precision="0"
            :controls="false"
            :min="0"
          ></el-input-number>
          元
        </p>
        <p>
          五星级：一个考评期平均分数&nbsp;≥&nbsp;
          <el-input-number
            size="mini"
            v-model="form.FiveStarAverageScore"
            :controls="false"
          ></el-input-number>
          分，奖励金额
          <el-input-number
            size="mini"
            v-model="form.FiveStarRewardAmount"
            :precision="0"
            :controls="false"
            :min="0"
          ></el-input-number>
          元
        </p>
        <h2>评星占比：</h2>
        <p>
          一星级：占参与考评比例&nbsp;≤&nbsp;
          <el-input-number
            size="mini"
            v-model="form.OneStarPercentage"
            :controls="false"
          ></el-input-number>
          %
        </p>
        <p>
          二星级：占参与考评比例&nbsp;≤&nbsp;
          <el-input-number
            size="mini"
            v-model="form.TwoStarPercentage"
            :controls="false"
          ></el-input-number>
          %
        </p>
        <p>
          三星级：占参与考评比例&nbsp;≤&nbsp;
          <el-input-number
            size="mini"
            v-model="form.ThreeStarPercentage"
            :controls="false"
          ></el-input-number>
          %
        </p>
        <p>
          四星级：占参与考评比例&nbsp;≤&nbsp;
          <el-input-number
            size="mini"
            v-model="form.FourStarPercentage"
            :controls="false"
          ></el-input-number>
          %
        </p>
        <p>
          五星级：占参与考评比例&nbsp;≤&nbsp;
          <el-input-number
            size="mini"
            v-model="form.FiveStarPercentage"
            :controls="false"
          ></el-input-number>
          %
        </p>
        <h2>考评周期：</h2>
        <p>
          <b>星级生成规则：</b>
          <el-select v-model="generateRulesType" disabled size="mini" style="width: 100px">
            <el-option label="按月份" :value="1"></el-option>
          </el-select>
          每
          <el-input size="mini" v-model="generateRulesCycle" disabled></el-input>
          每周期
          <el-input-number
            size="mini"
            v-model="form.quarter_day"
            :precision="0"
            :controls="false"
            :min="1"
            :max="31"
          ></el-input-number>
          号
        </p>
        <h2>特殊情况：</h2>
        <p>
          <b>直接取消评选资格：</b>
          若驾驶员在一个考评期内连续发生
          <el-input-number
            size="mini"
            v-model="form.CancelElectionTimes"
            :precision="0"
            :controls="false"
            :min="1"
          ></el-input-number>
          次“直接取消评选资格项”行为的，同时待岗一个月，待岗期间暂停星级考评和星级奖金发放，经评估重新上岗后从无星级起参加考评。
        </p>
        <p>
          <b>异常员工：</b>
          因工作需要离开一线驾驶员岗位超过三个月的，返岗或返聘（连续在岗除外）回一线驾驶员岗位的，按一星级参加考评；
          <span style="color: #d9001b">人工判断登记</span>
          。
        </p>
      </el-col>
      <el-col :span="12">
        <h2>特殊线路/驾驶员：</h2>
        <p>
          <b>特殊线路：</b>
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.SpecialRouteId"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
            size="mini"
          ></get-driver-select-tree>
          线路的驾驶员按照同样参与星级驾驶员评定工作，但最高评定等级为
          <el-input-number
            size="mini"
            v-model="form.SpecialRouteMaxStar"
            :precision="0"
            :controls="false"
            :min="1"
            :max="5"
          ></el-input-number>
          星级，且所得星级月奖奖励按照营运线路驾驶员的
          <el-input-number
            size="mini"
            v-model="form.SpecialRouteRewardDiscount"
            :precision="0"
            :controls="false"
            :min="0"
          ></el-input-number>
          %发放。
        </p>
        <p>
          <b>特殊驾驶员：</b>
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.SpecialDriverId"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
            size="mini"
          ></get-driver-select-tree>
          从事辅助生产工作和机动驾驶员不参加星级评定，按照
          <el-input-number
            size="mini"
            v-model="form.SpecialDriverStar"
            :precision="0"
            :controls="false"
            :min="1"
            :max="5"
          ></el-input-number>
          星级奖励标准发放月奖。
        </p>
        <h2>降星：</h2>
        <p>
          考评期平均分&nbsp;&nbsp;&lt;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DemoteToOneStarScore"
            :controls="false"
          ></el-input-number>
          &nbsp;&nbsp;&nbsp;&nbsp;降为&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            :value="0"
            :precision="0"
            :controls="false"
            :min="0"
            :max="5"
            disabled
          ></el-input-number>
          星
        </p>
        <p>
          考评期平均分&nbsp;&nbsp;&lt;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DemoteToTwoStarScore"
            :controls="false"
          ></el-input-number>
          &nbsp;&nbsp;&nbsp;&nbsp;降为&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            :value="1"
            :precision="0"
            :controls="false"
            :min="1"
            :max="5"
            disabled
          ></el-input-number>
          星
        </p>
        <p>
          考评期平均分&nbsp;&nbsp;&lt;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DemoteToThreeStarScore"
            :controls="false"
          ></el-input-number>
          &nbsp;&nbsp;&nbsp;&nbsp;降为&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            :value="2"
            :precision="0"
            :controls="false"
            :min="1"
            :max="5"
            disabled
          ></el-input-number>
          星
        </p>
        <p>
          考评期平均分&nbsp;&nbsp;&lt;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DemoteToFourStarScore"
            :controls="false"
          ></el-input-number>
          &nbsp;&nbsp;&nbsp;&nbsp;降为&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            :value="3"
            :precision="0"
            :controls="false"
            :min="1"
            :max="5"
            disabled
          ></el-input-number>
          星
        </p>
        <p>
          考评期平均分&nbsp;&nbsp;&lt;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DemoteToFiveStarScore"
            :controls="false"
          ></el-input-number>
          &nbsp;&nbsp;&nbsp;&nbsp;降为&nbsp;&nbsp;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            :value="4"
            :precision="0"
            :controls="false"
            :min="1"
            :max="5"
            disabled
          ></el-input-number>
          星
        </p>
        <h2>考勤：</h2>
        <p>
          <b>上线天数：</b>
          上线天数&nbsp;&nbsp;&lt;&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DriverOnlineDays"
            :precision="0"
            :controls="false"
            :min="1"
            :max="31"
          ></el-input-number>
          天，当月不参加星级评定，按一星级奖励标准发放月奖，但保留原星级。
        </p>
        <p>
          <b>实际出勤天数：</b>
          <el-input-number
            size="mini"
            v-model="form.DriverAttendanceDaysGreaterEqual"
            :precision="0"
            :controls="false"
            :min="1"
            :max="31"
          ></el-input-number>
          &nbsp;&nbsp;≤&nbsp;&nbsp;实际出勤天数&nbsp;&nbsp;≤&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DriverAttendanceDaysLessEqual"
            :precision="0"
            :controls="false"
            :min="1"
            :max="31"
          ></el-input-number>
          天，当月星级奖励减半发放。
        </p>
        <p>
          <b>实际出勤天数：</b>
          实际出勤天数&nbsp;&nbsp;≤&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.DriverActualAttendanceDaysLess"
            :precision="0"
            :controls="false"
            :min="1"
            :max="31"
          ></el-input-number>
          天，驾驶员当月不参加星级考评，取消当月星级奖励，保持原有星级等级，正常出勤后按原星级进行考评。
        </p>
        <p>
          <b>病假：</b>
          驾驶员因病假原因取消星级或降星的，保留原有星级名额，正常出勤后按原有星级进行考评；连续病假的从第
          <el-input-number
            size="mini"
            v-model="form.SickLeaveDemoteStarMonth"
            :precision="0"
            :controls="false"
            :min="1"
          ></el-input-number>
          个月起逐月逐级降星。
        </p>
        <p>
          <b>缺勤天数：</b>
          缺勤天数&nbsp;&nbsp;≥&nbsp;&nbsp;
          <el-input-number
            size="mini"
            v-model="form.AbsenceDaysGreaterThan"
            :precision="0"
            :controls="false"
            :min="1"
          ></el-input-number>
          驾驶员当月不参加星级考评，取消当月星级奖励，正常出勤后从降级后的星级级别进行考评。
          <span style="color: #d9001b">人工判断登记</span>
          。
        </p>
        <p>
          <b>待岗：</b>
          驾驶员因各种原因导致待岗的，当月不参加星级考评，取消当月星级奖励，造成星级降级的，从降级后的星级级别进行考评；降至无星级的，按照无星级驾驶员星级评定方式评星；
          <span style="color: #d9001b">人工判断登记</span>
          。
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <div class="attention">
        <h2>注意:</h2>
        <div class="content">
          <p>1：考核采用百分制。因发生取消星级情况的当月星级考核分按60分计算。</p>
          <p>2：加分一个月内不超过1次。</p>
          <p>
            3：因违反上述扣分项条款引发投诉的，按有责投诉处理；但被投诉内容为直接取消项的，按直接取消项处理。
          </p>
          <p>
            4：如出现同分现象，原获得过该档星级的驾驶员优先；如果是同资格的，依据就近历史考核记录分数的高低进行评定。
          </p>
          <p>5：奖励发放实行当月评比，次月兑现。</p>
        </div>
      </div>
    </el-row>
    <el-row :gutter="20" type="flex" justify="center" style="padding-bottom: 20px">
      <el-button type="primary" size="small" @click="submit">保存</el-button>
      <!-- <el-button type="primary" size="small">重置</el-button> -->
    </el-row>
  </div>
</template>

<script>
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
export default {
  name: 'drivers-star-setting-rules',
  components: { getDriverSelectTree },
  props: {},
  data() {
    return {
      generateRulesType: 1,
      generateRulesCycle: '月',
      loading: false,
      form: {
        id: 0,
        quarter_day: 1,
        OneStarQualificationMonths: 3,
        TwoStarQualificationMonths: 3,
        ThreeStarQualificationMonths: 6,
        OneStarEntryMonths: 3,
        OneStarAverageScore: 75,
        OneStarRewardAmount: 225,
        TwoStarAverageScore: 80,
        TwoStarRewardAmount: 240,
        ThreeStarAverageScore: 85,
        ThreeStarRewardAmount: 255,
        FourStarAverageScore: 95,
        FourStarRewardAmount: 270,
        FiveStarAverageScore: 98,
        FiveStarRewardAmount: 285,
        OneStarPercentage: 0,
        TwoStarPercentage: 66,
        ThreeStarPercentage: 18,
        FourStarPercentage: 3,
        FiveStarPercentage: 1,
        CancelElectionTimes: 2,
        SpecialRouteId: [],
        SpecialRouteMaxStar: 3,
        SpecialRouteRewardDiscount: 80,
        SpecialDriverId: [],
        SpecialDriverStar: 1,
        DemoteToOneStarScore: 75,
        DemoteToTwoStarScore: 80,
        DemoteToThreeStarScore: 85,
        DemoteToFourStarScore: 95,
        DemoteToFiveStarScore: 98,
        DriverOnlineDays: 13,
        DriverAttendanceDaysGreaterEqual: 5,
        DriverAttendanceDaysLessEqual: 15,
        DriverActualAttendanceDaysLess: 5,
        SickLeaveDemoteStarMonth: 3,
        AbsenceDaysGreaterThan: 5
      }
    }
  },
  created() {
    this.loadData()
  },
  mounted() {},
  methods: {
    loadData() {
      this.loading = true
      this.$client
        .GetDriverStarRule()
        .then(res => {
          if (res.head.result == '200' && res.context) {
            this.form = res.context
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    submit() {
      this.$client
        .AddOrUpdateRule({
          context: this.form
        })
        .then(res => {
          if (res.head.result == '200') {
            this.$message.success('保存成功')
            this.loadData()
          } else {
            this.$message.error(res.head.describle)
          }
        })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.drivers-star-setting-rules {
  width: 100%;
  height: 100%;

  .el-input-number,
  .el-input {
    width: 60px;
    margin: 0 5px;
  }

  /deep/ .popover-input-box {
    width: 140px;
    margin: 0 5px;
  }

  h2 {
    font-weight: bold;
  }

  p {
    font-size: 14px;
    margin: 10px 0 10px 20px;
    line-height: 20px;
  }

  .attention {
    display: flex;
    padding: 0 10px;

    .content {
      p:first-child {
        margin-top: 0;
      }
    }
  }
}
</style>
