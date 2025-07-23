<template>
  <div>
    <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="850px"
    
  >
    <div class="el-dialog-div">
      <div style="display: flex; align-items: center; margin-bottom: 5px">
        <el-button type="primary" size="small" @click="add()">新增</el-button>
        <!-- <el-button type="danger" size="small" @click="del()">删除</el-button> -->
      </div>
      <tr-table
        ref="table"
        :data="data"
        :tableHeaderList="customSettingList"
        :TableHeight="400"
        :loading="loading"
        >
        <template slot-scope="scope" slot="vaild_day">
          <span>{{ scope.data.vaild_day == -1 ? "无限期": scope.data.vaild_day }}</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-popconfirm v-if="$isPowerShow('del')" @confirm="deleteCurRowInfo(scope.data)" title="是否确删除此条记录？">
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm>
        </template>
      </tr-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog
    width="400px"
    :title="innerType == 'add'? '添加物品': '编辑物品'"
    :visible.sync="innerVisible"
    append-to-body>
    <div class="inner-dialog-div">
      <el-form :model="good_form" ref="good_form" :rules="Rules" label-width="125px" size="mini">
        <el-form-item label="物品类别:" prop="type">
          <el-input v-model="good_form.type" placeholder="请输入物品类型" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否有期限">
        <el-radio-group v-model="good_form.isPeriod" @change="changePeriod">
          <el-radio :label="1">有期限</el-radio>
          <el-radio :label="2">无期限</el-radio>
        </el-radio-group>
        </el-form-item>
        <el-form-item label="有效时间段(天):" prop="vaild_day">
          <el-input 
            v-model="good_form.vaild_day" 
            placeholder="请输入有效时间段（天）" 
            :disabled="good_form.isPeriod == 2"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="good_form.vaild_day = $event.target.value"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="innerVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="saveClassification" size="mini">{{ innerType == "add" ? "添 加": "保 存" }}</el-button>
    </span>
  </el-dialog>
  </div>

</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "物品类别设置"
    },
    curChangeType: {
      type: String,
      default: "add" //add添加  edit编辑  detail详情
    },
  },
  mounted() {},
  data() {
    return {
      good_form: {
        id: 0,
        isPeriod: 1,//物品是否有期限
        lost_type: "",
        vaild_day: "",
      },
      data: [],
      ids: [],//物品类别表选中的id
      loading: false,
      customSettingList: [
        {
          id: 1,
          label: "物品类别",
          prop: "type",
          width: "140",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "有效期时间段",
          prop: "vaild_day",
          width: "140",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "140",
          align: "center",
          signIndex: 2,
        },
      ],
      innerVisible: false,//添加物品分类
      innerType: "add",
      innerTitle: "添加物品",
      Rules:{
        lost_type: [
          {
            required: true,
            message: "请输入物品类别",
            trigger: "change",
          },
        ],
        vaild_day: [
          {
            required: true,
            message: "请输入有效时间",
            trigger: "change",
          },
        ],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.loadTypeData()
      }
    },
    innerVisible(bool) {
      if (bool === false) {
        this.good_form = {
          isPeriod: 1,
          type: "",
          vaild_day: "",
        }
        this.$refs.good_form.clearValidate();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 添加
    add() {
      this.innerType = "add"
      this.innerVisible = true;
      this.innerTitle = "添加物品"
    },
    //编辑物品类别
    editInfo(form) {
      this.innerType = "edit"
      this.innerTitle = "添加物品"
      //给单选框赋值
      if(form.vaild_day == -1){
        form.isPeriod = 2
      }else{
        form.isPeriod = 1
      }
      this.good_form =  JSON.parse(JSON.stringify(form))
      this.innerVisible = true;
    },
    // 删除物品类别
    deleteCurRowInfo(row) {
      let params = {
        context:{
          id:row.id
        }
      }
      this.$client.DeleteLostArticleType(params).then(res => {
        if (res.head.result == "200") {
          this.loadTypeData()
          this.$message({ type: "success", message: "删除成功" });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    //如果物品是无期限 则传-1
    changePeriod(value){
      if(value == 2){
        this.good_form.vaild_day = "-1"
      }else{
        this.good_form.vaild_day = ""
      }
    },
    //加载物品类别信息
    loadTypeData(){
      this.loading = true;
      let params = {
        context:{}
      };
      this.$client.getListLostType(params).then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
        this.loading = false;
      });
    },
    //保存物品类别
    saveClassification(){
      let params = {
        context: Object.assign({}, this.good_form)
      }
      this.$refs.good_form.validate(valid => {
        if (valid) {
          if(this.innerType == "add"){
            //走添加接口
            this.$client.addLostArticleType(params).then(res => {
              if (res.head.result == "200") {
                this.loadTypeData()
                this.innerVisible = false
                this.$message({ type: "success", message: "添加成功" });
              } else {
                  this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              }
            });
          }else{
            //走编辑接口
            this.$client.editLostArticleType(params).then(res => {
              if (res.head.result == "200") {
                this.loadTypeData()
                this.innerVisible = false
                this.$message({ type: "success", message: "编辑成功" });
              } else {
                  this.$message({
                  showClose: true,
                  message: res.head.describle,
                  type: "error",
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //提交数据
    updatePlaybill() {
      this.$emit("save");
    }
  }
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 450px;
}
.inner-dialog-div {
  height: 120px;
}

.inner-dialog-div /deep/ .el-input {
  width: 220px;
}

.inner-dialog-div /deep/ .el-input__inner {
  width: 220px;
}

</style>

