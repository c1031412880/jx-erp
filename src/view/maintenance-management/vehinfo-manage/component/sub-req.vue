<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.veh_code" placeholder="请输入自编号或车牌号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="baseTree"
            :isContainEmp="isContainEmp"
            :isShowCheckbox="true"
            :funcType="funcType"
            :placeholder="'分公司'"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            v-model="form.group_id"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.veh_type" clearable placeholder="车辆型号">
            <el-option
              v-for="item in vehTypeData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <tr-select-dictionaries v-model="form.veh_kind" :classKey="'车型信息管理车辆类型'" :placeholder="'车辆类型'"></tr-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <get-line-select-tree
            ref="vehicleTree"
            :placeholder="'请选择线路'"
            :isShowCheckbox="true"
            v-model="form.line_id"
            :isExportMultiple="true"
          ></get-line-select-tree>
        </el-form-item>
        <el-form-item>
          <!-- <el-checkbox :true-label="1" :false-label="0" v-model="form.is_scrap">显示报废车辆</el-checkbox> -->
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button type="text" @click="AdvancedSet">高级删选</el-button>-->
<!--        </el-form-item>-->
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加车辆</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            title="确定删除勾选中的车辆吗？"
            @confirm="onBtn('del')"
            v-if="$isPowerShow('del')">
            <el-button type="primary" slot="reference" icon="el-icon-delete" >删除车辆</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-error" @click="onBtn('scrap')" v-if="$isPowerShow('scrap')"
            >批量报废</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('transfer')" icon="el-icon-top-right" v-if="$isPowerShow('change')"
            >批量调动</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
    <drawer-dialog :drawer.sync="drawerdialogVisible" @on-submit-condition="advanceCondition"></drawer-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import drawerDialog from "./dialog/drawer-dialog";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
export default {
  components: { drawerDialog,getDepartmentSelect,getLineSelectTree },
  data() {
    return {
      drawerdialogVisible: false,
      vehTypeData: [],
      vehKindData: [],
      isContainEmp: false,
      funcType: 1, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      form: {
        is_scrap: 0,
        veh_code: "",
        group_id: [],
        veh_type: '',
        veh_kind: '',
        line_id: ''
      },
    };
  },
  activated() {
    let vehmodelId = this.$route.params.vehmodelId
    if (vehmodelId) {
      this.form.veh_type = vehmodelId
    }
    let numberId = this.$route.params.numberId
    if (numberId) {
      this.form.veh_code = numberId
    }
    if (vehmodelId || numberId) {
      this.onSubmit()
      this.getVehType()
      this.getVehKind()
    }
  },
  mounted() {
    let vehmodelId = this.$route.params.vehmodelId
    if (vehmodelId) {
      this.form.veh_type = vehmodelId
    }
    let numberId = this.$route.params.numberId
    if (numberId) {
      this.form.veh_code = numberId
    }
    this.onSubmit()
    this.getVehType()
    this.getVehKind()
  },
  methods: {
    // 获取车辆型号
    getVehType(){
      this.vehTypeData = []
      this.$client.GetCarModelVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.vehTypeData = req.context.list
        }
      })
    },
    // 车型部分信息获取
    getVehKind(){
      this.vehKindData = []
      this.$client.GetCMDataVehicleManager({type:1}).then(req => {
        if (req.head.result === '200') {
          this.vehKindData = req.context.list
        }
      })
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      console.log(this.form, info)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.is_scrap = 0;
      this.form.veh_code = "";
      this.form.group_id = [];
      this.form.veh_type = '';
      this.form.veh_kind = '';
      this.form.line_id = '';
      setTimeout(() => {
        // alert(111)
        this.$refs.baseTree.onClear()
        this.$refs.vehicleTree.onClear();
      }, 30);
      this.onSubmit()
    },
    // 高级条件的值
    advanceCondition(val){
      console.log(val)
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    AdvancedSet() {
      this.drawerdialogVisible = true;
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
