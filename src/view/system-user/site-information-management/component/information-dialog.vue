<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
    append-to-body
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="站点简称:" prop="SimpleName">
          <el-input v-model="form.SimpleName" placeholder="请输入站点简称" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="站点全称:" prop="Name">
          <el-input v-model="form.Name" placeholder="请输入站点全称" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="站点类型:" prop="Kind">
          <el-select v-model="form.Kind" clearable placeholder="请选择" :disabled="curSelecedType == 'detail'">
            <el-option
              v-for="item in siteTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经度:" prop="Longitude">
          <el-input v-model="form.Longitude" placeholder="请输入经度，范围0-180" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.Longitude = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="纬度:" prop="Latitude">
          <el-input v-model="form.Latitude" placeholder="请输入纬度，范围0-90" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.Latitude = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
        <el-form-item label="半径:" prop="Radius">
          <el-input v-model="form.Radius" placeholder="请输入半径" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.Radius = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item><el-form-item label="方位角:" prop="Reserve">
          <el-input v-model="form.Reserve" placeholder="请输入方位角" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.Reserve = $event.target.value" :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>

        <el-form-item label="备注:" prop="Remark">
          <el-input
            v-model="form.Remark" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入备注"
            :disabled="curSelecedType == 'detail'"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer" v-if="curSelecedType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
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
      date: [],
      siteTypeOptions:[
        {
          value: '100',
          label: '普通'
        }, {
          value: '200',
          label: '主站'
        }, {
          value: '300',
          label: '副站'
        }, {
          value: '400',
          label: '预警点'
        }, {
          value: '500',
          label: '停车场'
        }
      ],
      form: {
        id: "",
        SimpleName: "",
        Name:"",
        Latitude: "",
        Longitude: "",
        Radius: "",
        Kind: "",
        Reserve: "",
        Remark: "",
        NameReserve: "",
      },
      basicRules: {
        SimpleName: [
          { required: true, message: "请输入站点简称", trigger: "change" },
        ],
        Name: [
          { required: true, message: "请输入站点全称", trigger: "change" },
        ],
        Kind: [
          { required: true, message: "请输入站点类型", trigger: "change" },
        ],
        Latitude: [
          { required: true, message: "请输入经度", trigger: "change" },
        ],
        Longitude: [
          { required: true, message: "请输入纬度", trigger: "change" },
        ],
        Radius: [
          { required: true, message: "请输入半径", trigger: "change" },
        ],
        Reserve: [
          { required: true, message: "请输入方位角", trigger: "change" },
        ],
        // c_remark: [
        //   { required: true, message: "请填写岗位描述", trigger: "change" },
        // ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
   
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
</style>

