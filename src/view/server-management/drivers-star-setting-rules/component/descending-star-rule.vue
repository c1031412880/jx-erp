<template>
  <div class="descending-star-rule">
    <div class="application-form-box show-flex-box-c">
      <div>
        <div class="show-flex-box-r show-flex-center margin-10">
          <span>星级考核分数：&nbsp;&nbsp;</span>
          <el-switch
            v-model="form.star_level"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          季度考评总分
          &gt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.zero_score"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.zero_score = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;降为0&nbsp;&nbsp;星
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          季度考评总分
          &gt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.one_score"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.one_score = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;降为1&nbsp;&nbsp;星
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          季度考评总分
          &gt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.two_score"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.two_score = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;降为2&nbsp;&nbsp;星
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          季度考评总分
          &gt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.three_score"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.three_score = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;降为3&nbsp;&nbsp;星
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          季度考评总分
          &gt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.four_score"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.four_score = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;降为4&nbsp;&nbsp;星
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          <span>考勤：&nbsp;&nbsp;</span>
          <el-switch
            v-model="form.attendance"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          缺勤、病假、事假
          &gt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.rest_day"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.rest_day = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;天，不参加考评。
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          出勤天数
          &lt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.work_day"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.work_day = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;天，不参加考评。
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          <span>违纪：&nbsp;&nbsp;</span>
          <el-switch
            v-model="form.violation"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          严重违纪次数
          &lt; &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.violation_count"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.violation_count = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;次，按照原星级参加考评。
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          严重违纪次数
          &gt; =  &nbsp;&nbsp;
          <el-input
            placeholder="请输入"
            v-model="form.violation_over_count"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="form.violation_over_count = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          &nbsp;&nbsp;次，降一星级。
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          <span>未参加考评：&nbsp;&nbsp;</span>
          <el-switch
            v-model="form.asses"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="true"
            :inactive-value="false">
          </el-switch>
        </div>
        <div class="show-flex-box-r show-flex-center margin-10">
          未参加星级考评，按原星级降一级定级
          &nbsp;&nbsp;
          <el-select v-model="form.asses_drop_star">
            <el-option label="只降一次" :value="1"></el-option>
            <el-option label="联系降级" :value="2"></el-option>
          </el-select>
        </div>
      </div>
      <div class="show-flex-box-r show-flex-center" style="padding: 20px 0">
        <el-button type="primary" round @click="updatePlaybill('save')"
          >保 存</el-button
        >
        <el-button round @click="resetTableForm()"
          >重 置</el-button
        >
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "descending-star-rule",
  components: {},
  data() {
    return {
      form: {
        id: '',
        star_level: true,
        zero_score: '',
        one_score: '',
        two_score: '',
        three_score: '',
        four_score: '',
        attendance: true,
        rest_day: '',
        work_day: '',
        violation: true,
        violation_count: '',
        violation_over_count: '',
        asses: true,
        asses_drop_star: '',
      }
    };
  },
  mounted() {
    this.GetDriverStarDropRule()
  },
  methods: {
    // 查询规则
    GetDriverStarDropRule() {
      this.$client.GetDriverStarDropRule().then(res => {
        if (res.head.result == "200") {
          if (res.context) {
            this.form = res.context
          }
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      });
    },
    // 提交
    updatePlaybill(type) {
      this.$client.AddOrUpdateDropRule({context: this.form})
        .then((res) => {
          if (res.head.result == "200") {
            this.GetDriverStarDropRule()
            this.$message({
              showClose: true,
              message: '保存成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch((err) => {});
    },
    // 重置
    resetTableForm() {
       this.$confirm('确定要重置此规则吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.GetDriverStarDropRule()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
    },
  },
};
</script>

<style lang="scss" scoped>
  .margin-10 {
    margin: 10px 0;
  }
  .symbol-box {
    line-height: 0px;
  }
  .descending-star-rule{
    /deep/ .el-input, .el-input--mini {
      width: 120px;
    }
    /deep/ input {
      width: 120px;
    }
  } 
</style>
