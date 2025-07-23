<template>
  <div class="rising-star-rule">
    <div class="application-form-box show-flex-box-c">
      <div>
        <el-table
          ref="table"
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          :header-cell-style="{
            background: '#E0F3FF',
            color: '#333333',
            fontSize: '16px',
            padding: '2px 0px',
            fontWeight: '700',
            borderColor: '#C1CDCD',
          }"
          :cell-style="{ fontSize: '13px', padding: '2px 0px' }"
          lazy
          border>
          <el-table-column  prop="name" label="考核项" label-align="center" width="150"></el-table-column>
          <el-table-column prop="first" label="一星级考核规则" label-align="center">
            <template slot-scope="scope">
              <div
                v-if="scope.row.id == 1"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <div class="symbol-box">
                  &gt; = &nbsp;&nbsp;
                </div>
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.first].join_day"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.first].join_day = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;天
              </div>
              <div
                v-if="scope.row.id == 2"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <div class="symbol-box">
                  &gt; = &nbsp;&nbsp;
                </div>
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.first].month_work_day"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.first].month_work_day = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;天
              </div>
              <p v-if="scope.row.id == 3">每月初始分数100分，季度考核</p>
              <div
                v-if="scope.row.id == 3"
                class="show-flex-box-r show-flex-center margin-10"
              >
                分数>= &nbsp;&nbsp;
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.first].star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.first].star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 4"
                class="show-flex-box-r show-flex-center margin-10"
              >
                在一个考评期月平均分达到
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.first].ip_star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.first].ip_star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 5"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.first].democratic_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.first].democratic_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="second" label="二星级考核规则" label-align="center">
            <template slot-scope="scope">
              <div
                v-if="scope.row.id == 2"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <div class="symbol-box">
                  &gt; = &nbsp;&nbsp;
                </div>
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.second].month_work_day"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.second].month_work_day = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;天
              </div>
              <p v-if="scope.row.id == 3">每月初始分数100分，季度考核</p>
              <div
                v-if="scope.row.id == 3"
                class="show-flex-box-r show-flex-center margin-10"
              >
                分数>= &nbsp;&nbsp;
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.second].star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.second].star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 4"
                class="show-flex-box-r show-flex-center margin-10"
              >
                在一个考评期月平均分达到
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.second].ip_star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.second].ip_star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 5"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.second].democratic_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.second].democratic_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
              <div
                v-if="scope.row.id == 6"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.second].star_proportion"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.second].star_proportion = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="third" label="三星级考核规则" label-align="center">
            <template slot-scope="scope">
              <div
                v-if="scope.row.id == 2"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <div class="symbol-box">
                  &gt; = &nbsp;&nbsp;
                </div>
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.third].month_work_day"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.third].month_work_day = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;天
              </div>
              <p v-if="scope.row.id == 3">每月初始分数100分，季度考核</p>
              <div
                v-if="scope.row.id == 3"
                class="show-flex-box-r show-flex-center margin-10"
              >
                分数>= &nbsp;&nbsp;
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.third].star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.third].star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 4"
                class="show-flex-box-r show-flex-center margin-10"
              >
                在一个考评期月平均分达到
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.third].ip_star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.third].ip_star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 5"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.third].democratic_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.third].democratic_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
              <div
                v-if="scope.row.id == 6"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.third].star_proportion"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.third].star_proportion = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fourth" label="四星级考核规则" label-align="center">
            <template slot-scope="scope">
              <div
                v-if="scope.row.id == 2"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <div class="symbol-box">
                  &gt; = &nbsp;&nbsp;
                </div>
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fourth].month_work_day"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fourth].month_work_day = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;天
              </div>
              <p v-if="scope.row.id == 3">每月初始分数100分，季度考核</p>
              <div
                v-if="scope.row.id == 3"
                class="show-flex-box-r show-flex-center margin-10"
              >
                分数>= &nbsp;&nbsp;
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fourth].star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fourth].star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 4"
                class="show-flex-box-r show-flex-center margin-10"
              >
                在一个考评期月平均分达到 
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fourth].ip_star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fourth].ip_star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分，
              </div>
              <p v-if="scope.row.id == 4">并荣获公司上年度(上半年)和当年度（下半年）综合先进及上级先进荣誉。</p>
              <div
                v-if="scope.row.id == 5"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fourth].democratic_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fourth].democratic_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
              <div
                v-if="scope.row.id == 6"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fourth].star_proportion"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fourth].star_proportion = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fifth" label="五星级考核规则" label-align="center">
            <template slot-scope="scope">
              <div
                v-if="scope.row.id == 2"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <div class="symbol-box">
                  &gt; = &nbsp;&nbsp;
                </div>
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fifth].month_work_day"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fifth].month_work_day = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;天
              </div>
              <p v-if="scope.row.id == 3">每月初始分数100分，季度考核</p>
              <div
                v-if="scope.row.id == 3"
                class="show-flex-box-r show-flex-center margin-10"
              >
                分数>= &nbsp;&nbsp;
                <el-input 
                  placeholder="请输入"
                  v-model="data[scope.row.fifth].star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fifth].star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分
              </div>
              <div
                v-if="scope.row.id == 4"
                class="show-flex-box-r show-flex-center margin-10"
              >
                在一个考评期月平均分达到 
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fifth].ip_star_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fifth].ip_star_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;分，
              </div>
              <p v-if="scope.row.id == 4">并荣获公司上年度(上半年)和当年度（下半年）综合先进及上级先进荣誉。</p>
              <div
                v-if="scope.row.id == 5"
                class="show-flex-box-r show-flex-center margin-10"
              >
                <el-input
                  placeholder="请输入"
                  v-model="data[scope.row.fifth].democratic_score"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="data[scope.row.fifth].democratic_score = $event.target.value"
                  size="mini"
                  clearable
                ></el-input>
                &nbsp;&nbsp;%
              </div>
              
            </template>
          </el-table-column>
        </el-table>
        <div class="show-flex-box-r show-flex-center margin-10">
          驾驶员星级后台生成规则：   每季度开始月（1,4,7,10）
          <el-input
            placeholder="请输入"
            v-model="data[0].quarter_day"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="data[0].quarter_day = $event.target.value"
            size="mini"
            clearable
          ></el-input>
          号生成上一季度的驾驶员星级结果。
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
  name: "rising-star-rule",
  components: {},
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: "入职天数",
          first: 0,
          second: 1,
          third: 2,
          fourth: 3,
          fifth: 4,
        },
        {
          id: 2,
          name: "月均出勤天数",
          first: 0,
          second: 1,
          third: 2,
          fourth: 3,
          fifth: 4,
        },
        {
          id: 3,
          name: "星级考核分数标准",
          first: 0,
          second: 1,
          third: 2,
          fourth: 3,
          fifth: 4,
        },
        {
          id: 4,
          name: "升星要求",
          first: 0,
          second: 1,
          third: 2,
          fourth: 3,
          fifth: 4,
        },
        {
          id: 5,
          name: "民主评分占比",
          first: 0,
          second: 1,
          third: 2,
          fourth: 3,
          fifth: 4,
        },
        {
          id: 6,
          name: "评星比例",
          first: 0,
          second: 1,
          third: 2,
          fourth: 3,
          fifth: 4,
        },
      ],
      data: [
        {
          star_level: 1,
          join_day: '',
          month_work_day: '',
          star_score: '',
          ip_star_score: '',
          democratic_score: '',
          star_proportion: '',
          quarter_day: ''
        },
        {
          star_level: 2,
          join_day: '',
          month_work_day: '',
          star_score: '',
          ip_star_score: '',
          democratic_score: '',
          star_proportion: '',
        },
        {
          star_level: 3,
          join_day: '',
          month_work_day: '',
          star_score: '',
          ip_star_score: '',
          democratic_score: '',
          star_proportion: '',
        },
        {
          star_level: 4,
          join_day: '',
          month_work_day: '',
          star_score: '',
          ip_star_score: '',
          democratic_score: '',
          star_proportion: '',
        },
        {
          star_level: 5,
          join_day: '',
          month_work_day: '',
          star_score: '',
          ip_star_score: '',
          democratic_score: '',
          star_proportion: '',
        },
      ],
      TableHeight: 500,
    };
  },
  mounted() {
    this.GetAdvertPlatforms()
  },
  methods: {
    // 查询规则
    GetAdvertPlatforms() {
      this.$client.GetAdvertPlatformsDriverStar().then(res => {
        if (res.head.result == "200") {
          if (res.context && res.context.length > 0) {
            this.data = res.context
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
      this.$client.AddOrUpdateAssesRule({context: this.data})
        .then((res) => {
          if (res.head.result == "200") {
            this.GetAdvertPlatforms();
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
          this.GetAdvertPlatforms()
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
  .rising-star-rule{
    /deep/ .el-input, .el-input--mini {
      width: 90px;
    }
    /deep/ input {
      width: 90px;
    }
  } 
</style>
