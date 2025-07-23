<template>
  <el-dialog :visible="dialogBool" :title="title" :before-close="dialogClose" width="870px">
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <div class="show-flex-box-r">
          <el-form-item label="假期名称:" prop="name">
            <el-input v-model="form.name" placeholder="请输入假期名称"></el-input>
          </el-form-item>
          <div></div>
          <el-form-item label="应用范围:" prop="dept_id">
            <el-input
              v-model="form.range"
              placeholder="请输入假期名称"
              disabled
              v-if="checked"
            ></el-input>
            <get-department-select
              ref="baseTree"
              :isContainEmp="false"
              :isShowCheckbox="false"
              :isExportMultiple="false"
              :funcType="''"
              v-model="form.dept_id"
              v-else
            ></get-department-select>
          </el-form-item>

          <el-checkbox
            v-model="checked"
            style="margin-left: 10px; margin-top: 5px"
            @change="selectedCompony"
          >
            默认全公司
          </el-checkbox>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="是否带薪休假:" prop="paid_leave">
            <el-select v-model="form.paid_leave" placeholder="请选择">
              <el-option label="带薪假" :value="1"></el-option>
              <el-option label="非带薪假" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <span style="line-height: 26px; color: #909399; margin-left: 150px; font-size: 12px">
            若员工请带薪假，将在考勤统计中算作出勤
          </span>
        </div>
        <div class="show-flex-box-r" style="padding: 15px">
          <i style="float: left; width: 6px; height: 18px; background: #409eff"></i>
          <strong style="font-size: 17px; margin-left: 10px">请假时长核算规则</strong>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="最小请假单位:" prop="min_unit">
            <el-select v-model="form.min_unit" placeholder="请选择">
              <el-option label="按天请假" :value="3"></el-option>
              <el-option label="按半天请假" :value="2"></el-option>
              <el-option label="按小时请假" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请假时长核算:" prop="time_calculate">
            <el-select v-model="form.time_calculate" placeholder="请选择">
              <el-option label="按工作日计算请假时长" :value="1"></el-option>
              <el-option label="按自然日计算请假时长" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r" style="font-size: 12px; margin-bottom: 15px">
          <span style="margin-left: 60px">
            员工以
            <strong style="color: #409eff">
              {{ form.min_unit == 3 ? '一天' : form.min_unit == 1 ? '小时' : '半天' }}
            </strong>
            为最小单位选择时间，考勤报表按
            <strong style="color: #409eff">
              {{ form.min_unit == 3 ? '天' : form.min_unit == 1 ? '时' : '天' }}
            </strong>
            统计
          </span>
          <span style="margin-left: 80px">
            请假时段中不包含员工的休息日，例如未排班的双休日，法定节假日
          </span>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="余额发放方式:" prop="distribution_way">
            <el-input
              v-model="form.distribution_way"
              placeholder="请输入余额发放方式"
              disabled
              style="width: 540px"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="发放日期:" prop="add_time">
            <el-select v-model="form.add_time" placeholder="请选择">
              <el-option label="每年1月1日" :value="1"></el-option>
              <el-option label="入职日期" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="额度配置规则:" prop="add_rule">
            <el-select v-model="form.add_rule" placeholder="请选择" @change="selectedAddRuleType">
              <el-option label="固定额度" :value="1"></el-option>
              <el-option label="按司龄（在本公司服务年限）" :value="2"></el-option>
              <el-option label="按工龄（司龄 + 外单位工龄）" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r" v-if="form.add_rule == 1">
          <el-form-item label="额度:" prop="childs">
            <span>每人每年发放</span>
            <el-input
              placeholder="请输入"
              v-model="fixedQuota.value"
              style="width: 150px"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="fixedQuota.value = $event.target.value"
              size="mini"
            >
              <template slot="append">天</template>
            </el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r" v-if="form.add_rule == 2">
          <el-form-item label="司龄配额:" prop="childs">
            <div class="set-proportion-box show-flex-box-c">
              <div
                class="set-proportion-start show-flex-box-r"
                style="align-items: center; margin-bottom: 15px"
              >
                <span>司龄小于&nbsp;</span>
                <el-input
                  v-model="startForm.end"
                  placeholder=""
                  style="width: 105px"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  size="mini"
                  @blur="startForm.end = $event.target.value"
                >
                  <template slot="append">年</template>
                </el-input>
                <span>&nbsp;，享有</span>
                <el-input
                  v-model="startForm.value"
                  placeholder=""
                  style="width: 120px"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="startForm.value = $event.target.value"
                  size="mini"
                >
                  <template slot="append">天</template>
                </el-input>
                <span>年假。</span>
              </div>

              <ul class="show-flex-box-c" v-if="proportionSetList.length > 0">
                <li
                  class="show-flex-box-r"
                  style="align-items: center; margin-bottom: 15px"
                  v-for="(item, index) in proportionSetList"
                  :key="index"
                >
                  <div class="show-flex-box-r" style="align-items: center; margin-right: 10px">
                    <span>司龄大于等于&nbsp;</span>
                    <el-input
                      v-model="item.start"
                      placeholder=""
                      style="width: 105px"
                      oninput="value=value.replace(/[^\d.-]/g,'')"
                      @blur="item.start = $event.target.value"
                      size="mini"
                    >
                      <template slot="append">年</template>
                    </el-input>
                    <span>&nbsp;，小于&nbsp;</span>
                    <el-input
                      v-model="item.end"
                      placeholder=""
                      style="width: 105px"
                      oninput="value=value.replace(/[^\d.-]/g,'')"
                      @blur="item.end = $event.target.value"
                      size="mini"
                    >
                      <template slot="append">年</template>
                    </el-input>
                    <span>&nbsp;，享有</span>
                    <el-input
                      v-model="item.value"
                      placeholder=""
                      style="width: 120px"
                      oninput="value=value.replace(/[^\d.-]/g,'')"
                      @blur="item.value = $event.target.value"
                      size="mini"
                    >
                      <template slot="append">天</template>
                    </el-input>
                    <span>年假。</span>
                  </div>
                  <span class="show-flex-box-r" v-if="index == proportionSetList.length - 1">
                    <el-button
                      type="primary"
                      icon="el-icon-circle-plus-outline"
                      size="mini"
                      @click="addProportionSetList"
                    ></el-button>
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="deleteProportionSetList(index)"
                    ></el-button>
                  </span>
                </li>
              </ul>
              <div class="show-flex-box-r" style="align-items: center; margin-bottom: 15px" v-else>
                <span>增加司龄配额设置: &nbsp;&nbsp;</span>
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  size="mini"
                  @click="addProportionSetList"
                ></el-button>
              </div>
              <div
                class="set-proportion-end show-flex-box-r"
                style="align-items: center; padding-bottom: 15px"
              >
                <span>司龄大于等于&nbsp;</span>
                <el-input
                  v-model="endForm.start"
                  placeholder=""
                  style="width: 105px"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="endForm.start = $event.target.value"
                  size="mini"
                >
                  <template slot="append">年</template>
                </el-input>
                <span>&nbsp;，享有</span>
                <el-input
                  v-model="endForm.value"
                  placeholder=""
                  style="width: 120px"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="endForm.value = $event.target.value"
                  size="mini"
                >
                  <template slot="append">天</template>
                </el-input>
                <span>年假。</span>
              </div>
            </div>
          </el-form-item>
        </div>

        <div class="show-flex-box-r">
          <el-form-item label="有效期:" prop="effective_date_dsc">
            <el-input
              v-model="form.effective_date_dsc"
              placeholder="请输入有效期"
              disabled
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="" prop="is_extend">
            <el-checkbox v-model="form.is_extend" @change="selectedIsExtend">
              允许延长有效期
            </el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="is_extend" v-if="form.is_extend">
            <div class="show-flex-box-r">
              <span style="margin-right: 10px">超过有效期后，余额保留</span>
              <div class="show-flex-box-r show-flex-center">
                <el-input
                  placeholder="请输入"
                  v-model="form.extend_day"
                  style="width: 80px; margin-right: 5px"
                  oninput="value=value.replace(/[^\d.-]/g,'')"
                  @blur="form.extend_day = $event.target.value"
                  size="mini"
                ></el-input>
                <el-radio-group v-model="extend_day_type" @change="seletedExtendDayType">
                  <el-radio :label="1">月</el-radio>
                  <el-radio :label="2">天</el-radio>
                </el-radio-group>

                <!-- <el-select v-model="extend_day_type" placeholder="请选择" id="extend-day-box">
                  <el-option label="月" :value="1"></el-option>
                  <el-option label="天" :value="2"></el-option>
                </el-select> -->
              </div>
            </div>
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect,},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      checked: true,
      form: {
        id: '',
        name: '年假',
        type: 5,
        dept_id: 0,
        paid_leave: 1,
        min_unit: 2,
        time_calculate: 1,
        add_time:  1,
        add_rule: 2,
        extend_day: '',
        childs:[
          {
            start: '',
            end: '',
            value:''
          }
        ],

        effective_date:'',
        range: '全公司',
        distribution_way: '每年自动发放1次',
        effective_date_dsc: '自发放日起一周年',
        is_extend: false
      },
      extend_day_type: 1,
      basicRules: {
        name: [
          { required: true, message: "请输入假期名称", trigger: "change" },
        ],
      },
      fixedQuota:{
        start: 0,
        end: "",
        value: "",
      },
      startForm: {
        start: 0,
        end: "",
        value: "",
      },
      endForm: {
        start: "",
        end: 0,
        value: "",
      },
      proportionSetList:[
        {
          start: '',
          end: '',
          value:'',
        }
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
    // extend_day_type() {
    //   if(this.extend_day_type == 1) {
    //     this.extend_day_type = this.form.extend_day /30
    //   }else{
    //     this.extend_day_type = this.form.extend_day*30
    //   }
    // }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 默认全公司部门id为0
    selectedCompony(val) {
      if(val) {
        this.form.dept_id = 0
      }
    },
    // 选择额度规则
    selectedAddRuleType(val) {
      // this.startForm.value = ''
    },
    // 选择月和天
    seletedExtendDayType(val) {
      if(val == 1) {
        this.form.extend_day = (this.form.extend_day/30).toFixed(2)
      }else{
        this.form.extend_day = (this.form.extend_day*30).toFixed(0)
      }
    },
    // 增加设置
    addProportionSetList() {
      let obj = {
        start: '',
        end: '',
        value:'',
      };
      this.proportionSetList.push(obj)
    },
    deleteProportionSetList(index) {
      this.proportionSetList.splice(index,1)
    },
    selectedIsExtend(val) {
      this.form.extend_day =  ''
    },
    // 编辑设置回显示
    setData(form) {
      let val = JSON.parse(JSON.stringify(form))
      // console.log(val)

      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.form[key];
          this.form[key] = val[key]
          if(key == 'childs') {
             let list = JSON.parse(JSON.stringify(val.childs))  || [];
            if(list.length > 1) {
              this.startForm = list[0];
              this.endForm = list.slice(-1)[0];
              this.startForm.start = 0
              this.endForm.end = 0;
              list.shift();
              list.pop();
              this.proportionSetList = list;
            }
          }
        }
      }
      if(Number(this.form.extend_day) > 0) {
        this.extend_day_type = 2
        this.form.is_extend = true
      }else{
        this.extend_day_type = 1
        this.form.is_extend = false
      }

      if(this.form.dept_id === 0) {
        this.checked = true
      }else{
        this.checked = false
      }

      if(this.form.add_rule == 1) {
        if(!!this.form.childs && this.form.childs.length) {
          this.fixedQuota = this.form.childs[0];
        }
      }

    },
    // 确定保存
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...{},...this.form};
          if(info.add_rule === 1) {
            if(this.fixedQuota.value === '') {
              this.$message({
                message: `“固定假天额度”为必填项`,
                type: 'warning'
              });
              return
            }
            let fixedQuota = {...{},...this.fixedQuota};
            fixedQuota.start = 0
            fixedQuota.end = 0
            info.childs = [fixedQuota]
          }
          if(info.add_rule === 2) {
            if(this.startForm.end === '') {
              this.$message({
                message: `第1行中的“司龄小于”为必填项`,
                type: 'warning'
              });
              return
            }
            if(this.startForm.value === '') {
              this.$message({
                message: `第1行中的“享有年假天数”为必填项`,
                type: 'warning'
              });
              return
            }

            try{
              this.proportionSetList.forEach((item,index) => {

                if(item.start === '') {
                  this.$message({
                    message: `第${index+2}行中的“司龄大于等于”为必填项`,
                    type: 'warning'
                  });
                  throw new Error("ending")
                }
                if(item.end === '' ) {
                  this.$message({
                    message: `第${index+2}行中的“司龄小于”为必填项`,
                    type: 'warning'
                  });
                  throw new Error("ending")
                }
                if(item.value === '') {
                  this.$message({
                    message: `第${index+2}行中的“享有年假天数”为必填项`,
                    type: 'warning'
                  });
                  throw new Error("ending")
                }

              })
            }catch(e) {
              if(e.message == "ending"){
                return
      　　  　}
            }

            if(this.endForm.start === '') {
              this.$message({
                message: `最后1行中的“司龄大于等于”为必填项`,
                type: 'warning'
              });
              return
            }
            if( this.endForm.value === '') {
              this.$message({
                message: `最后1行中的“享有年假天数”为必填项`,
                type: 'warning'
              });
              return
            }
            let childsRules = [...this.proportionSetList]
            if(this.startForm.end) {
              childsRules.unshift(this.startForm)
            }
            if(this.endForm.start && this.endForm.value) {
              childsRules.push(this.endForm)
            }
            info.childs = childsRules
          }
          if(info.is_extend) {
            if(this.extend_day_type == 1) {
              info.extend_day = info.extend_day*30
            }
          }else{
            info.extend_day = 0
          }

          delete info.effective_date
          delete info.range
          delete info.distribution_way
          delete info.effective_date_dsc
          delete info.is_extend
          // console.log(info)
          // return

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
  height: 400px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 420px;
}

.el-dialog-div /deep/ .el-date-editor {
  width: 200px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 200px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 200px;
}

.el-dialog-div /deep/ .el-textarea {
  width: 620px;
}
</style>
