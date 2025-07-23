<!--  -->
<template>
  <div>
    <el-drawer
      title="高级筛选"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="dialogClose"
      size="650px"
    >
    <div class="advanced-filter ">
      <el-form ref="form" :model="form"  label-width="80px">
        <el-row :gutter="50">
          <el-col :span="12">
            <el-form-item label="关联单号:">
              <el-input  clearable v-model="form.relate_num" placeholder="请输入关联单号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="采购员:">
              <el-select v-model="form.buyer_ids" clearable multiple collapse-tags placeholder="采购员">
                <el-option
                  v-for="item in buyerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓管员:">
              <el-select v-model="form.storage_ids" clearable multiple collapse-tags placeholder="仓管员">
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人:">
              <get-department-select
                ref="personalTree"
                v-model="form.created_ids"
                :isShowCheckbox="true"
                :placeholder="'请选择创建人'"
                :isContainEmp="true"
                :isExportMultiple="true"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="入库仓库:">
              <el-select v-model="form.house_ids" clearable multiple collapse-tags placeholder="入库仓库">
                <el-option
                  v-for="item in stoneOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="付款状态:">
              <el-select placeholder="" clearable v-model="form.pay_state">
                <el-option
                  v-for="item in paymentStatus"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button icon="el-icon-refresh-left" @click="resetForm('form')">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    </el-drawer>
  </div>
</template>

<script>
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  data() {
    return {
      buyerList:[],
      warehouseList: [],
      stoneOptions: [],
      carNameOptions: [],
      paymentStatus: [
        {
          value: 1,
          label: '未入账'
        },
        {
          value: 2,
          label: '已入账'
        },
      ],
      form:{
        relate_num: "",
        buyer_ids:[],
        storage_ids:[],
        house_ids:[],
        created_ids: [],
        pay_state: '',
      },
    };
  },
  components: {
    getDepartmentSelect
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.getWarehouse()
        this.GetWHPerson()
      }
    }
  },

  methods: {
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    //获取仓库
    getWarehouse() {
      let params ={
        usable: 1 //1 启用， 2 未启用
      }
      this.$client.getRecord1Warehouse(params).then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context;
        }
      });
    },
    //获取仓管员
    GetWHPerson() {
      this.buyerList = []
      this.warehouseList = [];
      this.$client.GetWHPerson({}).then((req) => {
        if (req.head.result === "200") {
          this.buyerList = this.unique(JSON.parse(JSON.stringify(req.context)))
          if (req.context.length > 0) {
            this.warehouseList = req.context.filter(item => {
              return item.is_operater == 1
            })
          }
        }
      });
    },
    //去重
    unique(arr) {
      let map = new Map();
      for (let item of arr) {
          map.set(item.id, item);
      }
      return [...map.values()];
    },
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm() {
      this.form.buyer_ids = []
      this.form.storage_ids = []
      this.form.house_ids = []
      this.form.created_ids = []
      this.form.pay_state = "";
      this.$refs.personalTree.onClear()
    }
  },
};
</script>
<style lang='scss' scoped>
.advanced-filter{
  padding: 0 40px;
}
.demo-drawer__footer{
  margin-top: 40px;
}
</style>
