<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree1"
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
        <el-form-item label="姓名" prop="work_user">
          <get-driver-select-tree
            ref="personalTree2"
            v-model="form.work_user"
            :isShowCheckbox="false"
            :placeholder="'请选择姓名'"
            :isExportMultiple="false"
            @on-change="getDriverInfo"
          ></get-driver-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别" prop="sex">
          <el-input style="width:100%" disabled v-model="form.sex"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证" prop="ic_card">
          <el-input style="width:100%" disabled v-model="form.ic_card"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="职位" prop="position_name">
          <el-input style="width:100%" disabled v-model="form.position_name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="工号" prop="work_code">
          <el-input style="width:100%" disabled v-model="form.work_code"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="驾驶证号" prop="license_code">
          <el-input style="width:100%" disabled v-model="form.license_code"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="驾驶证等级" prop="driver_level">
          <el-input style="width:100%" disabled v-model="form.driver_level"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="form.remark" :rows="4" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="分配意见" prop="opinion">
          <div style="width:100%;display:flex">
            <span>自</span>
            <get-department-select
              :disabled="true"
              ref="departmentTree"
              v-model="form.opinion"
              :isShowCheckbox="false"
              :isContainEmp="false"
              :isExportMultiple="false"
            ></get-department-select>
            <span>安排工作，待上岗后报备公司党群人事部报备。</span>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="上岗时间" prop="post_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择上岗时间"
            v-model="form.post_date"
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
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries/list";
import imageFileUpload from "@/components/imageFileUpload/index";
import { formatTime, deepCopy } from "@/utils/index"
import { getUser } from '@/utils/auth';
import common from './common/index'
export default {
  name: "employment-contact-form",
  components: {
    getDepartmentSelect,
    getSelectDictionaries,
    imageFileUpload,
    getDriverSelectTree
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
        work_user: '',
        sex: '',
        ic_card: '',
        position_name: '',
        work_code: '',
        license_code: '',
        driver_level: '',
        remark: '',
        opinion: '',
        post_date: '',
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
        department_name: [
          {
            required: true,
            message: "请选择所属组织",
            trigger: "change",
          },
        ],
        work_user: [
          {
            required: true,
            message: "请选择姓名",
            trigger: "change",
          },
        ],
      },

      dept_id: null,
      changeNum: 0,
    }
  },
  
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree1.onClear();
        this.$refs.personalTree2.onClear();
        this.$refs.departmentTree.onClear();
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
        this.form.post_date = formatTime(new Date(),'yyyy-MM')
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 选择司机
    getDriverInfo(info,nodes) {
      if (nodes.length > 0) {
        this.getListSysPerson(nodes[0].i_id)
      }
    },
    // 获取用户信息
    getListSysPerson(user_id){
      let content = {
        id: user_id
      }
      this.$client.GetDriverEmployeeManageDetail(content).then(req => {
        if (req.head.result === "200") {
          console.log(req);
          this.form.sex = req.context.gender
          this.form.ic_card = req.context.idcord
          this.form.position_name = '' //接口暂无该字段
          this.form.work_code = req.context.worker_id
          this.form.driver_level = req.context.permit_vehilce_name
          this.form.license_code = req.context.driving_licence
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
