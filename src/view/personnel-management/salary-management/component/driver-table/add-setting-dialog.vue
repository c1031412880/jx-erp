<template>
  <el-dialog 
    :visible="dialogBool" 
    title="职级薪资设定" 
    :before-close="dialogClose" 
    width="900px"  
  >
    <div style="margin-bottom: 10px">
      <el-button type="primary" @click="add()">添加</el-button>
    </div>
    <div>
      <tr-table
        :indexShow="false"
        :selectionShow="false"
        :data="data"
        :tableHeaderList="customSettingList"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="1"
        :backFixedNum="1"
      >
       <template slot-scope="scope" slot="licence_id">
          <el-select v-model="scope.data.licence_id" placeholder="请选择驾照类型">
            <el-option
              v-for="item in licenceGradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="month_basic_salary">
          <el-input
            v-model="scope.data.month_basic_salary"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="scope.data.month_basic_salary = $event.target.value"
          ></el-input>
        </template>
        <template slot-scope="scope" slot="monthly_performance_bonus">
          <el-input
            v-model="scope.data.monthly_performance_bonus"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="scope.data.monthly_performance_bonus = $event.target.value"
          ></el-input>
        </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="delect(scope.index)">删除</el-button>
      </template>
    </tr-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: {
    getSelectDictionaries
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      selectedId: '',
      activeName: 'first',
      showTitle:'添加',
      loading: false,
      data: [],
      customSettingList: [
        {
          id: 1,
          label: "驾照等级",
          prop: "licence_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "月基本工资(元)",
          prop: "month_basic_salary",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "月度考核奖",
          prop: "monthly_performance_bonus",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 3,
        },
      ],
      TableHeight: 500,
      licenceGradeOptions:[
        {
          value: "A1",
          label: "A1",
        },
        {
          value: "A2",
          label: "A2",
        },
        {
          value: "A3",
          label: "A3",
        },
        {
          value: "B1",
          label: "B1",
        },
        {
          value: "B2",
          label: "B2",
        },
        {
          value: "C1",
          label: "C1",
        },
        {
          value: "C2",
          label: "C2",
        },
        {
          value: "C3",
          label: "C3",
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetData();
        this.btnLoading = false
      }else{
        this.loadData()
      }
    },
  },
  methods: {
    loadData() {
      this.$client.GetSalarySetting({type: 2}).then(res => {
        if (res.head.result == "200") {
          this.data = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })

    },
    add() {
      this.data.push({
        type: 2,
        licence_id: '',
        month_basic_salary: '',
        monthly_performance_bonus: '',
      })
    },
    delect(index) {
      this.data.splice(index,1)
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    submit(){
      let params = {
        context: this.data
      }
      this.$client.AddSalarySetting(params).then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success",
          });
          this.dialogClose()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
