<template>
  <el-form ref="form" size="mini" :rules="rules" :model="form" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <!-- <user-role-tree :is_contain_emp="true" v-model="form.user_id"></user-role-tree> -->
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
          <!-- <get-department-select
            ref="departmentlTree"
            v-model="form.dept_id"
            :width="'220'"
            :isShowCheckbox="false"
            :placeholder="'请选择所在部门'"
            :isContainEmp="false"
            :isExportMultiple="false"
            :disabled="true"
          ></get-department-select> -->
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" placeholder="请选择申请部门">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="24">
        <el-form-item label="加班类型" prop="over_type">
          <el-select v-model="form.over_type" @change="changeSelectDate" style="width:100%" clearable placeholder="请选择加班类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
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
      <el-col v-if="form.overTimeDayDetails.length" :span="24" style="margin-bottom: 18px">
        <p style="font-size:12px; color: #999; padding: 5px 0;">为了方便统计，请填写每日加班时长</p>
        <el-table
          border
          stripe
          highlight-current-row
          :size="'mini'"
          style="width: 100%"
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
              <el-input-number v-model="scope.row.hour" @change="setAllOverTime(scope.row, scope.$index)" :min="0" :step="0.5" step-strictly :max="24" label="描述文字" size="mini" :controls="false" :precision="2"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <el-form-item label="时长(小时)" prop="hour">
          <el-input-number v-model="form.hour" :controls="false" :precision="2"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12" v-if="isShow">
        <el-form-item label="补偿类型" prop="compensate" >
          <el-select v-model="form.compensate" style="width: 100%;" placeholder="请选择补偿类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申请事由" prop="reason">
          <el-input type="textarea" v-model="form.reason"></el-input>
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
  components: {
    UserRoleTree, 
    imageFileUpload, 
    getAllDeptUserTree
  },
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
        // over_type: '',
        start_time: '',
        end_time:'',
        hour: 0,
        compensate: '',
        reason: '',
        files: [],
        files_list: [],
        thumbnail_imgs: [],
        overTimeDayDetails: [],
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      days: 0,
      options: [
        {label: "工作日加班", value: 1},
        {label: "周末值班", value: 2}
      ],
      typeList: [
        {label: "计为调休", value: 1},
        {label: "计为加班费", value: 2},
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
        reason: [
          {
            required: true,
            message: "请输入申请事由",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,
      deptList:[]
    }
  },
  created() {
  },
  mounted() {},
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

        let startDate = this.form.start_time.slice(0, 10), endDate = this.form.end_time.slice(0, 10)
        this.days = getDistanceDays(startDate, endDate)
        console.log(startDate, endDate, this.days);
        // if(this.form.over_type === 2) {
        //   this.form.hour = this.days + 1
        // }else {
          if(startDate == endDate) {
            // 获取此用户的加班规则
            this.getWorkOverTime()
          }else {
            let arr = startDate.split('-')
            let num = 0
            let date = ''
            for(let k = 0; k < this.days + 1; k++) {
              console.log((Number(arr[1])+k-1));
              num = Number(arr[2]) + k
              date = formatTime(new Date(arr[0], arr[1] - 1, num))
              this.form.overTimeDayDetails.push({
                'over_time': date,
                'hour': 0
              })
            }
          }
        // }
      }
    },
    setAllOverTime(row, index) {
      // console.log(row, index);
      let params = {
        user_id: this.form.user_id,
        date: row.over_time,
        hour: row.hour
      }
      this.$client.GetDayMaxHourOaWorkOvertime(params).then(res => {
        if (res.head.result === "200") {
          if(res.context < row.hour) {
            this.$message.warning('已扣除正常班次时间，已扣除不计入加班的时段')
            this.form.overTimeDayDetails[index].hour = res.context
          }else{
            this.form.overTimeDayDetails[index].hour = row.hour
          }
          setTimeout(() => {
            this.form.hour = this.form.overTimeDayDetails.reduce((pre, item) => {
              return pre += item.hour
            }, 0)
          }, 30);
          if (this.form.hour) {
            this.dateChange()
          }
        } else {
          this.$message({message: res.head.describle, type: "error",});
        }
      }).catch(e => {
        // console.log(e);
        this.$message({message: '服务异常', type: "error",});
      })
    },
    // 获取加班时间
    getWorkOverTime() {
      let params ={
        user_id: this.form.user_id || Number(JSON.parse(getUser()).user_id),
        start: this.form.start_time,
        end: this.form.end_time
      }
      this.$client.GetTimesDataOaWorkOvertime(params).then(res => {
        if (res.head.result === "200") {
          this.form.hour = res.context
          if (this.form.hour) {
            this.dateChange()
          }
        } else {
          this.$message({message: res.head.describle, type: "error",});
        }
      }).catch(e => {
        // console.log(e);
        this.$message({message: '服务异常', type: "error",});
      })
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
        Object.assign(this.$data.form, this.$options.data().form);
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
