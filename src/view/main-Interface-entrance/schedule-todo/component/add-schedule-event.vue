<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    append-to-body
    width="600px">
    <el-form :model="form" :rules="basicRules" ref="form" label-width="100px" size="mini">
      <el-form-item label="日程所属:" prop="type_id">
        <el-select v-model="form.type_id" style="width: 460px;" clearable placeholder="请选择日程所属">
          <el-option
            v-for="item in scheduleOptions"
            :key="item.id"
            :label="item.schedule_type"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="时间:" prop="date">
        <!-- <el-date-picker
          v-model="date"
          v-if="form.is_all_day"
          type="daterange"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="selectedTime">
        </el-date-picker>
          v-else -->
        <el-date-picker
          v-model="date"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          @change="selectedTime">
        </el-date-picker>
         <!-- <el-checkbox :true-label="1" v-model="form.is_all_day" :false-label="0" @change="selectTimeOrDay">全天</el-checkbox> -->
      </el-form-item>
      <el-form-item label="日程重复:" prop="repeat_type">
        <el-select v-model="form.repeat_type" style="width: 460px;" placeholder="请选择重复周期">
          <el-option
            v-for="item in duplicationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!!form.repeat_type && form.repeat_type != 210">
        <p style="margin-bottom: 5px;">
          重复频率：每<el-input v-model="count" @blur="count = $event.target.value" oninput="value=value.replace(/[^\d.-]/g,'')" style="width: 60px"></el-input>
          <span>{{form.repeat_type == 220 ? '天' : form.repeat_type == 230 ? '周' : form.repeat_type == 240 ? '月' : '年'}}</span>
          <span v-if="form.repeat_type == 240">
            第<el-input v-model="form.month_day" @change="changeSelectMonthDay" @blur="form.month_day = $event.target.value" oninput="value=value.replace(/[^\d.-]/g,'')" style="width: 60px"></el-input>天
          </span>
        </p>
        <p style="margin-bottom: 5px;" v-if="form.repeat_type == 230">
          <el-radio-group v-model="form.i_week_day" @change="changeSelectWeekDay">
            <el-radio-button :label="1">一</el-radio-button>
            <el-radio-button :label="2">二</el-radio-button>
            <el-radio-button :label="3">三</el-radio-button>
            <el-radio-button :label="4">四</el-radio-button>
            <el-radio-button :label="5">五</el-radio-button>
            <el-radio-button :label="6">六</el-radio-button>
            <el-radio-button :label="0">日</el-radio-button>
          </el-radio-group>
        </p>
        <p style="margin-bottom: 5px;">
          结束重复：
          <el-select v-model="form.plan_type" style="width: 120px;" placeholder="请选择重复周期">
            <el-option
              v-for="item in customOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-date-picker
            v-model="form.end_date"
            type="date"
            style="width: 140px;"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            v-if="form.plan_type == 620"
            placeholder="选择日期">
          </el-date-picker>
          <span v-if="form.plan_type == 630">
            <el-input v-model="form.end_count" @blur="form.end_count = $event.target.value" oninput="value=value.replace(/[^\d.-]/g,'')" style="width: 60px"></el-input>次后
          </span>
        </p>
        <p>
          日程时长：<el-input v-model="form.time" style="width: 60px;"></el-input>
        </p>
      </el-form-item>
      <el-form-item label="参与人员:" prop="user_ids">
        <get-department-select
          ref="personalTree"
          v-model="form.user_ids"
          :isShowCheckbox="true"
          :placeholder="'请选择参与人员'"
          :isContainEmp="true"
          :show_all="true"
          :isExportMultiple="true"
        ></get-department-select>
      </el-form-item>
      <el-form-item label="地点:" prop="address">
        <el-input v-model="form.address" placeholder="请输入地点"></el-input>
      </el-form-item>
      <el-form-item label="详情:" prop="detail">
          <el-input
          v-model="form.detail" 
          type="textarea"
          maxlength="200"
          :rows="4"
          show-word-limit
          placeholder="请输入详情"></el-input>
      </el-form-item>
      <el-form-item label="查看权限:" prop="look_power">
        <el-select v-model="form.look_power" style="width: 460px;" placeholder="请选择查看权限">
          <el-option
            v-for="item in lookOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提醒规则:" prop="remind_rule">
        <el-select v-model="form.remind_rule" style="width: 228px;" :multiple-limit="4" collapse-tags multiple placeholder="请选择提醒规则">
          <el-option
            v-for="item in reminderRuleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="form.remind_type" style="width: 228px;" collapse-tags multiple placeholder="请选择提醒方式">
          <el-option
            v-for="item in reminderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import {getWeekDay, formatTime, getDate, formatDate} from "@/utils"
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "添加",
    },
    curSelectedType: [String],
  },
  data() {
    return {
      date: [],
      form: {
        id: 0,
        type_id: '',
        title: '',
        start_time: '',
        end_time: '',
        is_all_day: 0,
        repeat_type: 210,
        day_count: 0,
        week_count: 0, //每几周
        i_week_day: 0, //每几周周几
        month_count: 0,
        month_day: 0,
        year_count: 0,
        plan_type: 610,
        end_date: '',
        end_count: 0,
        time: 60,
        user_ids: [],
        address: '',
        detail: '',
        look_power: 320,
        remind_rule: [440],
        remind_type: [510, 530],
      },
      count: 0,
      basicRules: {
        type_id: [
          { required: true, message: "请选择日程所属", trigger: "change" },
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "change" },
        ],
        // schedule_time: [
        //   { required: true, message: "请选择日程时间", trigger: "change" },
        // ],
        repeat_type: [
          { required: true, message: "请选择日程重复", trigger: "change" },
        ],
        detail: [
          { required: true, message: "请输入详情", trigger: "change" },
        ],
        look_power: [
          { required: true, message: "请选择查看权限", trigger: "change" },
        ],
      },
      scheduleOptions: [],
      duplicationOptions: [
        {id: 1, value: 210, label: '一次性事件'},
        {id: 2, value: 220, label: '每天'},
        // {id: 3, value: 230, label: '每周'},
        // {id: 4, value: 240, label: '每月'},
        // {id: 5, value: 250, label: '每年'},
      ],
      lookOptions: [
        {id: 1, value: 310, label: '仅自己可见'},
        {id: 2, value: 320, label: '参与人员可见'},
      ],
      reminderRuleOptions: [
        {id: 1, value: 410, label: '不提醒'},
        {id: 2, value: 420, label: '开始时'},
        {id: 3, value: 430, label: '开始前5分钟'},
        {id: 4, value: 440, label: '开始前15分钟'},
        {id: 5, value: 450, label: '开始前30分钟'},
        {id: 6, value: 460, label: '开始前1小时'},
        {id: 7, value: 470, label: '开始前2小时'},
        {id: 8, value: 480, label: '开始前1天'},
        {id: 9, value: 490, label: '开始前2天'},
      ],
      reminderOptions: [
        {id: 1, value: 510, label: 'WEB端提醒'},
        {id: 2, value: 520, label: 'APP提醒'},
        {id: 3, value: 530, label: '小程序提醒'},
      ],
      customOptions: [
        {id: 1, value: 610, label: '无限重复'},
        {id: 2, value: 620, label: '终止于某一天'},
        {id: 3, value: 630, label: '限定次数'},
      ],
    }
  },
  mounted() {
    // 根据日期获取日程重复选中list
    this.setDuplicationOptions()
    // 获取日程类型列表
    this.getScheduleTypeList()
    let userInfo = JSON.parse(getUser());
    this.form.user_ids = [Number(userInfo.user_id)]
    this.setDate()
  },
  watch: {
    dialogBool(bool) {
      if(bool == false) {
        this.$refs['form'].resetFields();
        Object.assign(this.$data.form, this.$options.data().form);
      }else {
        if(this.curSelectedType == 'add') {
          let userInfo = JSON.parse(getUser());
          this.form.user_ids = [Number(userInfo.user_id)]
          this.setDate()
        }
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setDate() {
      let obj = getDate('today')
      let hour = new Date().getHours()
      let start = obj.startTime + ' ' + (hour +  1) + ':' + '00'
      let end = obj.endTime + ' ' + (hour +  2) + ':' + '00'
      this.date= [formatDate(start,'yyyy-MM-dd hh:mm'),formatDate(end,'yyyy-MM-dd hh:mm')]
      // this.date = [obj.startTime + ' ' + (hour +  1) + ':' + '00', obj.endTime + ' ' + (hour +  2) + ':' + '00', ]
    },
    // 是否选中全天
    selectTimeOrDay(val) {
      // if(!val && this.date) {
      //   if(this.date[0].length < 16 || this.date[1].length < 16) {
      //     let hour = new Date().getHours()
      //     this.date = [this.date[0] + ' ' + (hour +  1) + ':' + '00', this.date[0] + ' ' + (hour +  2) + ':' + '00', ]
      //   }
      // }
    },
    // 选中时间判断时间大小
    selectedTime(val) {
      if(!!val) {
        let start = new Date(this.date[0]).getTime()
        let end = new Date(this.date[1]).getTime()
        if (start > end) {
          this.$message({
            showClose: true,
            message: "开始时间不能小于结束时间,请从新选择",
            type: "warning",
          });
          this.date = ""
          return false
        }
        this.form.time = Math.floor((end - start) / 60000)
        console.log(this.form.time, start, end);
      }else {
        this.form.time = ''
      }
    },
    // 获取日程类型列表
    getScheduleTypeList() {
      this.$client.GetTypeScheduleManage({})
        .then(res => {
          this.loading = false; 
          if (res.head.result == "200") {
            this.scheduleOptions = JSON.parse(JSON.stringify(res.context[0].sysSchedules))
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 根据日期获取日程重复选中list
    setDuplicationOptions(day) {
      let time = day ? new Date(day) : new Date()
      this.duplicationOptions.forEach(item => {
        switch (item.label) {
          case '每周':
            item.label += ('(每周' + getWeekDay(day) + ')')
            this.form.i_week_day = time.getDay()
            break;
          case '每月':
            item.label += '(每月的第' + time.getDate() + '天)'
            this.form.month_day = time.getDate()
            break;
          case '每年':
            item.label += ('(' + formatTime(time).slice(5, 10) + ')')
            break;
          default:
            break;
        }
      })
    },
    // 编辑回显
    setData(info) {
      setTimeout(() => {
        for(let key in this.form) {
          if(info[key]) {
            this.form[key] = info[key]
          }
        }
        this.date = [info.start_time, info.end_time]
        switch (info.repeat_type) {
          case 210:
            this.count = 0
            break;
          case 220:
            this.count = info.day_count
            break;
          case 230:
            this.count = info.week_count
            break;
          case 240:
            this.count = info.month_count
            break;
          case 250:
            this.count = info.year_count
            break;
          default:
            break;
        }
      }, 300);
    },

    // 提交
    updatePlaybill(formName) {
      if(!this.date) {
        this.$message.error('请选择日程时间')
        return false
      }
      let start = new Date(this.date[0]).getTime()
      let end = new Date(this.date[1]).getTime()
      // console.log(Math.floor((end - start) / 3600000));
      if(this.form.repeat_type != 210 && Math.floor((end - start) / 3600000) > 24) {
        this.$message.error('仅支持时长在24小时内的日程重复')
        return false
      }
      this.form.start_time = this.date[0]
      this.form.end_time = this.date[1]
      if(this.form.repeat_type == 220) {
        this.form.day_count = this.count
      }else if(this.form.repeat_type == 230) {
        this.form.week_count = this.count
      }else if(this.form.repeat_type == 240) {
        this.form.month_count = this.count
      }else if(this.form.repeat_type == 250) {
        this.form.year_count = this.count
      }
      // return
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(new Date(this.date[0]) < new Date()) {
            let str = this.title == '编辑日程' ? '是否更改为一个过去时间的日程?' : '是否创建一个过去时间的日程?'
            this.$confirm(str, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let info = {...this.form};
              this.$emit("save-add-edit", info);
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              });          
            });
          }else {
            let info = {...this.form};
            this.$emit("save-add-edit", info);
          }
        } else {
          return false;
        }
      });
    },
    // 修改每月第多少天
    changeSelectMonthDay(val) {
      if(val > 31) {
        this.form.month_day = 31
        this.$message.warning('每月最多31天')
      }
      this.duplicationOptions[3].label = '每月(每月的第' + val + '天)'
    },
    // 修改每周周几
    changeSelectWeekDay(val) {
      switch (val) {
        case 1:
          this.duplicationOptions[2].label = '每周(每周一)'
          break;
        case 2:
          this.duplicationOptions[2].label = '每周(每周二)'
          break;
        case 3:
          this.duplicationOptions[2].label = '每周(每周三)'
          break;
        case 4:
          this.duplicationOptions[2].label = '每周(每周四)'
          break;
        case 5:
          this.duplicationOptions[2].label = '每周(每周五)'
          break;
        case 6:
          this.duplicationOptions[2].label = '每周(每周六)'
          break;
        case 0:
          this.duplicationOptions[2].label = '每周(每周日）'
          break;
      
        default:
          break;
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
