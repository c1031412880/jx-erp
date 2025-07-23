<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="仓库:" prop="house_id">
          <el-select
            v-model="form.house_id"
            filterable
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in houseOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编号/名称:">
          <el-input v-model="form.material_code" placeholder="请输入物料编号" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="规格型号:">
            <el-input v-model="form.specification" placeholder="请输入规格型号" clearable></el-input>
<!--          <el-select v-model="form.specification" filterable  clearable placeholder="请选择">-->
<!--            <el-option-->
<!--              v-for="item in wuziOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.specification"-->
<!--              :value="item.specification">-->
<!--              <span style="float: left">{{ `${item.specification}(${item.name})` }}</span>-->
<!--            </el-option>-->
<!--          </el-select>-->
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.type" style="width:100px" clearable placeholder="库存数量">
            <el-option
              v-for="item in staffStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item>
           <el-input-number  v-model="form.min" :precision="2"  :controls="false" style="width:100px"></el-input-number>
        </el-form-item>
        <el-form-item  label="--">
         <el-input-number v-model="form.max" :precision="2" :controls="false" style="width:100px"></el-input-number>
        </el-form-item>
         <el-form-item label="库存状态">
          <el-select v-model="form.inventory_type" style="width:100px" clearable >
            <el-option
              v-for="item in inventoryList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="物料分类:" >
             <get-materials-select
                ref="driverTree1"
                v-model="form.group_id"
                :width="'390'"
                :isShowCheckbox="false"
                :placeholder="'请选择分组'"
                :isExportMultiple="false"
              ></get-materials-select>
          </el-form-item>
          <el-form-item label="供应商:">
            <el-input v-model="form.provider_name" placeholder="请输入供应商" clearable>
            </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="showCollapse"  true-label='second' false-label='first'>按批次号分组</el-checkbox>
        </el-form-item>
        <el-form-item  label="批次号:" v-show="showCollapse=='second'">
         <el-input v-model="form.bat_no"  style="width:100px" ></el-input>
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
        <el-form-item>
          <el-button @click="onBtn('export')" v-if="$isPowerShow('export')" icon="el-icon-download"
            >导出</el-button
          >
        </el-form-item>
        <div style="float: right; height: 47px; display: flex" v-if="showCollapse=='first'">
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getMaterialsSelect from 'components/base/formModel/tree/get-materials-select'
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPositionList from "@/components/base/formModel/select/get-position-list";
export default {
  components: { getDepartmentSelect, getPositionList,getMaterialsSelect},
  data() {
    return {
      gongysOptions:[],
      wuziOptions:[],
      isContainEmp: false, //是否显示部门下的人员
      departmentList:[], //部门
      typeWorkProperties:[ //工种属性
        { value: "管理人员", name: "管理人员" },
        { value: "其他", name: "其他" },
      ],
      staffStatusOptions:[ //状态
        { value: "1", name: "库存数量" },
        { value: "2", name: "单价" },
      ],
      jobOptions: [ //岗位

      ],
      showCollapse:'first',
      inventoryList: [ //用工形式
        { value: "0", name: "全部" },
        { value: "1", name: "零库存" },
        { value: "2", name: "非零库存 " },
        { value: "3", name: "正库存" },
        { value: "4", name: "负库存" },
      ],
      date: [],
      houseOptions: [],
      form: {
        house_id: '',
        material_code:'',
        material_name:'',
        mnemonic_code: '',
        specification:'',
        type:'1',
        min:'',
        max:'',
        inventory_type:'',
        group_id:'',
        provider_name:'',
        bat_no:'',
      },
    };
  },
  watch: {
    showCollapse(bool) {
      this.$emit('func',bool)
      this.form.bat_no= ''
    },
  },
  mounted() {
    document.addEventListener("keydown", event => {
      console.log(event,1)
      if (event.code === 'Enter') {
        this.onSubmit()
      }
    })
    this.getwuzi()
    this.getGinsang()
    this.getWarehouse()
  },
  methods: {
    //获取仓库
    getWarehouse() {
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.houseOptions = req.context;
          // if (req.context.length > 0) {
          //   this.form.house_id = req.context[0].id;
          // }
        }
      });
    },
    //供应商
    getGinsang(){
        this.$client.GetProviderPage().then(req => {
            if (req.head.result === '200') {
           this.gongysOptions = req.context.list
          }
          else{
            this.$message({type: 'error', message: '获取失败'})
          }
        })
    },
    //获取物资信息
     getwuzi(){
      this.$client.getMaterialPage({usable:1}).then(req => {
          if (req.head.result === '200') {
          this.wuziOptions = req.context.list
        }
        else{
          this.$message({type: 'error', message: '获取失败'})
        }
      })
    },
    selectedTime: function() {
      // alert(111)
      if(this.date && this.date.length>0) {
        this.form.begin = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.begin = '';
        this.form.end = '';
      }
    },
    onSelectChange(vehs, nodes) {
      // alert(JSON.stringify(nodes))
      if (nodes && nodes.length > 0) {
        // nodes.forEach((item, index) => {
        //   delete item.children;
        // });
        // this.ruleForm.reminders = nodes;
      } else {
        // this.ruleForm.reminders = [];
      }
    },

    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if (info.material_code) {
        info.material_name = info.material_code;
        info.mnemonic_code = info.material_code;
      }
      // if(info.i_department_base.length == 0) {
      //   delete info.i_department_base
      // }
      // if(this.form.i_position_id === 0) {
      //   info.i_position_id = 0
      // }
      // console.log(info)
      // return
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      this.form.material_name = '',
      this.form.material_code = '',
      this.form.mnemonic_code = '',
      this.form.specification = '',
      this.form.type = '1',
      this.form.min = '',
      this.form.max = '',
      this.form.inventory_type = '',
      this.form.group_id = '',
      this.form.provider_name = '',
      this.form.bat_no = '',
      // 清空部门选中
      this.$refs.driverTree1.onClear()
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>
