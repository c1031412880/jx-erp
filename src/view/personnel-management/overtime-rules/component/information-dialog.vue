<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="980px"
    top="60px"
  >
    <div class="el-dialog-div">
      <el-form
        :model="form"
        :rules="basicRules"
        ref="form"
        label-width="200px"
        size="mini"
      >
        <el-form-item label="规则名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="应用考勤组:" prop="group_name">
          <el-input
            v-model="form.group_name"
            placeholder="请输入应用考勤组"
            disabled
          ></el-input>
        </el-form-item>
        <el-tabs v-model="form.type" @tab-click="handleClick">
          <el-tab-pane
            style="max-height: 480px; overflow: auto"
            :label="zItem.label"
            :name="zItem.type"
            v-for="(zItem, zIndex) in form.types"
            :key="zIndex"
          >
            <div
              v-if="zItem.type == '3'"
              style="font-size: 12px; color: #909399; margin-bottom: 8px"
            >
              注：节假日指节日当天（如5月1日、10月1日等）
            </div>
            <el-form-item label="允许加班:" prop="">
              <el-switch
                v-model="zItem.is_allow"
                active-color="#409EFF"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="2"
              >
              </el-switch>
            </el-form-item>
            <div v-show="zItem.is_allow === 1">
              <el-form-item label="计算时长:" prop="" label-width="240px">
                <span>按审批时长计算</span>

                <p style="font-size: 12px; color: #999">
                  注意：工作日加班系统计算时长会自动去除上班时间
                </p>
              </el-form-item>
              <el-form-item
                label="最小加班时长:"
                prop=""
                label-width="240px"
                v-if="zItem.type != '1'"
              >
                <span>累计加班少于</span>
                <el-input
                  v-model="zItem.min_hour"
                  placeholder=""
                  style="width: 135px"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="zItem.min_hour = Number($event.target.value)"
                  size="mini"
                >
                  <template slot="append">分钟</template>
                </el-input>
                <span>不计入加班</span>
              </el-form-item>
            </div>
            <el-form-item label="扣除休息时间:" prop="">
              <el-switch
                v-model="zItem.is_deduct"
                active-color="#409EFF"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="2"
              >
              </el-switch>
            </el-form-item>
            <div v-show="zItem.is_deduct === 1">
              <el-form-item label="" prop="">
                <el-radio v-model="zItem.deduct_type" :label="1">按休息时段扣除</el-radio>
                <div>
                  <span>休息开始：</span>
                  <el-time-select
                    placeholder="起始时间"
                    style="width: 120px"
                    v-model="zItem.cdeduct_start_date"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '24:30',
                    }"
                  >
                  </el-time-select>
                  <span>休息结束：</span>
                  <el-time-select
                    placeholder="结束时间"
                    v-model="zItem.deduct_end_date"
                    style="width: 120px"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '24:30',
                      minTime: zItem.cdeduct_start_date,
                    }"
                  >
                  </el-time-select>
                </div>
              </el-form-item>
              <el-form-item label="" prop="">
                <el-radio v-model="zItem.deduct_type" :label="2"
                  >按加班时长扣除</el-radio
                >
                <div class="show-flex-box-r">
                  <span>每天加班满：</span>
                  <el-input
                    v-model="zItem.deduct_condition"
                    placeholder=""
                    style="width: 135px"
                    oninput="value=value.replace(/[^\d.-]/g,'')"
                    @blur="zItem.deduct_condition = Number($event.target.value)"
                    size="mini"
                  >
                    <template slot="append">小时</template>
                  </el-input>
                  <span>&nbsp;，扣除&nbsp;</span>
                  <el-input
                    v-model="zItem.deduct_hour"
                    placeholder=""
                    style="width: 135px"
                    oninput="value=value.replace(/[^\d.-]/g,'')"
                    @blur="zItem.deduct_hour = Number($event.target.value)"
                    size="mini"
                  >
                    <template slot="append">小时</template>
                  </el-input>
                </div>
              </el-form-item>
            </div>
            <el-form-item label="加班时长记为调休或加班费:" prop="">
              <el-switch
                v-model="zItem.is_fee"
                active-color="#409EFF"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="2"
              >
              </el-switch>
            </el-form-item>
            <div v-show="zItem.is_fee === 1">
              <el-row style="margin: 0 20%">
                <el-col :span="8">
                  <el-form-item label="" prop="" label-width="0">
                    <el-radio v-model="zItem.is_type" :label="1"
                      >记为调休</el-radio
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="" prop="" label-width="0">
                    <el-radio v-model="zItem.is_type" :label="2"
                      >记为加班费</el-radio
                    >
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="" prop="" label-width="0">
                    <el-radio v-model="zItem.is_type" :label="3"
                      >员工自主选择</el-radio
                    >
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                label=""
                prop=""
                v-show="zItem.is_type === 1 || zItem.is_type === 3"
              >
                <el-form-item label="" prop="" label-width="40px">
                  <el-radio v-model="zItem.time_type" :label="1">按比例计时：</el-radio>
                  <div v-show="zItem.time_type === 1" style="margin-left: 40px">
                    <span>按照1&nbsp; ：&nbsp;</span>
                    <el-input
                      v-model="zItem.scale"
                      placeholder=""
                      style="width: 50px"
                      oninput="value=value.replace(/[^\d.-]/g,'')"
                      @blur="zItem.scale = Number($event.target.value)"
                      size="mini"
                    ></el-input>
                    <span>&nbsp; 计为调休时长，并关联假期项：调休</span>
                  </div>
                </el-form-item>
                <el-form-item
                  label=""
                  prop=""
                  label-width="40px"
                  style="margin-bottom: 0"
                >
                  <el-radio v-model="zItem.time_type" :label="2">分段计时：</el-radio>
                  <div v-show="zItem.time_type === 2" style="margin-left: 40px">
                    <p style="margin-bottom: 10px">
                      <span>加班时长小于</span>
                      <el-input-number
                        v-model="zItem.time_rule[0].time_end"
                        :controls="false"
                        size="small"
                        :min="0"
                        style="width: 60px"
                      ></el-input-number>
                      <span>&nbsp; 小时，转调休：</span>
                      <el-input-number
                        v-model="zItem.time_rule[0].hour"
                        :controls="false"
                        size="small"
                        :min="0"
                        style="width: 60px"
                      ></el-input-number>
                      <span>天</span>
                    </p>
                    <p style="margin-bottom: 10px">
                      <span>加班时长大于等于</span>
                      <el-input-number
                        v-model="zItem.time_rule[1].time_start"
                        :controls="false"
                        size="small"
                        :min="zItem.time_rule[0].time_end"
                        style="width: 60px"
                      ></el-input-number>
                      <span>&nbsp; 小时，小于等于：</span>
                      <el-input-number
                        v-model="zItem.time_rule[1].time_end"
                        :controls="false"
                        size="small"
                        :min="zItem.time_rule[1].time_start"
                        style="width: 60px"
                      ></el-input-number>
                      <span>小时，转调休：</span>
                      <el-input-number
                        v-model="zItem.time_rule[1].hour"
                        :controls="false"
                        size="small"
                        :min="0"
                        style="width: 60px"
                      ></el-input-number>
                      <span>天</span>
                    </p>
                    <p style="margin-bottom: 10px">
                      <span>加班时长大于</span>
                      <el-input-number
                        v-model="zItem.time_rule[2].time_start"
                        :controls="false"
                        size="small"
                        :min="zItem.time_rule[1].time_end"
                        style="width: 60px"
                      ></el-input-number>
                      <span>&nbsp; 小时，小于等于：</span>
                      <el-input-number
                        v-model="zItem.time_rule[2].time_end"
                        :controls="false"
                        size="small"
                        :min="zItem.time_rule[2].time_start"
                        style="width: 60px"
                      ></el-input-number>
                      <span>小时，转调休：</span>
                      <el-input-number
                        v-model="zItem.time_rule[2].hour"
                        :controls="false"
                        size="small"
                        :min="0"
                        style="width: 60px"
                      ></el-input-number>
                      <span>天</span>
                    </p>
                    <p>
                      <span>加班时长大于</span>
                      <el-input-number
                        v-model="zItem.time_rule[3].time_start"
                        :controls="false"
                        size="small"
                        :min="0"
                        style="width: 60px"
                      ></el-input-number>
                      <span>小时后的时长规则重复循环。</span>
                    </p>
                  </div>
                </el-form-item>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="padding: 10px 0 10px 30px; color: #31a7ff">通用设置</div>
        <div class="show-flex-box-r">
          <el-form-item label="加班时长单位:" prop="">
            <el-select
              style="width: 160px"
              v-model="form.jb_unit"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日折算时长:" prop="">
            <span>一天 &nbsp; = &nbsp;</span>
            <el-input
              v-model="form.jb_day_hour"
              placeholder=""
              style="width: 135px"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="form.jb_day_hour = Number($event.target.value)"
              size="mini"
            >
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {},
  data() {
    return {
      form: {
        id: "",
        name: "",
        group_name: "",
        type: "1",
        types: [
          {
            type: "1",
            label: "工作日",
            is_allow: 1, //是否允许加班 1是2否。默认1
            is_check: 1, //是否按照审批时长计算;1是2否。默认1
            is_deduct: 2, //是否扣除休息时间;1是2否。默认2
            deduct_type: 1, //是否扣除休息时间；1按休息时段扣除，2按加班时长扣除。 默认1
            cdeduct_start_date: "",
            deduct_end_date: "",
            deduct_condition: 0,
            deduct_hour: 0,
            is_fee: 2, //加班时长记为调休或加班费； 1是2否。默认2
            is_type: 1, //加班时长记为调休或加班费；1调休，2加班费，3员工自主选择。 默认1
            scale: 1,
            time_type: 1,
            time_rule: [
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
            ],
          },
          {
            type: "2",
            label: "休息日",
            is_allow: 1, //是否允许加班 1是2否。默认1
            is_check: 1, //是否按照审批时长计算;1是2否。默认1
            min_hour: 0,
            is_deduct: 2, //是否扣除休息时间;1是2否。默认2
            deduct_type: 1, //是否扣除休息时间；1按休息时段扣除，2按加班时长扣除。 默认1
            cdeduct_start_date: "",
            deduct_end_date: "",
            deduct_condition: 0,
            deduct_hour: 0,
            is_fee: 2, //加班时长记为调休或加班费； 1是2否。默认2
            is_type: 1, //加班时长记为调休或加班费；1调休，2加班费，3员工自主选择。 默认1
            scale: 1,
            time_type: 1,
            time_rule: [
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
            ],
          },
          {
            type: "3",
            label: "节假日",
            is_allow: 1, //是否允许加班 1是2否。默认1
            is_check: 1, //是否按照审批时长计算;1是2否。默认1
            min_hour: 0,
            is_deduct: 2, //是否扣除休息时间;1是2否。默认2
            deduct_type: 1, //是否扣除休息时间；1按休息时段扣除，2按加班时长扣除。 默认1
            cdeduct_start_date: "",
            deduct_end_date: "",
            deduct_condition: 0,
            deduct_hour: 0,
            is_fee: 2, //加班时长记为调休或加班费； 1是2否。默认2
            is_type: 1, //加班时长记为调休或加班费；1调休，2加班费，3员工自主选择。 默认1
            scale: 1,
            time_type: 1,
            time_rule: [
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
              {
                time_start: 0,
                time_end: 0,
                hour: 0,
              },
            ],
          },
        ],
        jb_unit: 1, //加班时长单位；1小时2天。默认1
        jb_day_hour: 8,
      },
      basicRules: {
        name: [
          { required: true, message: "请输入规则名称", trigger: "change" },
        ],
      },
      options: [
        { value: 1, label: "小时" },
        { value: 2, label: "天" },
      ],
    };
  },

  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        });
      }
    },
  },

  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 选择是否允许加班
    selectedSwitch(index, val) {
      this.form.types[index].is_allow == val
        ? (this.form.types[index].is_allow = 2)
        : (this.form.types[index].is_allow = val);
    },
    selectedSwitchSet(val) {
      this.form.is_set == val
        ? (this.form.is_set = 2)
        : (this.form.is_set = val);
    },
    // 增加设置
    addProportionSetList(zItem) {
      let obj = {
        min: "",
        max: "",
        value: "",
      };
      zItem.fees.splice(zItem.fees.length - 1, 0, obj);
    },
    deleteProportionSetList(zItem, index) {
      zItem.fees.splice(index, 1);
    },
    // 数据编辑回显示
    setData(info) {
      let val = JSON.parse(JSON.stringify(info));
      val.group_name = val.groups
        .map((item) => {
          return item.name;
        })
        .join(",");
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key];
          if (key == "types") {
            val.types.map((item) => {
              if (item.type == 1) {
                item.label = "工作日";
              }
              if (item.type == 2) {
                item.label = "休息日";
              }
              if (item.type == 3) {
                item.label = "节假日";
              }
              item.type = String(item.type);
            });
          }
        }
      }
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },

    // 校验分段计时
    checkHour(info) {
      let success = true;
      info.types.forEach((item) => {
        if (item.time_type === 2) {
          let list = item.time_rule;
          if (list[0].time_end > list[1].time_start) {
            success = false;
          } else if (list[1].time_start > list[1].time_end) {
            success = false;
          } else if (list[1].time_end > list[2].time_start) {
            success = false;
          } else if (list[2].time_start > list[2].time_end) {
            success = false;
          }
        }
      });

      return success;
    },

    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.form));
          delete info.group_name;
          delete info.type;
          info.types.forEach((element) => {
            element.type = Number(element.type);
            delete element.label;
          });
          let check = this.checkHour(info);
          if (!check) {
            this.$message({
              showClose: true,
              message: "分段计时前一项时间不能大于后一项时间",
              type: "warning",
            });
            return;
          }
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 650px;
}
</style>



