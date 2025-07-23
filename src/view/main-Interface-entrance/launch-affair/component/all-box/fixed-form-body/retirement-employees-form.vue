<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="姓名" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择姓名'"
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
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="changeDept" placeholder="请选择所在部门">
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
        <el-form-item label="性别" prop="sex">
          <el-input style="width:100%" disabled v-model="form.sex"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="出生年月" prop="brith_date">
          <el-input style="width:100%" disabled v-model="form.brith_date"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="政治面貌" prop="political_outlook">
          <el-input style="width:100%" disabled v-model="form.political_outlook"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="进公司日期" prop="join_date">
          <el-input style="width:100%" disabled v-model="form.join_date"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="拟退休日期" prop="retire_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择拟退休日期"
            v-model="form.retire_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="健康情况" prop="health">
          <el-input style="width:100%" v-model="form.health"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="原职位" prop="old_position">
          <el-input style="width:100%" disabled v-model="form.old_position"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="拟返聘职位" prop="position">
          <el-input style="width:100%" v-model="form.position" placeholder="请输入拟返聘职位"></el-input>
          <!-- <el-select v-model="form.position" clearable style="width:100%" placeholder="请选择拟返聘职位" >
            <el-option
              v-for="item in postitionList"
              :key="item.i_id"
              :label="item.c_name"
              :value="item.i_id">
            </el-option>
          </el-select> -->
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="办理结果" prop="result">
          <el-input style="width:100%" v-model="form.result"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否签订返聘协议" prop="is_agreement">
          <el-select v-model="form.is_agreement" style="width:100%" placeholder="请选择是否签订返聘协议">
            <el-option
              v-for="item in competentList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="返聘开始期限" prop="rehire_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择返聘开始期限"
            v-model="form.rehire_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="返聘结束期限" prop="rehire_end_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择返聘结束期限"
            v-model="form.rehire_end_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload
          :images="form.thumbnail_imgs"
          :files="form.file_list"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import imageFileUpload from "@/components/imageFileUpload/index";
import { formatTime, deepCopy } from "@/utils/index"
import { getUser } from '@/utils/auth';
import common from './common/index'
export default {
  name: "employment-contact-form",
  components: {
    getDepartmentSelect,
    imageFileUpload,
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
        dept_id: null,
        sex: '',
        d_birthday: '',
        c_political: '',
        d_join_company: '',
        retire_date: '',
        health: '',
        old_position: '',
        position: '',
        result: '',
        is_agreement: '',
        rehire_date: '',
        rehire_end_date: '',
        file_list: [],
        thumbnail_imgs: [],
        id: 0
      },
      oldForm: null, // 历史草稿数据   用来比较是否修改
      dept_ids: [],
      deptList: [],
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择离职人员",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
        // sex: [
        //   {
        //     required: true,
        //     message: "请选择性别",
        //     trigger: "change",
        //   },
        // ],
        // brith_date: [
        //   {
        //     required: true,
        //     message: "请选择出生年月",
        //     trigger: "change",
        //   },
        // ],
        // political_outlook: [
        //   {
        //     required: true,
        //     message: "请选择政治面貌",
        //     trigger: "change",
        //   },
        // ],
        retire_date: [
          {
            required: true,
            message: "请选择拟退休日期",
            trigger: "change",
          },
        ],
        health: [
          {
            required: true,
            message: "请输入健康情况",
            trigger: "change",
          },
        ],
        old_position: [
          {
            required: true,
            message: "请选择原职位",
            trigger: "change",
          },
        ],
        position: [
          {
            required: true,
            message: "请输入拟返聘职位",
            trigger: "change",
          },
        ],
        // result: [
        //   {
        //     required: true,
        //     message: "请输入办理结果",
        //     trigger: "change",
        //   },
        // ],
        // is_agreement: [
        //   {
        //     required: true,
        //     message: "请选择是否签订返聘协议",
        //     trigger: "change",
        //   },
        // ],
      },

      dept_id: null,
      changeNum: 0,

      competentList: [
        {
          value: 1,
          label: '是'
        },
        {
          value: 2,
          label: '否'
        },
      ],
      postitionList: []
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
    },
  },
  created() {
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
    // 获取用户信息
    getListSysPerson(id){
      this.$client.getEmployeeManageDetail({id}).then(req => {
        if (req.head.result === "200") {
          this.form.old_position = req.context.position_job
          this.form.sex = req.context.gender == 0 ? '男' : '女'
          this.form.brith_date = req.context.date_of_birth
          this.form.political_outlook = req.context.political_landscape
          this.form.join_date = req.context.enter_unit_time
        }
      })
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
    
      this.getListSysPerson(this.form.user_id)
      // 保存一下初始化数据 作为保存草稿时的比对数据
      if (this.changeNum <= 1) {
        this.oldForm = deepCopy(this.form)
      }
      // this.get_position_post(this.form.dept_id)
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
    changeDept() {
      // this.get_position_post(this.form.dept_id)
      this.dateChange()
    },
    // 获取职位
    get_position_post(dept_id) {
      this.$client.getSysPositionList({dept_id})
        .then(res => {
          if (res.head.result == "200") {
              this.postitionList = res.context.list
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
  },
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
.list-data-list
  flex-wrap: wrap;
  align-items: center;
  .list-data
    // width: 450px
    overflow: hidden
  .item
    float: left
    width: 100px
    height: 100px
    margin: 5px
  .unchecked
    border-radius: 4px
    border: 2px dashed #606266
    text-align: center
    line-height: 130px
    &:hover
      border-color: #409EFF
      color: #409EFF
</style>
