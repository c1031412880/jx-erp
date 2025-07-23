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
       <template slot-scope="scope" slot="rank_id">
          <get-select-dictionaries 
            style="width:100%"
            v-model="scope.data.rank_id" 
            :classKey="'职级'" 
            :placeholder="'请选择职级'" 
          ></get-select-dictionaries>
        </template>
        <template slot-scope="scope" slot="basic_year_salary">
          <el-input
            v-model="scope.data.basic_year_salary"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="scope.data.basic_year_salary = $event.target.value"
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
          label: "职级",
          prop: "rank_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "基本年薪(元)",
          prop: "basic_year_salary",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 2,
        },
      ],
      TableHeight: 500
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
      this.$client.GetSalarySetting({type: 1}).then(res => {
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
        type: 1,
        rank_id: '',
        basic_year_salary: '',
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
