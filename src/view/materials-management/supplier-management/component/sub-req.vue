<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="供应商编号:">
          <el-input @keyup.enter.native="onSubmit" v-model="form.code" placeholder="请输入供应商编号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商名称:">
          <el-input @keyup.enter.native="onSubmit" v-model="form.name" placeholder="请输入供应商名称" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商类型:">
          <el-select v-model="form.type" placeholder="请选择" clearable>
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="助记码:">
          <el-input @keyup.enter.native="onSubmit" v-model="form.mnemonic_code" placeholder="请输入助记码" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="启用状态:">
          <el-select v-model="form.usable" placeholder="请选择" clearable>
            <el-option
              v-for="item in minitabOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户分类:">
          <get-select-dictionaries v-model="form.custom_type" :classKey="'客户分类'" :placeholder="'请选择'" clearable></get-select-dictionaries>
        </el-form-item>
        <el-form-item label="区域分类:">
          <get-select-dictionaries v-model="form.area" :classKey="'区域分类'" :placeholder="'请选择'"  clearable></get-select-dictionaries>
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
          <el-button @click="onBtn('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            title="确定删除勾选中的信息吗？"
            @confirm="onBtn('del')">
            <el-button slot="reference" >删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <!-- <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div> -->
      </el-row>
    </el-form>
    <drawer-dialog :drawer.sync="drawerdialogVisible" @on-submit-condition="advanceCondition"></drawer-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import drawerDialog from "./dialog/drawer-dialog";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: { drawerDialog,getDepartmentSelect,getSelectDictionaries },
  data() {
    return {
      minitabOptions:[
      {
        value: '0',
        label: '全部'
      },
      {
        value: '1',
        label: '已启用'
      },
      {
        value: '2',
        label: '已停用'
        }
      ],
      typeOptions:[
        {
          value: 1,
          label: '配件'
        },
        {
          value: 2,
          label: '轮胎'
        },
      ],
      drawerdialogVisible: false,
      vehTypeData: [],
      vehKindData: [],
      isContainEmp: false,
      funcType: 1, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      form: {
        usable: '0',
        custom_type: '',
        area: '',
        mnemonic_code: '',
        name: '',
        code: '',
        type: '',
      },
    };
  },
  mounted() {
    let vehmodelId = this.$route.query.vehmodelId
    if (vehmodelId) {
      this.form.veh_type = vehmodelId
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
      this.form.usable = '0';
      this.form.custom_type = '';
      this.form.area = '';
      this.form.mnemonic_code = '';
      this.form.name = '';
      this.form.code = '';
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
