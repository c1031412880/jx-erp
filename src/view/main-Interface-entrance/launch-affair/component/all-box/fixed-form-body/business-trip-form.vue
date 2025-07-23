<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择申请人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所在部门" prop="dept_id">
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="dateChange" placeholder="请选择发送部门">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="出差人员" prop="trip_user_ids">
          <get-department-select
            ref="personalTree2"
            v-model="form.trip_user_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择出差人员'"
            :isContainEmp="true"
            :isExportMultiple="true"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="出行方式" prop="way_ids">
          <!-- <get-select-dictionaries 
            style="width:100%"
            v-model="form.way_ids" 
            @change="dateChange"
            :classKey="'oa-work-type'" 
            :placeholder="'请选择申请类型'" 
            :isMultiple="true"
          ></get-select-dictionaries> -->
          <el-select v-model="form.way_ids"  multiple placeholder="请选择出行方式" style="width: 100%">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"> 
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
       <el-col :span="24">
        <el-form-item label="车牌号" prop="vehicle_name" v-if="form.way_ids.includes(1) || form.way_ids.includes(5)">
           <el-input v-model="form.vehicle_name" placeholder="请输入车牌号"></el-input>
        </el-form-item>
      </el-col>
       <el-col :span="24">
        <el-form-item label="总时长（天）" prop="duration">
           <el-input disabled v-model="form.duration" placeholder="请输入总时长"></el-input>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20"  v-for="(item,index) in form.trip_details" :key="index">
      <el-col :span="24">
        <span style="font-size: 16px; font-weight: bold;color: #333;padding-right: 20px">出差明细(<span style="color: red;">{{index + 1}}</span>)</span>
        <el-button type="text" size="mini" @click="addDetail(index)">增加</el-button>
        <el-button v-if="!!index" @click="deleteDetail(index)" type="text" size="mini">删除</el-button>
        <span v-else style="font-size: 14px; margin-left: 10px; color: #999999">说明：如需要添加多个出差地点，请点击“增加”</span>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出差始发地" :prop="'trip_details.'+ index +'.start_address'" :rules="[{required: true,message: '请输入始发地',trigger: 'change'}]">
          <el-input v-model="item.start_address" placeholder="请输入出差始发地"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出差目的地" :prop="'trip_details.'+ index +'.end_address'" :rules="[{required: true,message: '请输入目的地',trigger: 'change'}]">
          <el-input v-model="item.end_address" placeholder="请输入出差目的地"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开始时间" :prop="'trip_details.'+ index +'.start_date'" :rules="[{required: true,message: '请选择开始时间',trigger: 'change'}]">
          <div style="display: flex; width: 100%">
            <el-date-picker
              @change="sumTravelDay(index)"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width:240px"
              v-model="item.start_date"></el-date-picker>
            <el-select v-model="item.start_time" @change="sumTravelDay(index)" style="width:105px">
              <el-option
                v-for="el in dataOptions"
                :key="el.value"
                :label="el.label"
                :value="el.value">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结束时间" :prop="'trip_details.'+ index +'.end_date'" :rules="[{required: true,message: '请选择结束时间',trigger: 'change'}]">
          <div style="display: flex; width: 100%">
            <el-date-picker
              @change="sumTravelDay(index)"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width:240px"
              v-model="item.end_date"></el-date-picker>
            <el-select v-model="item.end_time" @change="sumTravelDay(index)" style="width:105px">
              <el-option
                v-for="el in dataOptions"
                :key="el.value"
                :label="el.label"
                :value="el.value">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="时长(天)" :prop="'trip_details.'+ index +'.duration'">
          <el-input-number :controls="false" v-model="item.duration" :min="0" style="width:100%" @change="getAllDuration"></el-input-number>
        </el-form-item>
      </el-col>
    </el-row>


      <!-- <el-col :span="24" class="table-box">
        <div style="display: flex;align-items:center;margin-bottom:5px">
          <h2 style="margin-right:10px">出差地点</h2>
          <el-button type="primary" size="small" @click="add()">新增行</el-button>
          <el-button type="primary" size="small" @click="copy()">复制行</el-button>
          <el-button type="primary" size="small" @click="del()">删除</el-button>
        </div>
        <tr-table
          ref="table"
          :selectionShow="true"
          :data="form.trip_details"
          :tableHeaderList="customSettingListCopy"
          :TableHeight="300"
          @on-select-row="selectedRowInfo"
          @on-select-change-row="handleSelectionChange">
          <template slot-scope="scope" slot="start_address">
            <el-input v-model="scope.data.start_address" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="end_address">
            <el-input v-model="scope.data.end_address" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="start_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="scope.data.start_date"
              @change="changeTime(scope.index)"
              style="width: 100%;">
            </el-date-picker>
            <el-row>
              <el-col :span="13">
                <el-date-picker
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  v-model="scope.data.start_date"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">-</el-col>
              <el-col :span="9">
                <el-select v-model="scope.data.start_time" prop="end_time">
                  <el-option
                    v-for="item in dataOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </template>
          <template slot-scope="scope" slot="end_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="scope.data.end_date"
              @change="changeTime(scope.index)"
              style="width: 100%;">
            </el-date-picker>
            <el-row>
              <el-col :span="13">
                <el-date-picker
                  :clearable="false"
                  value-format="yyyy-MM-dd"
                  format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  v-model="scope.data.end_date"
                  style="width: 100%"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">-</el-col>
              <el-col :span="9">
                <el-select v-model="scope.data.end_time" prop="end_time">
                  <el-option
                    v-for="item in dataOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-row>
          </template>
          <template slot-scope="scope" slot="duration">
            <el-input :min="0" :controls="false" v-model="scope.data.duration" style="width:100%" clearable @change="getAllDays"></el-input>
          </template>
        </tr-table>
      </el-col> -->
    <el-row>
      <el-col :span="24">
        <el-form-item label="申请事由" prop="trip_reason">
           <el-input type="textarea" v-model="form.trip_reason" :rows="4" placeholder="请输入申请事由"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload 
          :images="form.thumbnail_imgs"
          :files="form.files_list"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';  
import common from './common/index'
export default {
  name: "business-trip-form",
  components: {
    getDepartmentSelect,
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
      default: true
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
        way_ids: [],
        trip_user_ids: [],
        vehicle_name: '',
        duration: 0,
        trip_details: [
          {
            start_address: '',
            end_address: '',
            start_date: '',
            start_time: 1,
            end_date:'',
            end_time: 2,
            duration: 0,
          }
        ],
        files_list: [],
        thumbnail_imgs: [],
        trip_reason: '',
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      deptList: [],
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
        trip_user_ids: [
          {
            required: true,
            message: "请选择出差人员",
            trigger: "change",
          },
        ],
        way_ids: [
          {
            required: true,
            message: "请选择出行方式",
            trigger: "change",
          },
        ],
        duration: [
          {
            required: true,
            message: "请输入总时长（天）",
            trigger: "change",
          },
        ],
        trip_reason: [
          {
            required: true,
            message: "请输入申请事",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,

      customSettingListCopy: [
        {
          id: 1,
          label: "*出差始发地",
          prop: "start_address",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "出差目的地",
          prop: "end_address",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "开始时间",
          prop: "start_date",
          width: "250",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "结束时间",
          prop: "end_date",
          width: "250",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "时长（天）",
          prop: "duration",
          width: "100",
          align: "center",
          signIndex: 4,
        },
      ],

      copyInfo: null,
      rowIndex: null,
      ids: [],

      options: [
        {label: "自驾出行", value: 1},
        {label: "铁路出行", value: 2},
        {label: "飞机出行", value: 3},
        {label: "汽车大巴出行", value: 4},
        {label: "公车出行", value: 5},
      ],
      dataOptions: [
        {label: '上午', value: 1},
        {label: '下午', value: 2},
      ],
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree.onClear();
        this.$refs.personalTree2.onClear();
        Object.assign(this.$data.form, this.$options.data().form);
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
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
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
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
    selectedRowInfo(row, column,event) {
      this.copyInfo = row 
      this.rowIndex = row.index
    },
    handleSelectionChange(rows) {
      this.ids = []
      rows.forEach(item => {
        this.ids.push(item.index)
      })
    },
    // 添加
    add() {
      this.form.trip_details.push({
        start_address: '',
        end_address: '',
        start_date: '',
        end_date: '',
        duration: 0,
      })
      this.getTableIndex()
    },
    // 复制
    copy() {
      if (!this.copyInfo) {
        this.$message({
          showClose: true,
          message: "请先选中需要复制的信息",
          type: "warning",
        });
        return
      }
      let row = JSON.parse(JSON.stringify(this.copyInfo))
      this.form.trip_details.splice(this.rowIndex,0,row)
      this.getTableIndex()
      this.copyInfo = null
      this.$refs.table.cancelSelectRow()
      this.getAllDays()
    },
    // 删除
    del() {
      if (this.ids.length == 0) {
        this.$message({
          showClose: true,
          message: "请先选中需要删除的信息",
          type: "warning",
        });
        return
      }
      this.form.trip_details = this.form.trip_details.filter(item => {return this.ids.indexOf(item.index) == -1})
      this.getTableIndex()
    },

    // 组装表格获取index下标
    getTableIndex() {
      this.form.trip_details.forEach((item,index) => {
        item.index = index
      })
    },
    // 获取出差时长
    changeTime(index) {
      if (!this.form.trip_details[index].start_date || !this.form.trip_details[index].end_date) {
        return
      }
      let start = new Date(this.form.trip_details[index].start_date).getTime()
      let end = new Date(this.form.trip_details[index].end_date).getTime()

      if (start > end) {
        this.$message({
          showClose: true,
          message: "开始时间不能小于结束时间",
          type: "warning",
        });
        this.form.trip_details[index].end_date = ""
        return
      }

      let time = end - start

      if (time == 0) {
        this.form.trip_details[index].duration = 1
      } else {
        this.form.trip_details[index].duration = time / (1000 * 60 * 60 *24) + 1
      }
      this.getAllDays()
    },
    // 获取总时长
    getAllDays() {
      this.form.duration = 0 
      this.form.trip_details.forEach(item => {
        this.form.duration += Number(item.duration)
      })
      this.dateChange()
    },

    // 增加出差地点
    addDetail(index) {
      let obj = {
        start_address: '',
        end_address: '',
        start_date: '',
        start_time: 1,
        end_date:'',
        end_time: 2,
        duration: 0,
      }
      this.form.trip_details.push(obj)
    },
    // 删除明细
    deleteDetail(index){
      this.form.trip_details.splice(index,1)
    },
    // 计算出差时间
    sumTravelDay(index, val) {
      console.log(index, val);
      if (!this.form.trip_details[index].start_date || !this.form.trip_details[index].end_date) {
        return false
      }
      if(new Date(this.form.trip_details[index].end_date) < new Date(this.form.trip_details[index].start_date)) {
        this.$message.warning('结束时间不能小于开始时间，请重新选择')
        this.form.trip_details[index].end_date = ''
      }
      if((this.form.trip_details[index].end_date == this.form.trip_details[index].start_date) && (this.form.trip_details[index].start_time == 2 && this.form.trip_details[index].end_time == 1)) {
        this.$message.warning('日期相同,更改为默认上下午')
        this.form.trip_details[index].start_time = 1
        this.form.trip_details[index].end_time = 2
      }
      if(this.form.trip_details[index].start_time == 1 && this.form.trip_details[index].end_time == 1 || (this.form.trip_details[index].start_time == 2 && this.form.trip_details[index].end_time == 2)) {
        this.form.trip_details[index].duration = (Date.parse(this.form.trip_details[index].end_date) - Date.parse(this.form.trip_details[index].start_date) + 24*3600*1000)/(24*3600*1000) - 0.5
      }else if((this.form.trip_details[index].start_time == 2 && this.form.trip_details[index].end_time == 1)) {
        this.form.trip_details[index].duration = (Date.parse(this.form.trip_details[index].end_date) - Date.parse(this.form.trip_details[index].start_date) + 24*3600*1000)/(24*3600*1000) - 1
      }else {
        this.form.trip_details[index].duration = (Date.parse(this.form.trip_details[index].end_date) - Date.parse(this.form.trip_details[index].start_date) + 24*3600*1000)/(24*3600*1000)
      }
      this.getAllDuration()
      this.dateChange()
    },

    getAllDuration() {
      this.form.duration = this.form.trip_details.reduce((prev, cur, index, arr) => {
        return prev + cur.duration;
      }, 0)
    },
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.table-box /deep/ {
  .el-input__prefix {
    display: none
  }
  .el-input--prefix .el-input__inner {
    padding-left: 5px;
  }
}
</style>
