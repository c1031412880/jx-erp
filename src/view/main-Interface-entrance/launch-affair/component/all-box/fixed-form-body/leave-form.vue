<template>
  <el-form
    ref="form"
    size="mini"
    class="leave-form"
    :model="form"
    :rules="rules"
    label-width="90px"
  >
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <!-- <get-department-select
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
          ></get-department-select> -->
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
        <el-form-item label="申请部门" prop="dept_id">
          <el-select
            v-model="form.dept_id"
            :disabled="!deptList.length"
            style="width: 100%"
            @change="dateChange"
            placeholder="请选择申请部门"
          >
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="请假类型" prop="type">
          <el-col :span="24">
            <get-select-dictionaries
              style="width: 100%"
              v-model="form.type"
              :clearable="false"
              @on-change="changeType"
              :classKey="'oa-leave-type'" 
              :placeholder="'请选择请假类型'" 
            ></get-select-dictionaries>
          </el-col>
          <!-- 假期余额显示 -->
          <el-col :span="4" v-if="form.type === leaveTypes.ANNUAL">
            <el-button type="text" size="mini">剩余天数：{{ days }}天</el-button>
          </el-col>
          <el-col :span="4" v-if="form.type === leaveTypes.MARRIAGE">
            <el-button type="text" size="mini">剩余天数：{{ marryDays }}天</el-button>
          </el-col>
          <el-col :span="4" v-if="form.type === leaveTypes.COMPENSATORY">
            <el-button @click="balanceVisible = true" type="text" size="mini">
              剩余天数：{{ compensatoryDays }}天
            </el-button>
          </el-col>
          <el-col :span="4" v-if="form.type === leaveTypes.PARENTAL">
            <el-button type="text" size="mini">剩余天数：{{ parentalDays }}天</el-button>
          </el-col>
          <el-col :span="4" v-if="form.type === leaveTypes.ONLY_CHILD">
            <el-button type="text" size="mini">剩余天数：{{ onlyChildDays }}天</el-button>
          </el-col>
          <el-col :span="4" v-if="form.type === leaveTypes.NURSING">
            <el-button type="text" size="mini">剩余天数：{{ nursingDays }}天</el-button>
          </el-col>
        </el-form-item>
      </el-col>
      <div>
        <el-col :span="24">
          <el-form-item prop="start_date" label="开始时间">
            <el-col :span="11">
              <el-date-picker
                @change="timeChange"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                v-model="form.start_date"
                :picker-options="pickerOptions"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-select v-model="form.start_time" @change="timeChange">
                <el-option
                  v-for="item in dataOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="end_date" label="结束时间">
            <el-col :span="11">
              <el-date-picker
                @change="timeChange"
                :clearable="false"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
                v-model="form.end_date"
                :picker-options="pickerOptions"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-select v-model="form.end_time" @change="timeChange" prop="end_time">
                <el-option
                  v-for="item in dataOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </div>
      <el-col :span="24">
        <el-form-item label="时长(天)">
          <el-input-number
            v-model="form.day"
            :step="0.5"
            step-strictly
            :controls="false"
            :precision="2"
          ></el-input-number>
          天
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
          @images-update-success="imagesUpdateSuccess"
        ></image-file-upload>
      </el-col>
    </el-row>

    <el-dialog width="80%" title="调休余额明细" append-to-body :visible.sync="balanceVisible">
      <transfer-balance-details
        :user_id="form.user_id"
        :visible="balanceVisible"
        @on-close="onCloseDialog"
        :day="Number(compensatoryDays)"
      ></transfer-balance-details>
    </el-dialog>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import multipleFilesUpload from "@/components/multiple-files-upload";
import imageFileUpload from "@/components/imageFileUpload/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import getAllDeptUserTree from "@/components/base/formModel/tree/get-all-dept-user-tree";
import transferBalanceDetails from "./component/transfer-balance-details"
import { getUser } from "@/utils/auth";
import { deepCopy, getDate } from "@/utils/index";
import common from './common/index'
export default {
  name: "leave-form",
  components: {
    getDepartmentSelect,
    multipleFilesUpload,
    imageFileUpload,
    getSelectDictionaries,
    getAllDeptUserTree,
    transferBalanceDetails
  },
  mixins: [common],
  props: {
    dialogBool:{
      type: Boolean,
      default: false
    },
    isShowSelectUser: {
      type: Boolean,
      default: false
    },
    isAgain: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      form: {
        user_id:null,
        dept_id:null,
        start_date: '',
        start_time: 1,
        end_date:'',
        end_time: 2,
        day: 0,
        reason: '',
        flow_id: '',
        type: '',
        files_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      days: 0,                // 年假剩余天数
      marryDays: 0,           // 婚假剩余天数
      compensatoryDays: 0,    // 调休剩余天数
      parentalDays: 0,        // 育儿假剩余天数
      onlyChildDays: 0,       // 独生子女假剩余天数
      nursingDays: 0,         // 护理假剩余天数
      dataOptions: [
        {label: '上午', value: 1},
        {label: '下午', value: 2},
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
        type: [
          {
            required: true,
            message: "请选择请假类型",
            trigger: "change",
          },
        ],
        start_date: [
          {
            required: true,
            message: "请选择请假开始时间",
            trigger: "change",
          },
        ],
        end_date: [
          {
            required: true,
            message: "选择请假结束时间",
            trigger: "change",
          },
        ],
        reason: [
          {
            required: true,
            message: "请填写申请事由",
            trigger: "change",
          },
        ],
      },
      dept_id: null,
      changeNum: 0,
      deptList: [],
      boolType: false,
      balanceVisible: false,
      // 假期类型常量
      LEAVE_TYPES: {
        ANNUAL: 5,      // 年假
        MARRIAGE: 6,    // 婚假
        PARENTAL: 11,   // 育儿假
        ONLY_CHILD: 12, // 独生子女假
        COMPENSATORY: 13, // 调休
        NURSING: 14     // 护理假
      },
      // 需要年份限制的假期类型名称
      YEAR_LIMITED_TYPES: ['年假', '调休', '育儿假', '独生子女陪护父母假', '护理假'],
      
      /* 
        扩展新假期类型步骤：
        1. 在 LEAVE_TYPES 中添加新的假期类型常量
        2. 在 data 中添加对应的余额字段
        3. 在 getYearBalance 方法中添加映射关系
        4. 在模板中添加余额显示逻辑（使用 leaveTypes.新类型）
        5. 如需年份限制，在 YEAR_LIMITED_TYPES 中添加类型名称
        
        示例：添加病假(ID: 4)
        1. LEAVE_TYPES: { SICK: 4, ... }
        2. data: { sickDays: 0, ... }
        3. typeFieldMap: { [this.LEAVE_TYPES.SICK]: 'sickDays', ... }
        4. template: <el-col v-if="form.type === leaveTypes.SICK">...
      */
    }
  },
  computed: {
    pickerOptions() {
      const  _this = this;
      return {
        disabledDate(time){
          // 禁用非当前年份的日期
          return _this.boolType ? time.getFullYear() !== new Date().getFullYear() : false;
        }
      }
    },
    // 提供模板访问常量的计算属性
    leaveTypes() {
      return this.LEAVE_TYPES;
    },
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
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        let obj = getDate('today')
        this.form.start_date = obj['startTime']
        this.form.end_date = obj['endTime']
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          console.log(userInfo);
          this.form.user_id =  Number(userInfo.user_id)
          this.dept_id = Number(userInfo.department_id);
        }
      }
        // 获取所有假期余额
        this.getAllLeaveBalances()
        // 获取调休余额（调休使用单独接口）
        this.getCompensatoryById(this.form.user_id)

      this.timeChange()
    },
    // 选择时间获取请假时长
    timeChange() {
      if (!this.form.start_date || !this.form.end_date) {
        return false
      }
      let timeStart = new Date(this.form.start_date).getTime()
      let timeEnd = new Date(this.form.end_date).getTime()

      let time = timeEnd - timeStart

      let start_time = this.form.start_time
      let end_time = this.form.end_time

      // 校验
      if (time < 0) {
        this.$message({message: '结束时间不能小于开始时间', type: "error",});
        this.form.end_date = ''
        return false
      } else if((time === 0) && (start_time > end_time)){
        this.$message({message: '结束时间不能小于开始时间', type: "error",});
        this.form.end_date = ''
        return false
      }

      let day = time / (60 * 60 * 24 * 1000)

      if (start_time == end_time) {
        day += 0.5
      }else if (start_time == 1 && end_time == 2) {
        day += 1
      }

      this.form.day = day

      this.dateChange()
    },
    /**
     * 获取假期余额
     * @param {number} type - 假期类型ID
     */
    getYearBalance(type) {
      // 支持的假期类型
      const supportedTypes = [
        this.LEAVE_TYPES.ANNUAL,
        this.LEAVE_TYPES.MARRIAGE,
        this.LEAVE_TYPES.PARENTAL,
        this.LEAVE_TYPES.ONLY_CHILD,
        this.LEAVE_TYPES.NURSING
      ];
      
      // 假期类型与数据字段映射
      const typeFieldMap = {
        [this.LEAVE_TYPES.ANNUAL]: 'days',
        [this.LEAVE_TYPES.MARRIAGE]: 'marryDays',
        [this.LEAVE_TYPES.PARENTAL]: 'parentalDays',
        [this.LEAVE_TYPES.ONLY_CHILD]: 'onlyChildDays',
        [this.LEAVE_TYPES.NURSING]: 'nursingDays'
      };

      if (!supportedTypes.includes(type) || !this.form.user_id) {
        return;
      }

      this.$client.GetYearBalanceByUserLeaveBalance({
        user_id: this.form.user_id,
        type: type
      }).then(res => {
        if (res.head.result === "200") {
          const fieldName = typeFieldMap[type];
          if (fieldName) {
            this[fieldName] = res.context;
          }
        } else {
          this.$message({message: res.head.describle, type: "error"});
        }
      }).catch(e => {
        this.$message({message: '服务异常', type: "error"});
      });
    },

    /**
     * 批量获取假期余额
     * @param {Array} types - 假期类型数组，默认获取所有支持的类型
     * 注意：调休(COMPENSATORY)使用单独的接口getCompensatoryById
     */
    getAllLeaveBalances(types = null) {
      const defaultTypes = [
        this.LEAVE_TYPES.ANNUAL,
        this.LEAVE_TYPES.MARRIAGE,
        this.LEAVE_TYPES.PARENTAL,
        this.LEAVE_TYPES.ONLY_CHILD,
        this.LEAVE_TYPES.NURSING
      ];
      
      const targetTypes = types || defaultTypes;
      targetTypes.forEach(type => {
        this.getYearBalance(type);
      });
    },
    // 获取调休余额
    getCompensatoryById(id) {
      this.$client.getCompensatoryById({user_id: id}).then(res => {
        if (res.head.result === "200") {
          this.compensatoryDays = res.context
          // this.$message({message: res.head.describle, type: "success",});
        } else {
          this.$message({message: res.head.describle, type: "error",});
        }
      }).catch(e => {
          this.$message({message: '服务异常', type: "error",});
        })
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
      console.log(userIds, nodes,parentNode);
      if(!nodes) {
        this.form.dept_id = ''
        return false
      }
      let dept_id = null
      this.changeNum ++
      if (this.changeNum > 1) {
        if(userIds.length > 0 && !!parentNode) {
          dept_id = parentNode.i_id
        }
      } else {
      // 若有草稿  则部门为草稿中部门   若无草稿 则为主部门
        dept_id = this.dept_id
      }

      // 获取所有假期余额
      this.getAllLeaveBalances()
      // 获取调休余额（调休使用单独接口）
      this.getCompensatoryById(this.form.user_id)
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
    onCloseDialog() {
      this.balanceVisible = false
      this.$emit('on-close')
    },
    changeType(val) {
      // 获取当前假期类型余额
      this.getYearBalance(this.form.type)
      this.dateChange()
      
      // 检查是否需要年份限制
      this.boolType = this.YEAR_LIMITED_TYPES.includes(val.c_name)
      
      // 如果需要年份限制，清空超出当前年份的日期
      if (this.boolType) {
        const year = new Date().getFullYear()
        const oneDay = year + '-01-01'
        const endDay = year + '-12-31'
        
        if (this.form.start_date && (this.form.start_date < oneDay || this.form.start_date > endDay)) {
          this.form.start_date = ''
        }
        if (this.form.end_date && (this.form.end_date < oneDay || this.form.end_date > endDay)) {
          this.form.end_date = ''
        }
      }
    },
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    }
  }
}

/* 
  代码优化要点：
  
  ✓ 使用常量避免硬编码（LEAVE_TYPES、YEAR_LIMITED_TYPES）
  ✓ 映射对象替代switch语句，提升可读性
  ✓ 批量获取余额方法，减少重复调用
  ✓ 统一错误处理和参数校验
  ✓ 提供清晰的扩展指南和示例
  
  新增假期类型只需4步：修改常量→添加字段→更新映射→添加模板
*/
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.leave-form {
  .over {
    /deep/ .el-input__inner {
      cursor: pointer;
      background-color: #fff
    }
  }
}
</style>
