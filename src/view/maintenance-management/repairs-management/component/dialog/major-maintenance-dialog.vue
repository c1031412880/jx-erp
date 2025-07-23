<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="840px"
    center
    top="20px"
    append-to-body>
    <el-form  ref="form" size="mini" class="major-maintenance-dialog" :model="form" label-width="140px">
      <item-box-new title="报修信息">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="车辆自编号:" prop="vehicle_id">
              <get-carcode-select-tree
                ref="carcodeTree"
                :placeholder="'选择车辆自编号'"
                :isShowCheckbox="false"
                v-model="form.vehicle_id"
                :isExportMultiple="false"
                disabled>
              </get-carcode-select-tree>
            </el-form-item>
            <el-form-item label="车牌号:" prop="vehicle_id">
              <get-vehicle-select-tree
                ref="vehicleTree"
                :placeholder="'选择车辆'"
                :isShowCheckbox="false"
                v-model="form.vehicle_id"
                :isExportMultiple="false"
                disabled>
              </get-vehicle-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属组织:">
              <el-input
                ref="deptTree"
                v-model="form.dept_id"
                :isShowCheckbox="false"
                :isExportMultiple="false"
                :placeholder="'请选择所属组织'"
                :isContainEmp="false"
                clearable
                disabled>
              </el-input>
            </el-form-item>
            <el-form-item label="车辆型号:">
              <el-input
                v-model="form.cid"
                placeholder="请输入车辆型号"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修类别:" prop="type_child">
              <el-input
                v-model="form.type_child_name"
                :width="'420'"
                disabled
                v-if="form.type_child == -1">
              </el-input>
              <get-select-dictionaries
                v-model="form.type_child"
                :classKey="'报修类别'"
                :placeholder="'请选择'"
                disabled
                v-else
              ></get-select-dictionaries>
            </el-form-item>
            <el-form-item label="报修人:" prop="repair_user_id">
              <get-user-select
                ref="driverTree1"
                v-model="form.repair_user_id"
                :isShowCheckbox="false"
                :placeholder="'请选择报修人'"
                :isExportMultiple="false"
                disabled>
              </get-user-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="报修时间:" prop="repair_time">
              <el-date-picker
                v-model="form.repair_time"
                type="datetime"
                placeholder="选择日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                disabled>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="报修地点:" prop="repair_address"  
              v-if="form.type_child == '959685' || 
                    form.type_child == '959686'">
              <el-input
                v-model="form.repair_address"
                disabled
                placeholder="请输入维修车间">
              </el-input>
            </el-form-item>
            <el-form-item label="报修地点:" prop="repair_address_id" v-else>
              <getmaintaindep
                ref="getmaintaindep"
                v-model="form.repair_address_id"
                :init="false"
                :placeholder="'请选择维修车间'"
                :disabled="true"
              ></getmaintaindep>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驾驶员:" prop="driver_id">
              <get-driver-select-tree
                ref="driverTree"
                v-model="form.driver_id"
                :isShowCheckbox="false"
                :placeholder="'请选择驾驶员'"
                :isExportMultiple="false"
                disabled
              ></get-driver-select-tree>
            </el-form-item>
            <!-- <el-form-item label="是否拖车:">
              <el-checkbox
                true-label="2"
                false-label="1"
                disabled
                v-model="form.is_trailer"
              ></el-checkbox>
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联施救车派工单:">
              <el-input
                v-model="form.rescue_flow_code"
                disabled
                placeholder="请输入关联的施救车派工单">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="报修描述:" prop="repair_describe">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入详细报修描述"
                v-model="form.repair_describe"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="图片上传:">
              <el-upload
                action="#"
                :limit="4"
                :on-preview="handlePictureCardPreview"
                :file-list="form.imgs"
                list-type="picture-card"
                disabled>
                <i class="el-icon-plus"></i>
              </el-upload>
              <p>说明：可上传维修前车辆照片,最多上传4张</p>
              <el-dialog :visible.sync="dialogVisible" append-to-body>
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="form.plan_id">
          <el-col :span="12">
            <el-form-item label="关联保养计划:">
              <el-input
                v-model="form.plan_name"
                placeholder="请选择关联保养计划"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养计划日期:">
              <el-input
                v-model="form.plan_date"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养类型:">
              <el-input
                v-model="form.upkeep_type_name"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修理工:">
              <el-input
                v-model="form.repair_person_names"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最近保养日期:">
              <el-input
                v-model="form.last_keep_time"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保养周期里程:">
              <el-input
                v-model="form.time_mile"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-show="form.accident_id">
          <el-col :span="12">
            <el-form-item label="关联事故编号:">
              <el-input
                v-model="form.c_accident_code"
                placeholder="请选择关联事故编号"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事故日期:">
              <el-input
                v-model="form.d_accident_date"
                placeholder="请选择事故日期"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事故责任:">
              <el-input
                v-model="form.accident_duty"
                placeholder="请选择事故责任"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="定损金额:">
              <el-input
                v-model="form.n_actual_fee"
                placeholder="请选择定损金额"
                disabled>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="车辆受损情况:" prop="">
              <el-input
                type="textarea"
                disabled
                v-model="form.c_describe"
                :autosize="{ minRows: 4, maxRows: 8 }"
                placeholder="请输入详细车辆受损情况"
              ></el-input>
              <p>说明：事故具体情况可前往安全管理-事故管理中查看</p>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事故经办人:">
            <get-department-select
              ref="personalTree"
              v-model="form.i_result_person"
              :width="'220'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择事故经办人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              :disabled="true"
            ></get-department-select>
          </el-form-item>
          </el-col>
        </el-row>
      </item-box-new>
      <item-box-new title="进厂检验">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="检验时间:"  prop="check_time" >
              <el-date-picker
                  v-model="form.check_time"
                  type="datetime"
                  placeholder="选择日期"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  disabled>
                </el-date-picker>        
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优先级:" prop="check_time" >
              <el-select v-model="form.priority" placeholder="请选择" disabled>
                <el-option
                  v-for="item in priorityOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检验人:" prop="check_time"  >
              <get-user-select   
                ref="driverTree2"
                v-model="form.check_id"
                :isShowCheckbox="false"
                :placeholder="'请选择检验人'"
                :isExportMultiple="false"
                disabled>
                </get-user-select>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修车间:" prop="maint_dept">
              <getmaintaindep 
                ref="getmaintaindep1" 
                v-model="form.maint_dept" 
                placeholder="选择维修车间" 
                disabled></getmaintaindep>   
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预估金额:" prop="estimate_amount">
              <el-input
                v-model="form.estimate_amount"
                oninput="value=value.replace(/[^\d.-]/g,'')"
                @blur="form.estimate_amount = $event.target.value"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检验描述:" prop="c_describe">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 8}"
                placeholder="请输入详细检验描述"
                v-model="form.check_describe"
                disabled
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.selectList.length">
            <tr-table
              :selectionShow="false"
              :data="form.selectList"
              :tableHeaderList="canRendererTableHeader"
              :TableHeight="300"
              :isFixedEmptyPlaceholder="false">
            </tr-table>
          </el-col>
        </el-row>
      </item-box-new>
      <el-card style="margin-top: 10px;max-height: 330px;overflow: auto">
        <approve-step 
          ref="approveStep"
          @on-users="setUsers" 
          :form_data="formData" 
          :key="key"
          :object_id="1660">
        </approve-step>
      </el-card>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">提交</el-button>
    </span>
  </el-dialog>


</template>

<script type="text/ecmascript-6">
import itemBoxNew from "./item-box-new";
import approveStep from '@/components/approve-echo/approve-step2'
import getUserSelect from "components/base/formModel/tree/get-user-select";
import getmaintaindep from "@/components/base/formModel/select/get-maintain-dep";
import getCarcodeSelectTree from "@/components/base/formModel/tree/get-carcode-select-tree";
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import { init } from "echarts";
export default {
  name: "major-maintenance-dialog",
  components: {
    itemBoxNew,
    approveStep,
    getUserSelect,
    getmaintaindep,
    getDriverSelectTree,
    getCarcodeSelectTree,
    getVehicleSelectTree,
    getSelectDictionaries,
    getDepartmentSelect,
  },
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "大额维修审批单",
    },
    isCommit: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      form: {
        i_id: '',
        vehicle_id: '',
        dept_id: '',
        cid: '',
        type_child: '',
        type_child_name: '',
        repair_user_id: '',
        repair_time: '',
        repair_address: '',
        repair_address_id: '',
        driver_id: '',
        // is_trailer: '1',
        rescue_flow_code: '',
        repair_describe: '',
        imgs: [],
        plan_id: '', //保养关联
        plan_name: '',
        plan_date: '',
        upkeep_type_name: '',
        repair_person_names: '',
        last_keep_time: '',
        time_mile: '',
        accident_id: '', //事故关联
        c_accident_code: "",
        d_accident_date: "",
        accident_duty: "",
        n_actual_fee: "",
        c_describe: "",
        i_result_person: [],
        //进厂检验
        check_time: '',
        priority: '',
        check_id: '',
        maint_dept: '',
        estimate_amount: '',
        check_describe: '',
        selectList: [],
      },
      formData: {
        check_state_name:'',
        check_describe:'',
        maint_dept:'',
        check_id:'',
        check_time:'',
        priority:'',
        repair_id:'',
        work_code:'',
        estimate_amount:'',
      },
      priorityOptions: [
        //状态
        { value: '1', label: "一般" },
        { value: '2', label: "紧急" },
        { value: '3', label: "非常紧急" },
      ],
      dispatchList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      nodes: [],
      key: null,
      canRendererTableHeader: [
        {
          id: 1,
          label: "故障分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "故障项目编号",
          prop: "c_code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "故障项目",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        }
      ],
    }
  },
  mounted() {},
  methods: {
    // 关闭弹窗
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 查看大图
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 接收流程节点
    setUsers(data) {
      this.nodes = data
    },
    // 数据回显
    setData(val,form) {
      console.log(val, form,  'val, form');
      for(let key in this.form) {
        if(val[key]) {
          this.form[key] = val[key]
        }
      }
      this.form.imgs = val.imgs && val.imgs.length?  val.imgs.map((e, i) => {
        return { name: i, url: e };
      }) : [];
      this.formData = {...form}
      // console.log(this.formData);
      this.key = new Date().getTime()
    },
    updatePlaybill() {
      if(this.isCommit) {
        // 编辑
        let params = {
          form_data: this.form
        }
        this.$client.SetRecordDriverEntry({context:params}).then(res => {
          if(res.head.result == '200') {
            this.dialogClose();
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }else {
        // 添加
        let params = {context: {}}
        params.context = {
          form_data: this.formData,
          step_data: this.nodes
        }
        this.$client.checkFlowMaintRepairRecord(params).then(res => {
          if (res.head.result == "200") {
            this.dialogClose()
            this.$emit('on-close')
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        });
      }
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        Object.assign(this.$data.form, this.$options.data().form);
        Object.assign(this.$data.formData, this.$options.data().formData);
        this.$refs.carcodeTree.onClear();
        this.$refs.vehicleTree.onClear();
        this.$refs.driverTree1.onClear();
        this.$refs.driverTree.onClear();
        this.$refs.driverTree2.onClear();
      }
    }
  }
}
</script>

<style rel="stylesheet/stylus" lang="stylus" scoped>
/deep/ .el-input > .el-input__inner
  width: 220px
</style>
