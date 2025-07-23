<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="物料编号/名称:">
          <el-input @keyup.enter.native="onSubmit" v-model="form.material_coce" placeholder="请输入物料编号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="规格型号:">
          <el-input @keyup.enter.native="onSubmit" v-model="form.specification" placeholder="请输入规格型号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="仓库:">
          <el-select v-model="form.house_id" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in stoneOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓位:">
          <el-input @keyup.enter.native="onSubmit" v-model="form.position_name" placeholder="请输入仓位" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button>
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button type="text" @click="AdvancedSet">高级筛选</el-button>-->
<!--        </el-form-item>-->
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="onExport()" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-download"
            >导入</el-button
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
        {value: '0',
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
      drawerdialogVisible: false,
      stoneOptions:[],
      vehTypeData: [],
      vehKindData: [],
      isContainEmp: false,
      funcType: 1, // 功能类别 1 运营单元 2 维修单元 3 仓储单元
      form: {
        // usable: '0',
        specification:'',
        house_id: '',
        area: '',
        mnemonic_code: '',
        name: '',
        position_name: '',
        code: '',
        material_coce: ''
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
    onExport(){
      let info = this.$outFormData(this.form)
      // console.log(this.form, info)
      this.$emit("on-export", info);
    },
    // 获取车辆型号
    getVehType(){
      this.vehTypeData = []
      this.$client.GetCarModelVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.vehTypeData = req.context.list
        }
      })
      this.$client.getRecord1Warehouse().then(req => {
        if (req.head.result === '200') {
        this.stoneOptions = req.context
      }
      else{
        this.$message({type: 'error', message: '获取失败'})
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
      if (info.material_coce) {
        info.material_name = info.material_coce
        info.material_code = info.material_coce
        info.mnemonic_code  = info.material_coce
      } else {
        info.material_name = ''
        info.material_code = ''
        info.mnemonic_code  = ''
      }
      // console.log(this.form, info)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.specification = '';
      this.form.name = '';
      this.form.position_name = '';
      this.form.code = '';
      this.form.house_id = '';
      this.onSubmit()
    },
    // 高级条件的值
    advanceCondition(val){
      // console.log(val)
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
