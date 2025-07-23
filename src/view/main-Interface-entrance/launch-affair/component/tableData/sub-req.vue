<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item v-if="isMark">
          <el-select v-model="form.form_source" clearable placeholder="审批单来源">
            <el-option v-for="item in flowCodeList" v-bind="item" :key="item.value + 'ly'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.content"
            clearable placeholder="请输入搜索关键词,包括审批标题,编号,正文内容"
            prefix-icon="el-icon-search" style="width: 350px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="submit_time_list"
            type="datetimerange"
            range-separator="至"
            start-placeholder="发起审批开始日期"
            end-placeholder="发起审批结束日期"
            @change="selectedTime"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="complete_time_list"
            type="datetimerange"
            range-separator="至"
            start-placeholder="完成审批开始日期"
            end-placeholder="完成审批结束日期"
            @change="selectedTime"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="流程状态" v-if="isState">
          <el-select v-model="form.state" clearable>
            <el-option v-for="item in stateList" v-bind="item" :key="item.value + 'zt'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="流程类型">
          <el-select v-model="type" clearable @change="selectChanged">
            <el-option label="表单流程" :value="1"></el-option>
            <el-option label="固定流程" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定类型" prop="object_id" v-if="type === 2">
          <el-select v-model="form.form_id" clearable multiple filterable collapse-tags :style="{width: '240px'}">
            <el-option :label="item.label" :value="Number(item.id)" v-for="item in typeOptions" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联表单" prop="object_id" v-if="type === 1">
          <el-select
            v-model="form.form_id"
            placeholder="请选择选择表单"
            clearable
            filterable
            multiple
            collapse-tags
            :style="{width: '240px'}">
            <el-option :label="item.label" :value="Number(item.id)" v-for="item in contactFormOptions" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <get-all-form-list v-model="form.form_id"></get-all-form-list>-->
<!--        </el-form-item>-->
        <el-form-item v-if="isUser && !isShow">
          <!-- <get-user-select-tree v-model="form.submit_id" placeholder="选择发起人"></get-user-select-tree> -->
          <get-department-select
            ref="tree"
            v-model="user_indexs"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            :placeholder="'选择发起人'"
            :show_all="true"
            @on-change="onSelectChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item v-if="isMark">
          <el-input v-model="form.mark_remark" placeholder="请输入收藏备注"></el-input>
        </el-form-item>
        <el-form-item v-if="isMark">
          <el-select v-model="form.mark_state" clearable placeholder="请选择标记状态">
            <el-option v-for="item in markStateList" v-bind="item" :key="item.value + 'bj'"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item v-if="isGroupBtn">
          <el-button-group>
            <el-button
              v-for="item in flowCodeList"
              @click="codeChange(item.value)"
              :key="item.value"
              :type="form.flow_code === item.value ? 'primary' : ''">{{item.label}}</el-button>
          </el-button-group>
        </el-form-item> -->
        <el-form-item  v-if="isGroupBtn">
          <el-checkbox v-model="checked">仅显示未读</el-checkbox>
        </el-form-item>
        <el-form-item v-if="isGroupBtn">
          <el-button type="text" @click="changeReadAllMess">全部标记为已读</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getAllFormList from 'components/base/formModel/select/get-all-form-list'
import getUserSelectTree from 'components/base/formModel/tree/get-user-select-tree'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree2";
export default {
  components: {getAllFormList, getUserSelectTree,getDepartmentSelect},
  data() {
    return {
      date: '',
      submit_time_list: '',
      complete_time_list: '',
      type: 1,
      stateList: [
        {label: '全部', value: 0},
        {label: '审批中', value: 1},
        {label: '审批通过', value: 2},
        {label: '审批拒绝', value: 3},
        {label: '已撤销', value: 4},
      ],
      form: {
        content: '',
        submit_time_start: '',
        submit_time_end: '',
        complete_time_start: '',
        complete_time_end: '',
        form_id: [],
        submit_id: '',
        flow_code: 0,
        state: '',
        form_source: 0,
        mark_state: 0,
        mark_remark: ''
      },
      flowCodeList: [
        {label: '全部', value: 0},
        {label: '待处理', value: 1},
        {label: '已处理', value: 2},
        {label: '已发起', value: 3},
        {label: '抄送我的', value: 4},
      ],
      markStateList: [
        {label: '全部', value: 0},
        {label: '未处理', value: 1},
        {label: '进行中', value: 2},
        {label: '已完结', value: 3},
      ],
      contactFormOptions: [],
      typeOptions: [],
      checked: false,
      user_indexs: [],
    };
  },
  props: {
    isGroupBtn: {
      type: Boolean,
      default: false
    },
    isUser: {
      type: Boolean,
      default: false
    },
    isState: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    isMark: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    checked(bool) {
      this.$emit('on-check', bool ? 0 : 1)
    }
  },
  created() {
    this.getAllForm()
    this.getFlowType()
  },
  methods: {
    onSelectChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.submit_id = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.submit_id = []
      }
    },
    // 全部已读
    changeReadAllMess() {
      this.$emit('on-read')
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.check_range = `${this.date[0]}~${this.date[1]}`
      }else{
        this.form.check_range = ''
      }
    },
    selectChanged(val) {
      this.form.form_id = []
      // if (val == 1) {
      //   this.form.form_id = Number(this.contactFormOptions[0].id)
      // }else if (val == 2) {
      //   this.form.form_id = Number(this.typeOptions[0].id)
      // } else {
      //   this.form.form_id = ''
      // }
    },
    // 获取所有表单
    getAllForm() {
      this.contactFormOptions = [];
      this.$client.GetFormTypeFlowManage({}).then(req => {
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.contactFormOptions.push({
              id: key,
              label: req.context[key]
            })
          })
          // this.selectChanged(this.type)
        }
      });
    },
    // 获取流程分类
    getFlowType() {
      this.typeOptions = []
      this.$client.GetFlowTypeFlowManage({}).then(req => {
        console.log('流程分类', req)
        if (req.head.result === "200") {
          Object.keys(req.context).forEach(key => {
            this.typeOptions.push({
              id: key,
              label: req.context[key]
            })
          })
        }
      })
    },
    codeChange(code) {
      this.form.flow_code = code
      this.onSubmit()
    },
    // 查询
    onSubmit() {      
      if (this.submit_time_list) {
        this.form.submit_time_start = this.submit_time_list[0]
        this.form.submit_time_end = this.submit_time_list[1]
      } else {
        this.form.submit_time_start = ''
        this.form.submit_time_end = ''
      }
      if (this.complete_time_list) {
        this.form.complete_time_start = this.complete_time_list[0]
        this.form.complete_time_end = this.complete_time_list[1]
      } else {
        this.form.complete_time_start = ''
        this.form.complete_time_end = ''
      }
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit(`on-${com}`);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
