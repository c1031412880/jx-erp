<template>
  <el-form label-width="100px" label-suffix=":">
    <el-form-item label="发文字号">
      <p v-if="isNumber"><get-select-dictionaries  :size="'mini'" :isValueCode="false" v-model="fontForm.font" placeholder="请选择字" classKey="发文字号" @change="GetNumber(false)">
        </get-select-dictionaries>
        ﹝<el-date-picker
            v-model="year"
            @change="dateChange"
            type="year"
            size="mini"
            placeholder="选择年">
          </el-date-picker>﹞
          <el-input-number v-model="fontForm.number" :controls="false" size="mini" style="width: 120px"></el-input-number>号
          <el-button  size="mini" @click="setNumber">{{isSetNumber ? '修改' : '编号'}}</el-button>
          <el-button size="mini" @click="outNumber">补号</el-button>
        </p>
        <span v-else>{{formData.font_number}}</span>
    </el-form-item>
    <el-form-item label="发文编号" v-show="formData.code">
      <span>{{formData.code}}</span>
    </el-form-item>
    <el-form-item label="公文标题" required v-if="!(flowFields.title === 3)">
      <el-input v-model="formData.title"  placeholder="请输入标题" @blur="UpdateDocument" :disabled="flowFields.title === 1 ? true : false"></el-input>
    </el-form-item>
    <el-form-item label="拟稿人" required>
      <vue-user-role-tree placeholder="选择拟稿人" :disabled="true" :show_all="true" :func_type="0" :is_contain_emp="true" v-model="formData.post_id"></vue-user-role-tree>
    </el-form-item>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="拟稿部门" required>
          <get-dept-emp-select-tree placeholder="选择拟稿部门" :disabled="true" :func_type="0" v-model="formData.department_id"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文份数"  v-if="!(flowFields.post_count === 3)">
          <el-input-number style="width: 100%;" v-model="formData.post_count" @change="UpdateDocument" :disabled="flowFields.post_count === 1 ? true : false"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文类型" required v-if="!(flowFields.type === 3)">
          <el-select v-model="formData.type" @change="UpdateDocument" :disabled="flowFields.type === 1 ? true : false" placeholder="请选择发文类型" clearable style="width: 100%;">
            <el-option-group
              v-for="(group,i) in typeArr"
              :label="group.name"
              :key="i">
              <el-option
                v-for="(item,i) in group.list"
                :key="i"
                v-bind="item"
              ></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="缓急程度">
          <el-select v-model="formData.degree" :disabled="true" placeholder="请选择缓急程度" clearable style="width: 100%;">
            <el-option label="平急" :value="1"></el-option>
            <el-option label="加急" :value="2"></el-option>
            <el-option label="特急" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文日期" required v-if="!(flowFields.posy_time === 3)">
          <el-date-picker
            v-model="formData.posy_time"
            @change="UpdateDocument"
            :disabled="flowFields.posy_time === 1 ? true : false"
            type="datetime"
            style="width: 100%;"
            placeholder="选择发文日期"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="保密密级">
          <el-select v-model="formData.secret" :disabled="true" placeholder="请选择保密密级" clearable style="width: 100%;">
            <el-option label="秘密" :value="1"></el-option>
            <el-option label="机密" :value="2"></el-option>
            <el-option label="绝密" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送单位" required v-if="!(flowFields.main_department === 3)">
          <get-dept-emp-select-tree @on-change="UpdateDocument" placeholder="选择主送单位" :disabled="flowFields.main_department === 1 ? true : false" :func_type="0" v-model="formData.main_department" :isShowCheckbox="true"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送单位" v-if="!(flowFields.copy_departments === 3)">
          <get-dept-emp-select-tree @on-change="UpdateDocument" placeholder="选择抄送单位" :disabled="flowFields.copy_departments === 1 ? true : false" :func_type="0" v-model="formData.copy_departments" :isShowCheckbox="true"></get-dept-emp-select-tree>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主送人员" v-if="!(flowFields.main_persons === 3)">
          <vue-user-role-tree @on-change="UpdateDocument" placeholder="选择主送人员" :disabled="flowFields.main_persons === 1 ? true : false" :func_type="0" :show_all="true" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.main_persons"></vue-user-role-tree>
          <p style="height:16px;">
            <el-popover
              placement="top"
              trigger="hover">
              <el-tag v-for="(item, index) in formData.main_person_details" :key="index" :type="!!item.read ? 'success' : 'info'" size="mini" style="margin: 5px 5px;">
                {{item.person_info ? item.person_info.name + (!!item.read ? '(已读)' : '(未读)') : ''}}
              </el-tag>
              <p v-show="!!formData.main_persons && formData.main_persons.length" slot="reference" style="color: #00ccff;cursor: pointer;font-size: 12px;">
                {{formData.main_read}}人已读
              </p>
            </el-popover>
        </p>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="抄送人员" v-if="!(flowFields.copy_persons === 3)">
          <vue-user-role-tree @on-change="UpdateDocument" placeholder="选择抄送人员" :disabled="flowFields.copy_persons === 1 ? true : false" :show_all="true" :func_type="0" :is_contain_emp="true" :isShowCheckbox="true" v-model="formData.copy_persons"></vue-user-role-tree>
          <p style="height:16px;">
            <el-popover
              placement="top"
              trigger="hover">
              <el-tag v-for="(item, index) in formData.copy_person_details" :key="index" :type="!!item.read ? 'success' : 'info'" size="mini" style="margin: 5px 5px;">
                {{item.person_info ? item.person_info.name + (!!item.read ? '(已读)' : '(未读)') : ''}}
              </el-tag>
              <p v-show="!!formData.copy_persons && formData.copy_persons.length" slot="reference" style="color: #00ccff;cursor: pointer;font-size: 12px;">
                {{formData.copy_read}}人已读
              </p>
            </el-popover>
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主题词">
          <el-input v-model="formData.keyword" :disabled="true" placeholder="请输入主题词"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发文流程" required>
          <el-input v-model="formData.flow_name" disabled></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-dialog
      width="30%"
      title="修改编号"
      :visible.sync="innerVisible"
      append-to-body>
      <el-form>
        <el-form-item label="当前值:">
          <el-input v-model="fontForm.number" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前最大值:">
          <el-input v-model="max" disabled></el-input>
        </el-form-item>
        <el-form-item label="修改值:">
          <el-input-number v-model="set_number"></el-input-number>
        </el-form-item>
        <el-form-item label="可补录空号:">
          <el-button @click="setBl(out_number)" v-if="out_number" size="mini" type="success">{{out_number}}</el-button>
          <el-button @click="setBl(item)" size="mini" type="primary" v-for="(item,i) in numberList" :key="i">{{item}}</el-button>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button  @click="innerVisible = false">取消</el-button>
        <el-button  type="primary" @click="onNumberSubmit">确定</el-button>
      </div>
    </el-dialog>
  </el-form>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
import getDeptEmpSelectTree from '@/components/base/formModel/tree/get-dept-emp-select-tree'
import VueUserRoleTree from '@/components/base/formModel/tree/user-role-tree/index'
export default {
  name: "base-info",
  components: { getDeptEmpSelectTree, VueUserRoleTree, getSelectDictionaries},
  props: {
    isNumber: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      year: '',
      formData: {
        id: 0,
        code: '',
        font_number: '',
        title: '',
        department_id: 0,
        type: 1,
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        is_sms: 1,
        flow_id: null,
        flow_name: '',
        main_department: '',
        copy_departments: [],
        main_persons: [],
        copy_persons: [],
        files: [],
        post_count_view: 0,
        posy_time_view: 0,
        degree_view: 0,
        secret_view: 0,
        main_department_view: 0,
        copy_department_view: 0,
        main_read: 0,
        main_person_details: [],
        copy_read: 0,
        copy_person_details: [],
      },
      fontForm: {
        font: '',
        year: 0,
        number: '',
      },
      typeArr: [
        {
          name: '',
          list: [
            {label: '党总支纪要', value: 403},
            {label: '嘉公交纪要', value: 404},
            {label: '嘉公自纪要', value: 405},
            {label: '国鸿汽运纪要', value: 406},
            {label: '嘉通交运党委纪要', value: 407},
            {label: '嘉通交运行政纪要', value: 408},
          ]
        },
        {
          name: '上行文',
          list: [
            {label: '请示', value: 100},
            {label: '报告', value: 101},
            {label: '意见', value: 102},
            {label: '批示', value: 103},
          ]
        },
        {
          name: '平行文',
          list: [
            {label: '函', value: 200},
            {label: '议案', value: 201},
            {label: '公告', value: 202},
            {label: '通告', value: 203},
            {label: '通知', value: 204},
            {label: '纪要', value: 205},
            {label: '意见', value: 206},
          ]
        },
        {
          name: '下行文',
          list: [
            {label: '命令', value: 300},
            {label: '决议', value: 301},
            {label: '公报', value: 302},
            {label: '通报', value: 303},
            {label: '批复', value: 304},
            {label: '公告', value: 305},
            {label: '通告', value: 306},
            {label: '通知', value: 307},
            {label: '纪要', value: 308},
            {label: '意见', value: 309},
            {label: '决定', value: 310},
          ]
        },
        {
          name: '其他',
          list: [
            {label: '其他', value: 400},
            {label: '总结', value: 401},
            {label: '方案', value: 402},
          ]
        }
      ],
      numberList: [],
      max: 0,
      set_number: 0,
      isSetNumber: false,
      innerVisible: false,
      out_number: 0,
      flowFields: {
        title: 1,
        type: 1,
        posy_time: 1,
        main_department: 1,
        main_persons: 1,
        copy_departments: 1,
        copy_persons: 1,
        post_count: 1,
      }, //表单字段权限 
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.setUser()
    // })
  },
  methods: {
    dateChange(time) {
      let date = new Date(time)
      this.fontForm.year = date.getFullYear()
      this.GetNumber(false)
    },
    // 补号
    setBl(num) {
      this.set_number = num
    },
    // 补号
    outNumber() {
      if (!this.numberList.length) {
        this.$message.error('当前没有空余字号');
        return false
      }
      let min = this.max
      this.numberList.forEach(item => {
        if (item < min) {
          min = item
        }
      })
      this.fontForm.number = this.out_number ? this.out_number : min
    },
    // 修改编号提交
    onNumberSubmit() {
      if (!this.set_number) {
        this.$message.error('请填写修改值');
        return false
      }
      if (this.set_number > this.max) {
        this.fontForm.number = this.set_number
        this.max = this.set_number
      } else {
        if (this.numberList.indexOf(this.set_number) > -1 || this.set_number === this.out_number) {
          this.fontForm.number = this.set_number
        } else {
          this.$message.error('该字号已被使用');
          return false
        }
      }
      this.innerVisible = false
    },
    // 修改字号
    setNumber() {
      if (!this.fontForm.font) {
        this.$message.error('请选择字类型');
        return false
      }
      if (!this.fontForm.year) {
        this.$message.error('请选择年号');
        return false
      }
      if (this.isSetNumber) {
        this.innerVisible = true
        this.GetNumber()
      } else {
        this.fontForm.number = this.max + 1
        this.max = this.fontForm.number
      }
      this.isSetNumber = true
    },
    // 获取补号
    GetNumber(bool = true) {
      let date = new Date()
      if (this.fontForm.year) {
        date.setFullYear(this.fontForm.year)
      } else {
        this.fontForm.year = Number(date.getFullYear())
      }
      this.year = date
      this.isSetNumber = bool
      if (!this.fontForm.font || !this.fontForm.year) {
        this.max = 0
        this.numberList = []
        return false
      }
      let parameter = {
        font: this.fontForm.font,
        year: this.fontForm.year
      }
      this.$client.GetNumberDocumentMain(parameter).then(req => {
        console.log(req)
        if (req.head.result === '200') {
          this.max = (req.context.max < this.fontForm.number) && bool ? this.fontForm.number : req.context.max
          this.numberList = req.context.data
        }
      })
    },
    // 更新基础信息
    UpdateDocument() {
      if(!this.formData.title && this.flowFields.title === 2) {
        this.$message.warning('请填写公文标题')
        return false
      }
      if(!this.formData.type && this.flowFields.type_name === 2) {
        this.$message.warning('请选择发文类型')
        return false
      }
      if(!this.formData.post_time && this.flowFields.post_time === 2) {
        this.$message.warning('请选择发文日期')
        return false
      }
      if(!this.formData.main_department && this.flowFields.main_department_name === 2) {
        this.$message.warning('请选择主送单位')
        return false
      }
      if(!this.formData.main_persons && this.flowFields.main_person_names === 2) {
        this.$message.warning('请选择主送人员')
        return false
      }
      // 更新公文信息
      this.$client.UpdateDocumentMain({context: this.formData}).then((res) => {}).catch((err) => {});
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
