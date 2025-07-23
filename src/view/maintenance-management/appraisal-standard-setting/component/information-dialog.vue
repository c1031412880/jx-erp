<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="标准名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入标准名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="车辆型号:" prop="c_name">
          <el-select v-model="form.name" clearable placeholder="车辆型号">
            <el-option
              v-for="item in carNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="燃料类别:" prop="c_name">
          <el-input v-model="form.c_name" placeholder="请输入燃料类别"></el-input>
        </el-form-item> -->
        <el-form-item label="线路:" prop="line_id">
          <get-line-select-tree
            ref="lineTree"
            :placeholder="'选择线路'"
            :isShowCheckbox="false"
            v-model="form.line_id"
            :isExportMultiple="false"
            :width="'380'"
          >
          </get-line-select-tree>
        </el-form-item>
        <el-form-item label="燃料标准值:" prop="fuel_standard_value">
          <el-input v-model="form.fuel_standard_value" placeholder="请输入燃料标准值" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.fuel_standard_value = $event.target.value"><template slot="append">L/100KM</template></el-input>
        </el-form-item>
        <el-form-item label="材料标准值:" prop="material_standard_value">
          <el-input v-model="form.material_standard_value" placeholder="请输入材料标准值" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.material_standard_value = $event.target.value"><template slot="append">元/100KM</template></el-input>
        </el-form-item>
        <el-form-item label="轮胎标准值:" prop="tyre_standard_value">
          <el-input v-model="form.tyre_standard_value" placeholder="请输入轮胎标准值" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.tyre_standard_value = $event.target.value"><template slot="append">元/100KM</template></el-input>
        </el-form-item>
        <el-form-item label="生效日期范围:" prop="start_date">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="selectedTime"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
export default {
  components: {getLineSelectTree},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date:[],
      form: {
        id: "",
        name: "",
        line_id: "",
        fuel_standard_value: "",
        material_standard_value: "",
        tyre_standard_value: "",
        start_date: "",
        end_date: "",
      },
      basicRules: {
        name: [
          { required: true, message: "请输入标准名称", trigger: "change" },
        ],
        line_id: [
          { required: true, message: "请选择线路", trigger: "change" },
        ],
        fuel_standard_value: [
          { required: true, message: "请输入燃料标准值", trigger: "change" },
        ],
        material_standard_value: [
          { required: true, message: "请输入材料标准值", trigger: "change" },
        ],
        tyre_standard_value: [
          { required: true, message: "请输入轮胎标准值", trigger: "change" },
        ],
        start_date: [
          { required: true, message: "请输入生效日期范围", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        Object.assign(this.$data, this.$options.data());
      }else{
         // 获取车辆型号信息
          // this.reqCmDataInfo('1');
        this.$nextTick( () => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    resetData() {
      this.$refs.lineTree.onClear();
    },
    selectedTime: function() {
      if(this.date && this.date.length>0) {
        this.form.start_date = this.date[0];
        this.form.end_date = this.date[1];
      }else{
        this.form.start_date = '';
        this.form.end_date = '';
      }
    },
    // reqCmDataInfo(type) {
    //   let context = {
    //     type: type
    //   };
    //   this.$client.GetCMDataVehicleManager(context)
    //   .then(res =>  {
    //     if(res.head.result == '200') {
    //       let dataList = res.context;
    //       if(type == '1') {
    //         this.carNameOptions = this.bulidOptions(dataList)
    //       }
    //     }else{
    //       this.$message({
    //         showClose: true,
    //         message: res.head.describle,
    //         type: "error",
    //       });
    //     }
    //   })
    // },
    // bulidOptions(list) {
    //   let bulidList = [];
    //   list.forEach(item => {
    //     let obj = {
    //       value: item,
    //       label: item
    //     }
    //     bulidList.push(obj)
    //   });

    //   return bulidList
    // },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
.el-dialog-div /deep/ .el-range-editor--mini {
  width: 420px;
}
</style>

