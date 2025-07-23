<template>
  <div
    class="law-finish"
    :style="`height:${curChangeType == 'detail' ? '470' : '400'}px; overflow-x: hidden`"
  >
    <el-form size="mini" :model="formData" :rules="rules" ref="formData" label-width="120px">
      <div v-if="curChangeType != 'add' && $isPowerShow('handle_acc')">
        <div class="show-flex-box-r">
          <i style="float: left; width: 6px; height: 18px; background: #409eff"></i>
          <p
            style="
              margin-left: 15px;
              margin-bottom: 15px;
              color: #409eff;
              font-size: 16px;
              font-weight: bold;
            "
          >
            事故处理
          </p>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="事故经办人:" prop="i_result_person">
            <get-department-select
              ref="personalTree"
              v-model="formData.i_result_person"
              :width="'220'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择事故经办人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curChangeType == 'detail'"
            ></get-department-select>
          </el-form-item>
          <el-form-item label="处理日期:" prop="d_result_date">
            <el-date-picker
              v-model="formData.d_result_date"
              type="date"
              placeholder="选择日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :disabled="curChangeType == 'detail'"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="safety-distance-box show-flex-box-r">
          <el-form-item label="处理人:" prop="i_disposer_person">
            <!-- <get-driver-select-tree
              ref="dealWithPersonalTree"
              v-model="formData.i_disposer_person"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择处理人'"
              :isExportMultiple="false"
              :disabled="curChangeType == 'detail'"
            ></get-driver-select-tree> -->
            <get-department-select
              ref="dealWithPersonalTree"
              v-model="formData.i_disposer_person"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择事故经办人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="curChangeType == 'detail'"
            ></get-department-select>
          </el-form-item>

          <el-form-item label="处罚依据:" prop="i_according">
            <el-select
              v-model="formData.i_according"
              @change="changeAccording"
              :disabled="curChangeType == 'detail'"
              multiple
              collapse-tags
              clearable
            >
              <!-- <el-option
                v-for="item in option"
                :value="item.i_id"
                :label="item.c_name"
                :key="item.i_id"
              >
              </el-option> -->
              <el-option-group :key="`i${i}`" :label="group.c_name" v-for="(group, i) in option">
                <el-option
                  :label="item.c_name"
                  :value="item.i_id"
                  v-for="(item, j) in group.children"
                  :key="`j${j}`"
                ></el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="安全奖扣款:" prop="n_result_cost">
            <el-input
              placeholder="请输入安全奖扣款"
              v-model="formData.n_result_cost"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_result_cost = $event.target.value"
              :disabled="curChangeType == 'detail'"
            ></el-input>
          </el-form-item>
          <el-form-item label="扣分:" prop="n_deduct_points">
            <el-input
              placeholder="请输入扣分"
              v-model="formData.n_deduct_points"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_deduct_points = $event.target.value"
              :disabled="curChangeType == 'detail'"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="安全等级:" prop="i_level">
            <el-input
              placeholder="请输入安全等级"
              v-model="formData.i_level"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.i_level = $event.target.value"
              :disabled="curChangeType == 'detail'"
            ></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="安全里程:" prop="i_result_mile">
            <el-select
              v-model="formData.i_result_mile"
              placeholder="请选择"
              :disabled="curChangeType == 'detail'"
            >
              <el-option
                v-for="item in safetyDistanceOptions"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <!-- <el-form-item
            label="扣除里程:"
            prop="n_result_mile"
            v-if="formData.i_result_mile && (formData.i_result_mile != 1)"
          >
            <el-input
              placeholder="请输入扣除里程"
              v-model="formData.n_result_mile"
              style="width: 170px"
              oninput="value=value.replace(/[^\d.-]/g,'')"
              @blur="formData.n_result_mile = $event.target.value"
              :disabled="curChangeType == 'detail'"
            ></el-input>
            <span>公里</span>
          </el-form-item> -->
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="处理方式:" prop="c_handling_method">
            <get-select-dictionaries
              v-model="formData.c_handling_method"
              :classKey="'处理方式'"
              :placeholder="'请选择处理方式'"
              :isShowDefaultValue="curChangeType == 'add'"
              :disabled="curChangeType == 'detail'"
            ></get-select-dictionaries>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="处理意见:" prop="c_result_remark">
            <el-input
              type="textarea"
              v-model="formData.c_result_remark"
              :disabled="curChangeType == 'detail'"
              :autosize="{ minRows: 4, maxRows: 8 }"
              placeholder="请输入处理意见"
            ></el-input>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="发起处理流程:" prop="c_result_remark" style="width: 370px">
            <el-checkbox
              v-model="formData.checked"
              @change="selectApprove"
              :disabled="curChangeType == 'detail'"
            ></el-checkbox>
          </el-form-item>
          <el-form-item
            label="选择审核流程:"
            prop="c_result_remark"
            v-if="formData.checked && curChangeType == 'edit'"
          >
            <!-- <el-select v-model="formData.region" placeholder="请选择选择审核流程">
              <el-option label="一般事故流程" :value="1"></el-option>
              <el-option label="重大事故流程" :value="2"></el-option>
            </el-select> -->
            <el-select
              v-model="flow_id"
              @change="selectedFlowId"
              clearable
              placeholder="请选择流程"
            >
              <el-option
                v-for="item in flowListOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="show-flex-box-c" v-if="formData.checked">
          <!-- <i
            style="float: left; width: 6px; height: 18px; background: #409eff"
          ></i> -->
          <p
            style="
              margin-left: 15px;
              margin-bottom: 15px;
              color: #409eff;
              font-size: 16px;
              font-weight: bold;
            "
          >
            流程:
          </p>
          <div
            class="show-flex-box-r"
            v-if="!!formData.flow_id && curChangeType == 'detail'"
            style="margin: 15px 0 0 30px"
          >
            <approve-schedule
              style="margin-left: 10px"
              :isFlow="false"
              :flow_id="formData.flow_id"
            ></approve-schedule>
          </div>
          <div
            class="show-flex-box-r"
            v-if="!!flow_id && curChangeType == 'edit'"
            style="margin: 15px 0 0 30px"
          >
            <approve-step :flow_id="flow_id" :isFlow="true" @on-users="saveOnUsers"></approve-step>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import { getSession, getUser } from '@/utils/auth'
import getDepartmentSelect from '@/components/base/formModel/tree/get-department-select-tree'
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import approveSchedule from '@/components/approve-echo/approve-schedule.vue'
import approveStep from '@/components/approve-echo/approve-step.vue'
import getSelectDictionaries from '@/components/base/formModel/select/get-select-dictionaries'

export default {
  components: {
    getDepartmentSelect,
    getDriverSelectTree,
    approveSchedule,
    approveStep,
    getSelectDictionaries
  },
  props: {
    curChangeType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      safetyDistanceOptions: [
        //状态
        { value: 1, name: '不扣除' },
        { value: 2, name: '扣除指定安全里程' },
        { value: 3, name: '扣除当月安全里程' },
        { value: 4, name: '扣除当季度安全里程' },
        { value: 5, name: '扣除全部安全里程' },
        { value: 6, name: '扣除当前安全里程' }
      ],
      department_name: '', //部门名称
      formData: {
        i_result_person: '',
        i_disposer_person: '',
        d_result_date: '',
        n_result_cost: '',
        i_result_mile: 1,
        n_result_mile: '',
        c_result_remark: '',
        checked: false,
        flow_id: '',
        flow_code: '',
        n_deduct_points: '',
        i_according: [],
        i_level: '',
        c_handling_method: ''
      },
      rules: {},
      curInfo: {},
      flowListOptions: [],
      flow_id: '',
      approveStepList: [], //流程列表
      option: [] // 处罚依据
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    // let userInfo = JSON.parse(getUser());
    // console.log(userInfo)
    // this.formData.i_result_person = Number(userInfo.user_id)
    // console.log(this.formData.i_result_person)
    this.reqInspectProjectList()
  },
  methods: {
    // 获取扣分 和  安全等级
    changeAccording(value) {
      this.option.forEach(item => {
        item.children.forEach(child => {
          if (child.i_id == value) {
            this.formData.n_deduct_points = child.c_fee
            this.formData.i_level = child.i_level
          }
        })
      })
    },
    // 获取违规项目
    reqInspectProjectList() {
      this.$client.GetItemsTreeRewardPunish({ type: 2 }).then(res => {
        if (res.head.result == '200') {
          this.option = res.context
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 初始化数据
    resetData() {
      this.$refs['formData'].resetFields()
      this.$refs.personalTree.onClear()
      this.$refs.dealWithPersonalTree.onClear()
      this.formData.checked = false
      this.flow_id = ''
    },

    // 数据回显
    setData(val) {
      // console.log(val, "sj");
      this.curInfo = val
      for (const key in this.formData) {
        if (Object.hasOwnProperty.call(val, key)) {
          // const element = this.formData[key];
          this.formData[key] = val[key]
        }
      }
      // if(!!this.formData.flow_id && !!this.formData.flow_code) {
      //   this.formData.checked = true
      // }

      if (this.curChangeType == 'detail') {
        this.formData.checked = true
        // if (!val.i_result_person) {
        //   let userInfo = JSON.parse(getUser());
        //   // console.log(userInfo);
        //   this.formData.i_result_person = Number(userInfo.user_id);
        // }
      }
    },
    // 选择是否发起流程
    selectApprove(val) {
      if (val) {
        this.reqGetListFlowManage()
      } else {
        this.flowListOptions = []
        this.approveStepList = []
      }
    },
    // 选择流程
    selectedFlowId(val) {
      if (!val) {
        this.approveStepList = []
      }
    },
    // 获取流程列表
    reqGetListFlowManage() {
      let params = {
        object_id: 60,
        type: 2
      }
      this.$client.GetListFlowManage(params).then(res => {
        if (res.head.result == '200') {
          this.flowListOptions = res.context.list
        } else {
          this.flowListOptions = []
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: 'error'
          })
        }
      })
    },
    // 根据流程设计发起流程folw_code
    saveOnUsers(list) {
      this.approveStepList = list
      // this.submitApplyMembershipForm();
    },
    // 提交申请获取流程code和流程id  （发起流程）
    submitApplyMembershipForm() {
      if (this.approveStepList.length) {
        let params = {
          context: this.approveStepList
        }
        this.$client
          .StartFlowRecord(params)
          .then(res => {
            if (res.head.result == '200') {
              this.formData.flow_id = res.context.id
              this.formData.flow_code = res.context.code
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: 'error'
              })
            }
          })
          .catch(err => {})
      }
    },
    // 给父级页面提供得获取本页数据
    getData() {
      // if(!this.curInfo.i_result_person) {
      //   this.formData.i_result_person = '';
      // }
      return new Promise((resolve, reject) => {
        this.$refs['formData'].validate(valid => {
          if (!valid) {
            reject({
              result: 400,
              msg: '获取失败,带星号的为必填项'
            })
            return
          }
          resolve({
            formData: this.formData,
            approveStepList: this.approveStepList,
            result: 200,
            msg: '获取成功'
          })
        })
      })
    }
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.law-finish /deep/ .el-date-editor {
  width: 250px;
}

.law-finish /deep/.el-select, .el-select--mini {
  width: 250px;
}

.law-finish /deep/ .el-input, .el-input--mini {
  width: 250px;
}

.law-finish /deep/ .el-textarea {
  width: 620px;
}
</style>
