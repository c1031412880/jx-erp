<template>
  <el-form ref="form" size="mini" class="leave-driver-form" :model="form" :rules="rules"  label-width="90px">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="person_id">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.person_id"
            :isShowCheckbox="false"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="false"
            @on-change="selectedUser"
            :clearable="false"
          ></get-driver-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请部门" prop="dept_id">
           <!-- <el-select v-model="form.dept_id" style="width:100%" @change="dateChange" placeholder="请选择申请部门">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select> -->
          <el-input v-model="form.dept_name" disabled></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="请假类型" prop="type">
          <el-col :span="24">
            <get-select-dictionaries 
              style="width:100%"
              v-model="form.type" 
              :clearable="false"
              @on-change="changeLeaveType"
              :classKey="'oa-driver-leave-type'" 
              :placeholder="'请选择请假类型'" 
            ></get-select-dictionaries>
          </el-col>
          <el-col :span="4" v-if="form.type_name === '年假' || form.type_name === '育儿假' || form.type_name === '独生子女陪护假'">
            <el-button type="text" size="mini">剩余天数：{{ days }}天</el-button>
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
                style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-select v-model="form.start_time" @change="timeChange">
                <el-option
                  v-for="item in dataOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
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
                style="width: 100%;"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2" style="text-align: center">-</el-col>
            <el-col :span="11">
              <el-select v-model="form.end_time" @change="timeChange" prop="end_time">
                <el-option
                  v-for="item in dataOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </div>
      <el-col :span="24">
        <el-form-item label="时长(天)">
          <el-input-number v-model="form.day" :controls="false" :precision="2"></el-input-number>天
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
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import multipleFilesUpload from "@/components/multiple-files-upload";
import imageFileUpload from "@/components/imageFileUpload/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import { getUser } from "@/utils/auth";
import { deepCopy, getDate } from "@/utils/index";
import common from './common/index'
export default {
  name: "leave-driver-form",
  components: {
    getDriverSelectTree,
    multipleFilesUpload,
    imageFileUpload,
    getSelectDictionaries
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
        person_id:null,
        dept_id:null,
        dept_name:null,
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
      days: 0,
      compensatoryDays: 0,
      dataOptions: [
        {label: '上午', value: 1},
        {label: '下午', value: 2},
      ],
      rules: {
        person_id: [
          {
            required: true,
            message: "请选择申请人",
            trigger: "change",
          },
        ],
        // dept_id: [
        //   {
        //     required: true,
        //     message: "请选择申请部门",
        //     trigger: "change",
        //   },
        // ],
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
      dept_name: null,
      changeNum: 0,
      deptList: []
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
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
        this.dept_name = JSON.parse(JSON.stringify(info.dept_name))
      } else {
        let obj = getDate('today')
        this.form.start_date = obj['startTime']
        this.form.end_date = obj['endTime']
      }
      if (this.form.person_id) {
        // 获取年假
        this.getYearBalance(this.form.type)
      }

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
    // 获取年假余额
    getYearBalance(type) {
      this.$client.GetYearBalanceByUserLeaveBalance({user_id: this.form.person_id, type: type}).then(res => {
        if (res.head.result === "200") {
          this.days = res.context
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
        this.form.dept_name = ''
        return false
      }
      let dept_id = null
      let dept_name = null
      this.changeNum ++ 
      if (this.changeNum > 1) {
        if(userIds.length > 0 && !!nodes) {
          dept_id = nodes[0].parent_id
          dept_name = nodes[0].parent_name
        }
      } else {
      // 若有草稿  则部门为草稿中部门   若无草稿 则为主部门
        dept_id = this.dept_id
        dept_name = this.dept_name
      }
      
      if(this.form.person_id && this.form.type) {
        this.getYearBalance(this.form.type)
      }
      this.form.dept_id = dept_id
      this.form.dept_name = dept_name

      // 保存一下初始化数据 作为保存草稿时的比对数据
      if (this.changeNum <= 1) {
        this.oldForm = deepCopy(this.form)
      }
      this.dateChange()
    },
    // GetUserDept(user_id) {
    //   return this.$client.GetUserDept({user_id}).then(res => res.context)
    // },
    changeLeaveType(val, type) {
      this.form.type_name = val.c_name
      if(this.form.person_id) {
        this.getYearBalance(this.form.type)
        this.dateChange()
      }
    }
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

<style rel="stylesheet/stylus" lang="stylus" scoped>
  .leave-driver-form {
    .over {
      /deep/ .el-input__inner {
        cursor: pointer;
        background-color: #fff
      }
    }
  }
</style>
