<template>
  <!-- 需求很乱 -->
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="600px"
    
    append-to-body
  >
    <div class="el-dialog-div">
      <el-form :model="form" ref="form" label-width="140px" size="mini">
        <el-form-item 
          label="回收项目:" 
          prop="type"
          :rules="[
            { required: true, message: '请选择回收项目', trigger: 'change' },
          ]">
          <el-select v-model="form.type" @change="selectedType" :disabled="curSelecedType != 'add'" style="width:100%" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="唯一标识:" prop="unique_card" v-if='[2,5,6,7].indexOf(form.type) !== -1'>
          <el-input v-model="form.unique_card" :disabled="curSelecedType == 'detail'" placeholder="请输入唯一标识" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item 
          label="规格型号:" 
          prop="specifications" 
          v-if="form.type == 1 || form.type == 3"
          :rules="[
            { required: true, message: '请选择规格型号', trigger: 'change' },
          ]">
          <get-battery-type-list v-model="form.specifications" :isValueId="false" :disabled="curSelecedType == 'detail'" v-if="form.type == 1" style="width:100%"></get-battery-type-list>
          <get-tyre-model v-model="form.specifications" :isValueId="false" placeholder="选择轮胎型号" :disabled="curSelecedType == 'detail'" v-if="form.type == 3" style="width:100%"></get-tyre-model>
        </el-form-item>
        <el-form-item 
          label="单位:" 
          prop="unit" 
          v-if="[1,3,4].indexOf(form.type) !== -1"
          :rules="[
            { required: true, message: '请输入单位', trigger: 'change' },
          ]"
        >
          <el-input v-model="form.unit" placeholder="请输入单位" disabled style="width:100%"></el-input>
        </el-form-item>

        <el-form-item label="折合(吨):" prop="reduced" v-if="form.type == 1 || form.type == 3 || form.type == 6">
          <el-input v-model="form.reduced" placeholder="请输入折合(吨)" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.reduced = $event.target.value" disabled style="width:100%"></el-input>
        </el-form-item>

        <!-- <el-form-item label="折合:" prop="reduced" v-if="form.type == 6">
          <el-row>
            <el-col :span="20">
              <el-input v-model="form.reduced" placeholder="请输入折合" :disabled="curSelecedType == 'detail'" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.reduced = $event.target.value" style="width:100%" @input="changeReduced"></el-input>
            </el-col>
            <el-col :span="4">
              <div style="text-align:center">kg/个</div>
            </el-col>
          </el-row>
        </el-form-item> -->
        <el-form-item 
          label="回收日期:" 
          prop="recycle_date"
          :rules="[
            { required: true, message: '请选择回收日期', trigger: 'change' },
          ]">
          <el-date-picker
            v-model="form.recycle_date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择回收日期"
            style="width:100%"
            :disabled="curSelecedType == 'detail'"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="回收数量:" v-if="form.type == 1 || form.type == 3">
          <el-input v-model="form.recycle_count" placeholder="请输入回收数量" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.recycle_count = $event.target.value" @input="countRecycleWeight" :disabled="curSelecedType == 'detail'" style="width:100%"></el-input>
        </el-form-item>

        <el-form-item 
          label="回收重量:" 
          prop="recycle_weight" 
          v-if="[1,3,4].indexOf(form.type) !== -1"
          :rules="[
            { required: true, message: '请输入回收重量', trigger: 'change' },
          ]">
          <el-input v-model="form.recycle_weight" placeholder="请输入回收重量" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.recycle_weight = $event.target.value" :disabled="curSelecedType == 'detail'" style="width:100%"></el-input>
        </el-form-item>
        <el-row v-if="form.type == 6" v-for="(item, index) in form.waste_details" :key="index">
          <el-col style="display: flex;align-items: center;">
            <p
              style="
              width: 6px;
              height: 16px;
              background: #409eff;"></p>
            <span
              style="
              margin: 0 20px 0 5px;
              color: #000000;
              font-size: 14px;
              font-weight: bold;">明细</span>
            <el-button type="text" @click="addDetails(index)">新增</el-button>
            <el-button type="text" @click="delDetails(index)" style="color: red;" v-show="index">删除</el-button>
          </el-col>
          <el-form-item 
            label="规格型号:" 
            :prop="'waste_details.' + index + '.specifications'">
            <el-input v-model="item.specifications" :disabled="curSelecedType == 'detail'" placeholder="请选择规格型号" style="width:100%"></el-input>
          </el-form-item>
          <el-form-item 
            label="入库量:" 
            :prop="'waste_details.' + index + '.recycle_count'" 
            :rules="[
              { required: true, message: '请输入入库量', trigger: 'change' },
            ]">
            <el-row>
              <el-col :span="20">
                <el-input v-model="item.recycle_count" placeholder="请输入回收数量" oninput="value=value.replace(/[^\d.-]/g,'')" 
                @blur="item.recycle_count = $event.target.value" :disabled="curSelecedType == 'detail'" style="width:100%" @input="countRowRecycleWeight(index)"></el-input>
              </el-col>
              <el-col :span="4">
                <div style="text-align:center">{{unitType}}</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item 
            label="单个重量:" 
            :prop="'waste_details.' + index + '.average_weight'" 
            :rules="[
              { required: true, message: '请输入单个重量', trigger: 'change' },
            ]">
            <el-row>
              <el-col :span="20">
                <el-input v-model="item.average_weight" placeholder="请输入单个重量" oninput="value=value.replace(/[^\d.-]/g,'')" 
                @blur="item.average_weight = $event.target.value" :disabled="curSelecedType == 'detail'" style="width:100%" @input="countRowRecycleWeight(index)"></el-input>
              </el-col>
              <el-col :span="4">
                <div style="text-align:center">kg/个</div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item 
            label="入库重量:" 
            :prop="'waste_details.' + index + '.recycle_weight'"  
            :rules="[
              { required: true, message: '请输入入库重量', trigger: 'change' },
            ]">
            <el-row>
              <el-col :span="20">
                <el-input v-model="item.recycle_weight" placeholder="请输入入库重量" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.recycle_weight = $event.target.value" disabled style="width:100%"></el-input>
              </el-col>
              <el-col :span="4">
                <div style="text-align:center">kg</div>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-form-item 
          label="入库量:" 
          prop="recycle_count" 
          v-if="[2,5,7].indexOf(form.type) !== -1"
          :rules="[
            { required: true, message: '请输入入库量', trigger: 'change' },
          ]">
          <el-row>
            <el-col :span="20">
              <el-input v-model="form.recycle_count" placeholder="请输入回收数量" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.recycle_count = $event.target.value" :disabled="curSelecedType == 'detail'" style="width:100%" @input="countRecycleWeight"></el-input>
            </el-col>
            <el-col :span="4">
              <div style="text-align:center">{{unitType}}</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item 
          label="入库重量:" 
          prop="recycle_weight" 
          v-if="[2,5,7].indexOf(form.type) !== -1"
          :rules="[
            { required: true, message: '请输入入库重量', trigger: 'change' },
          ]">
           <el-row>
            <el-col :span="20">
              <el-input v-model="form.recycle_weight" placeholder="请输入入库重量" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.recycle_weight = $event.target.value" :disabled="curSelecedType == 'detail'" style="width:100%"></el-input>
            </el-col>
            <el-col :span="4">
              <div style="text-align:center">kg</div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="回收单位:" prop="recycle_unit">
          <!-- <el-input v-model="form.recycle_unit" placeholder="请输入回收单位" :disabled="curSelecedType == 'detail'"></el-input> -->
          <get-select-dictionaries 
            v-model="form.recycle_unit" 
            :isMultiple="false" 
            :classKey="'回收单位'" 
            :disabled="curSelecedType == 'detail'"
            style="width:100%"
            :placeholder="'请选择回收单位:'">
          </get-select-dictionaries>
        </el-form-item>

        <el-form-item label="备注:" prop="remark">
          <el-input
            v-model="form.remark" 
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
import getBatteryTypeList from "@/components/base/formModel/select/get-battery-type-list";
import getTyreModel from "@/components/base/formModel/select/get-tyre-model";
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {getBatteryTypeList, getTyreModel, getSelectDictionaries},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
    if (sessionStorage.getItem('wasteType')) {
      this.form.type = Number(sessionStorage.getItem('wasteType'))
    }
  },
  data() {
    return {
      typeOptions:[
        {
          value: 1,
          label: '废电瓶'
        }, 
        {
          value: 2,
          label: '废机油'
        }, 
        {
          value: 3,
          label: '废轮胎'
        }, 
        {
          value: 4,
          label: '废铁'
        },
        {
          value: 5,
          label: '废机油壶'
        },
        {
          value: 6,
          label: '废铅酸蓄电池'
        },
        {
          value: 7,
          label: '废机油滤芯'
        },
      ],
      form: {
        id: "",
        type: '',
        specifications: "",
        unit:"",
        reduced: "",
        recycle_date: "",
        recycle_count: "",
        recycle_weight: "",
        recycle_unit: "",
        remark: "",
        unique_card: "",
        waste_details: [{
          specifications: "",
          recycle_count: "",
          recycle_weight: "",
          average_weight: ""
        }]
      },
      // basicRules: {
      //   type: [
      //     { required: true, message: "请选择回收项目", trigger: "change" },
      //   ],
      //   specifications: [
      //     { required: true, message: "请选择规格型号", trigger: "change" },
      //   ],
      //   unit: [
      //     { required: true, message: "请输入单位", trigger: "change" },
      //   ],
      //   recycle_date: [
      //     { required: true, message: "请选择回收日期", trigger: "change" },
      //   ],
      //   recycle_count: [
      //     { required: true, message: "请输入入库量", trigger: "change" },
      //   ],
      //   recycle_weight: [
      //     { required: true, message: "请输入回收重量", trigger: "change" },
      //   ]
      // },
    };
  },
  computed:{
    unitType(){
      let obj = {
        2: '升',
        5: 'kg',
        6: '个',
        7: 'kg',
      }
      return obj[this.form.type]
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.setDate();
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    changeReduced(val){
      if (!val) return 
      this.form.waste_details.forEach(item => {
        item.recycle_weight = Number(item.recycle_count) * Number(val)
      })
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认日期为当天
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      this.form.recycle_date = Y + '-' + M + '-' + D
    },

    // 选择规格型号
    selectedType(val) {
      if(!!val) {
        switch (val) {
          case 1:
            this.form.unit = '只'
            this.form.reduced = 0.25
            break;
          case 3:
            this.form.unit = '条'
            this.form.reduced = 0.02
            break;
          case 2:
          case 4:
            this.form.unit = '吨'
            break;
        }
      }else{
        this.form.unit = ''
        this.form.reduced = ''
      }
    },
    // 计算回收重量
    countRecycleWeight(val) {
      if([1,3,6].indexOf(this.form.type) !== -1) {
        this.form.recycle_weight = Number(val) * Number(this.form.reduced)
      }
      if ([2,5,7].indexOf(this.form.type) !== -1) {
        this.form.recycle_weight = JSON.parse(JSON.stringify(val))
      }
    },
    // 计算入库重量
    countRowRecycleWeight(index) {
      this.form.waste_details[index].recycle_weight = Number(this.form.waste_details[index].recycle_count) * Number(this.form.waste_details[index].average_weight)
      this.getReduced()
    },
    // 新增
    addDetails(index) {
      this.form.waste_details.splice(index, 0, {
        specifications: "",
        recycle_count: "",
        recycle_weight: "",
        average_weight: "",
      })
    },
    // 获取折合
    getReduced() {
      let sum = this.form.waste_details.reduce((prev,item) => {
        prev += Number(item.recycle_weight)
        return prev
      },0)
      let nums = this.form.waste_details.reduce((prev,item) => {
        prev += Number(item.recycle_count)
        return prev
      },0)

      this.form.reduced = Number((sum / nums).toFixed(2))
    },
    // 删除
    delDetails(index) {
      this.form.waste_details.splice(index, 1)
    },
    updatePlaybill(formName) {
      console.log(this.form);
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

</style>

