<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择经办人'"
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
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="dateChange" placeholder="请选择所在部门">
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
        <el-form-item label="申请日期" prop="req_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择申请日期"
            v-model="form.req_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
           <el-input type="textarea" show-word-limit v-model="form.remark" :rows="4" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24" class="table-box">
        <div style="display: flex;align-items:center;margin-bottom:5px">
          <h2 style="margin-right:10px">新进员工明细</h2>
          <el-button type="primary" size="small" @click="add()">新增行</el-button>
          <el-button type="primary" size="small" @click="copy()">复制行</el-button>
          <el-button type="primary" size="small" @click="del()">删除</el-button>
          <!-- <el-button type="primary" size="small">导入模板</el-button> -->
        </div>
        <tr-table
          ref="table"
          :selectionShow="true"
          :data="form.details"
          :tableHeaderList="customSettingListCopy"
          :TableHeight="300"
          @on-select-row="selectedRowInfo"
          @on-select-change-row="handleSelectionChange">
          <template slot-scope="scope" slot="name">
            <el-input v-model="scope.data.name" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="age">
            <el-input v-model="scope.data.age" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="license">
            <el-input v-model="scope.data.license" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="test">
            <el-select v-model="scope.data.test" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="checkup">
            <el-select v-model="scope.data.checkup" clearable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope" slot="result">
            <el-input v-model="scope.data.result" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="address">
            <el-input v-model="scope.data.address" clearable></el-input>
          </template>
          <template slot-scope="scope" slot="dept_company">
            <get-department-select
              ref="baseTree"
              :isShowCheckbox="false"
              :funcType="1"
              :placeholder="'分公司'"
              :isExportMultiple="false"
              v-model="scope.data.dept_company"
            ></get-department-select>
              <!-- @on-change="selectedDeparment(scope.index)" -->
          </template>
          <template slot-scope="scope" slot="position">
            <el-input v-model="scope.data.position" placeholder="请输入职位" ></el-input>
          </template>
          <!-- <template slot-scope="scope" slot="position">
            <el-select v-model="scope.data.position" clearable placeholder="请选择职位" >
              <el-option
                v-for="item in scope.data.postitionList"
                :key="item.i_id"
                :label="item.c_name"
                :value="item.i_id">
              </el-option>
            </el-select>
          </template> -->
        </tr-table>
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
  name: "new-employee-allocation-form",
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
        req_date: '',
        remark: '',
        files_list: [],
        thumbnail_imgs: [],
        details:[],
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      deptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择经办人",
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
        req_date: [
          {
            required: true,
            message: "请选择申请日期",
            trigger: "change",
          },
        ],
      },

      approvalFormVisible: false,
      key: null,

      dept_id: null,
      changeNum: 0,

      customSettingListCopy: [
        {
          id: 1,
          label: "*姓名",
          prop: "name",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "年龄",
          prop: "age",
          width: "100",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "驾照",
          prop: "license",
          width: "120",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "考试情况",
          prop: "test",
          width: "120",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "体检情况",
          prop: "checkup",
          width: "120",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "结果",
          prop: "result",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "家庭住址",
          prop: "address",
          width: "200",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "分配分公司",
          prop: "dept_company",
          width: "150",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "职位",
          prop: "position",
          width: "150",
          align: "center",
          signIndex: 8,
        },
      ],
      options: [
        {
          label: '合格',
          value: 1
        },
        {
          label: '不合格',
          value: 2
        },
      ],
      copyInfo: null,
      rowIndex: null,
      ids: [],
      timer: {},
      indexList: []
    }
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

        if (this.form.details.length > 0) {
          this.getTableIndex()
        }

        console.log('=======',JSON.parse(JSON.stringify(this.form.details)));
      } else {
        this.form.req_date = formatTime(new Date())
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
    // 改变分公司
    selectedDeparment(index) {
      let dept_id = this.form.details[index].dept_company
      // 每一行只调用一次
      if (this.indexList.indexOf(index) == -1) {
        this.timer[index] = null
        this.throttle(this.get_position_post,500,this.timer[index],[dept_id,index])()
        this.indexList.push(index)
      }
    },
     // 获取职位
    get_position_post(...args) {
      let dept_id = args[0]
      let index = args[1]
      this.$client.getSysPositionList({dept_id})
        .then(res => {
          if (res.head.result == "200") {
              let list = res.context.list.map(item => {
                return {
                  i_id: item.i_id,
                  c_name: item.c_name
                }
              })
              this.form.details[index].postitionList = list
              // 调用完成后 需 去掉这一行index
              this.indexList = this.indexList.filter(item => {return item != index})
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
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
      this.form.details.push({
        name: '',
        age: '',
        license: '',
        test: '',
        checkup: '',
        result: '',
        address: '',
        dept_company: '',
        position: '',
        postitionList: []
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
      this.form.details.splice(this.rowIndex,0,row)
      this.getTableIndex()
      this.copyInfo = null
      this.$refs.table.cancelSelectRow()
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
      this.form.details = this.form.details.filter(item => {return this.ids.indexOf(item.index) == -1})
      this.getTableIndex()
    },

    // 组装表格获取index下标
    getTableIndex() {
      this.form.details.forEach((item,index) => {
        item.index = index
      })
    },
    // 节流  减少接口的频繁调用
    throttle(fn, delay = 100,timer = null) {
      let list = arguments
      let that = this
      return function() {
          if(timer) {
              return;
          }
          timer = setTimeout(() => {
              fn.apply(this, list[3]);
              timer = null;
          }, delay)
      }
    }
  },
   
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
</style>
