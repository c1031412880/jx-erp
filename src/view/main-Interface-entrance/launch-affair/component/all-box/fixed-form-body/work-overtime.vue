<template>
  <el-form ref="form" size="mini" :rules="rules" :model="form" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <get-all-dept-user-tree
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择申请人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
            :clearable="false"
          ></get-all-dept-user-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在部门" prop="dept_id">
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" placeholder="请选择申请部门"  @change="dateChange">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            v-model="form.start_time"
            :clearable="false"
            @change="changeSelectDate"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期"
            v-model="form.end_time"
            :clearable="false"
            @change="changeSelectDate"
            style="width: 100%;"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24" v-if="days" style="margin-bottom:20px;">
        <p style="font-size:12px; color: #999; padding: 5px 0;">为了方便统计，请填写每日加班时长</p>
        <el-table
          border
          stripe
          highlight-current-row
          :size="'mini'"
          style="width: 100%;"
          :row-key="getRowKeys"
          :cell-style="{fontSize: '13px', padding: '2px 0px'}"
          :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '2px 0px',fontWeight: '700'}"
          :data="form.overTimeDayDetails">
          <el-table-column
            min-width="180"
            align="center">
            <template slot="header">
              <span style="color:red;">*</span> <span>加班时间</span>
            </template>
            <template slot-scope="scope">
              <span>{{scope.row.over_time}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="180"
            align="center">
            <template slot="header">
              <span style="color:red;">*</span> <span>(小时)</span>
            </template>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.hour" @change="changeTotalHour(scope.row, scope.$index)" :min="0" :step="0.5" step-strictly :max="24" label="描述文字" size="mini" :controls="false" :precision="1"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <el-form-item label="加班人员" prop="overtime_user_ids">
          <get-all-dept-user-tree
            ref="personalTree"
            v-model="form.overtime_user_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择加班人员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :clearable="true"
          ></get-all-dept-user-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="补偿类型" prop="compensate" >
          <el-select v-model="form.compensate" style="width: 100%;" :clearable="false" placeholder="请选择补偿类型" @change="dateChange">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <p v-show="form.compensate == 1" style="float:right; color: #333333; font-size: 14px; font-weight: 500; line-height: 14px;">
            <span>转调休( </span>
            <span style="color: red;">{{ form.leave_days }}</span>
            <span> )天</span>
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="'总时长(小时)'" prop="hour">
          <el-input-number v-model="form.hour" style="width: 100%;" :min="0" :precision="1" :controls="false" :step="0.5" step-strictly></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <p style="font-size: 12px;color: #999;line-height: 16px;">加班时长达3小时及以上可提交加班申请。连续加班3小时（含）以上5小时（含）以内可享受半天调休假；5小时以上可享受1天调休假，以此累加。</p>
      </el-col>
      <el-col :span="24">
        <el-form-item label="加班事由" prop="reason">
          <el-input type="textarea" v-model="form.reason" placeholder="请输入加班事由"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          :isEdit="true"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import UserRoleTree from "@/components/base/formModel/tree/user-role-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import getAllDeptUserTree from "@/components/base/formModel/tree/get-all-dept-user-tree";
import { getUser } from '@/utils/auth'
import {formatTime, deepCopy, getDistanceDays} from '@/utils/index'
import common from './common/index'
export default {
  name: "work-overtime-form",
  components: {UserRoleTree, imageFileUpload, getAllDeptUserTree},
  mixins: [common],
  props: {
    dialogBool:{
      type: Boolean,
      default: false
    },
    isShowSelectUser: {
      type: Boolean,
      default: true
    },
    isAgain: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      getRowKeys(row){
        return row.over_time
      },
      isShow: false,
      
      form: {
        id: 0,
        user_id: null,
        dept_id: null,
        start_time: '',
        end_time:'',
        hour: 0,
        leave_days: 0, // 转调休天数
        compensate: 1,
        reason: '',
        overtime_user_ids: [],
        files_list: [],
        thumbnail_imgs: [],
        overTimeDayDetails: [],
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      days: 0,
      typeList: [
        {label: "计为加班费", value: 2},
        {label: "计为调休", value: 1}
      ],
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择申请人",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择申请部门",
            trigger: "change",
          },
        ],
        // over_type: [
        //   {
        //     required: true,
        //     message: "请选择加班类型",
        //     trigger: "change",
        //   },
        // ],
        start_time: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change",
          },
        ],
        end_time: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: "change",
          },
        ],
        overtime_user_ids: [
          {
            required: true,
            message: "请选择加班人员",
            trigger: "change",
          },
        ],
        reason: [
          {
            required: true,
            message: "请输入加班事由",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,
      deptList:[]
    }
  },
  methods: {
    // 初始化数据
    initSet(info){
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key];
          }
        }
        this.days = info.overTimeDayDetails ? info.overTimeDayDetails.length : 0
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.form.overtime_user_ids = [Number(userInfo.user_id)];
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 返回提交体
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          let isTrue = false
          let msg = '获取失败,带星号的为必填项'
          if(this.days <= 1 && !this.form.hour) {
            isTrue = true
            msg = '请选择有效时间'
          }
          if(this.form.overTimeDayDetails.length) {
            for(let i = 0; i < this.form.overTimeDayDetails.length; i++) {
              if(!this.form.overTimeDayDetails[i].hour || !this.form.overTimeDayDetails[i].over_time) {
                isTrue = true
                msg = '加班时长不能为0'
              }
            }
          }
          if (valid && !isTrue) {
            let info = JSON.parse(JSON.stringify(this.form))
            resolve({
              form: info
            });
          } else {
            reject({
              msg: msg
            });
            return false;
          }
        });
      });
    },
    // 计算天数
    changeSelectDate() {
      if(this.form.start_time && this.form.end_time) {
        this.form.overTimeDayDetails = []
        this.form.hour = 0
        if(this.form.start_time >= this.form.end_time) {
          this.$message.warning('开始时间不能大于等于结束时间，请重新选择')
          this.form.end_time = ''
          return
        }
        // 获取时间天数
        let startDate = this.form.start_time.slice(0, 10), endDate = this.form.end_time.slice(0, 10)
        this.days = getDistanceDays(startDate, endDate)
        // console.log(this.days);
        if(this.days) {
          let arr = startDate.split('-')
          let num = 0
          let date = ''
          for(let k = 0; k < this.days + 1; k++) {
            // console.log((Number(arr[1])+k-1));
            num = Number(arr[2]) + k
            date = formatTime(new Date(arr[0], arr[1] - 1, num))
            this.form.overTimeDayDetails.push({
              'over_time': date,
              'hour': 0
            })
          }
        }else {
          this.form.hour = (new Date(this.form.end_time).getTime() - new Date(this.form.start_time).getTime())/1000/3600
          if (this.form.hour >= 3 && this.form.hour <= 5) {
            // 3-5小时(含)，半天调休
            this.form.leave_days = 0.5;
          } else if (this.form.hour > 5) {
            // 5小时以上，1天调休
            this.form.leave_days = 1;
          }
          // console.log(this.form, this.leave_days);
        }
      }
    },
    // 计算总时间
    changeTotalHour(row, index) {
      // 清除之前的定时器
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      
      // 设置防抖定时器
      this.debounceTimer = setTimeout(() => {
        // 初始化总加班小时数和调休天数
        let valid = true;
        let totalOvertimeHours = 0;
        this.form.leave_days = 0;
        
        // 计算总加班小时数并确定可调休天数
        this.form.overTimeDayDetails.forEach((dayDetail) => {
          // 验证hour值是否有效
          if (typeof dayDetail.hour !== 'number' || isNaN(dayDetail.hour) || dayDetail.hour < 0) {
            valid = false;
            return;
          }
          
          // 累加总加班小时数
          totalOvertimeHours += dayDetail.hour;
          
          // 根据加班时长计算可调休天数
          if(dayDetail.hour >= 3 && dayDetail.hour < 5) {
            this.form.leave_days += 0.5; // 3-5小时(含)，半天调休
          } else if(dayDetail.hour >= 5) {
            this.form.leave_days += 1; // 5小时以上，1天调休
          }
        });
        
        if (valid) {
          // 更新表单中的总加班小时数
          this.form.hour = totalOvertimeHours;
        } else {
          // 如果有无效值，给出提示
          this.$message.error('请输入有效的加班时长');
        }
      }, 300); // 300毫秒防抖
    },
    // 获取用户是否显示补偿类型
    handleIsType(user_id) {
      let params = {
        user_id: user_id
      }
      this.$client.GetByUserIdOaWorkOvertime(params).then(res => {
        if(res.head.result == '200') {
          this.isShow = !!res.context ? true : false
        }
      })
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
      if(!nodes) {
        this.form.dept_id = ''
        return false
      }
      let dept_id = null
      let user_id = null
      this.changeNum ++ 
      if (this.changeNum > 1) {
        if(userIds.length > 0 && !!parentNode) {
          dept_id = parentNode.i_id
          // this.handleIsType()
        }
      } else {
      // 若有草稿  则部门为草稿中部门   若无草稿 则为主部门
        dept_id = this.dept_id
        user_id = this.form.user_id
      }

      // if (user_id) {
      //   this.handleIsType(user_id)
      // }
      this.deptList = await this.GetUserDept(this.form.user_id)
      this.form.dept_id = dept_id
      // 保存一下初始化数据 作为保存草稿时的比对数据
      if (this.changeNum <= 1) {
        this.oldForm = deepCopy(this.form)
      }
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree.onClear();
        // this.$refs.departmentlTree.onClear();
        Object.assign(this.$data, this.$options.data().form);
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
