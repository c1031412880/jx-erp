<template>
  <div>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="公文字号" :span="2">
        <span v-if="!isNumber">{{formData.font_number}}</span>
        <p v-else><get-select-dictionaries :isValueCode="false" v-model="fontForm.font" placeholder="请选择字" classKey="发文字号" @change="GetNumber(false)">
        </get-select-dictionaries>
        ﹝<el-date-picker
            v-model="year"
            @change="dateChange"
            type="year"
            placeholder="选择年">
          </el-date-picker>﹞
          <el-input-number v-model="fontForm.number" :controls="false"  size="mini" style="width: 120px"></el-input-number>号
          <el-button  size="mini" @click="setNumber">{{isSetNumber ? '修改' : '编号'}}</el-button>
          <el-button size="mini" @click="outNumber">补号</el-button>
        </p>
      </el-descriptions-item>
      <el-descriptions-item label="公文编号" :span="2">
        <span>{{formData.code}}</span>
      </el-descriptions-item>
      <el-descriptions-item label="公文标题" :span="2">
        {{formData.title}}
      </el-descriptions-item>
      <el-descriptions-item label="拟稿人">
        {{formData.post_name}}
      </el-descriptions-item>
      <el-descriptions-item label="发文类型">
        {{formData.type_name}}
      </el-descriptions-item>
      <el-descriptions-item label="拟稿部门">
        {{formData.department_name}}
      </el-descriptions-item>
      <el-descriptions-item label="发文份数">
        {{formData.post_count}}份
      </el-descriptions-item>
      <el-descriptions-item label="发文日期">
        {{formData.posy_time}}
      </el-descriptions-item>
      <el-descriptions-item label="缓急程度">
        {{formData.degree_name}}
      </el-descriptions-item>
      <el-descriptions-item label="保密密级">
        {{formData.secret_name}}
      </el-descriptions-item>
      <el-descriptions-item label="主题词">
        {{formData.keyword}}
      </el-descriptions-item>
      <el-descriptions-item label="主送单位">
        {{formData.main_department_name}}
      </el-descriptions-item>
      <el-descriptions-item label="主送人员">
        {{formData.main_person_names}}
      </el-descriptions-item>
      <el-descriptions-item label="抄送单位">
        {{formData.copy_department_names}}
      </el-descriptions-item>
      <el-descriptions-item label="抄送人员">
        {{formData.copy_person_names}}
      </el-descriptions-item>
      <el-descriptions-item label="发文流程" :span="2">
        {{formData.flow_name}}
      </el-descriptions-item>
    </el-descriptions>
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
  </div>

</template>

<script type="text/ecmascript-6">
import getFlowSelect from '../get-flow-select'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'
export default {
  name: "base-info",
  components: {getFlowSelect, getSelectDictionaries},
  props: {
    isNumber: {
      type: Boolean,
      default: true
    }
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
        department_name: '',
        type: 1,
        type_name: '',
        post_id: 0,
        post_count: 0,
        posy_time: '',
        degree: 1,
        secret: 1,
        keyword: '',
        content: '',
        is_sms: 1,
        flow_id: '',
        flow_name: '',
        post_name: '',
        degree_name: '',
        secret_name: '',
        main_department_name: '',
        main_person_names: '',
        copy_department_names: '',
        copy_person_names: '',
        post_count_view: 0,
        posy_time_view: 0,
        degree_view: 0,
        secret_view: 0,
        main_department_view: 0,
        copy_department_view: 0,
      },
      fontForm: {
        font: '',
        year: 0,
        number: '',
      },
      typeArr: [
        {label: '请示', value: 100},
        {label: '报告', value: 101},
        {label: '意见', value: 102},
        {label: '批示', value: 103},
        {label: '函', value: 200},
        {label: '议案', value: 201},
        {label: '公告', value: 202},
        {label: '通告', value: 203},
        {label: '通知', value: 204},
        {label: '纪要', value: 205},
        {label: '意见', value: 206},
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
        {label: '其他', value: 400},
        {label: '总结', value: 401},
        {label: '方案', value: 402},
      ],
      numberList: [],
      max: 0,
      set_number: 0,
      isSetNumber: false,
      innerVisible: false,
      out_number: 0,
    }
  },
  mounted() {
    let date = new Date()
    this.fontForm.year = Number(date.getFullYear())
  },
  methods: {
    dateChange(time) {
      let date = new Date(time)
      this.fontForm.year = date.getFullYear()
      this.GetNumber(false)
    },
    flowChange(flowItem) {
      this.$emit('on-flow-change', flowItem.flow_id, flowItem)
    },
    // 字类别切换
    dictionariesChange() {
      let date = new Date()
      this.fontForm.year = Number(date.getFullYear())
      this.GetNumber()
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
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
