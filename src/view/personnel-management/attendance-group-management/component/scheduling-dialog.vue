<template>
  <el-dialog
    :visible="dialogBool"
    title="设置排班周期"
    :before-close="dialogClose"
    width="700px"
    top="80px"
    :close-on-click-modal="false"
    append-to-body
  >
    <div class="el-dialog-div">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item 
          label="周期名称" 
          :rules="[{ required: true, message: '周期名称不能为空'}]"
          >
          <el-input maxlength="6" show-word-limit v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="" label-width="0">
          <div class="show-flex-box-r" style="align-items:center;margin:15px 0;">
            <strong>循环周期：</strong>
            <el-button @click="addTable()" type="primary" icon="el-icon-plus" size="mini" style="margin:0 15px">添加</el-button>
          </div>
          <tr-table
            :selectionShow="false"
            :indexShow="false"
            :data="form.tableData"
            :tableHeaderList="schedulingTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="200"
            :loading="false"
            :frontFixedNum="0"
            :backFixedNum="0"
            :isFixedEmptyPlaceholder="false"
          >
            <template slot-scope="scope" slot="name">
              <span>{{`第${scope.index + 1}天`}}</span>
            </template>
            <template slot-scope="scope" slot="kqbc_id">
              <el-select v-model="scope.data.kqbc_id" size="mini">
                <el-option
                  v-for="item in data"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button type="text" size="mini" @click="del(scope.index)">删除</el-button>
            </template>
          </tr-table>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    classesData: {
      type: Array,
      default: [],
    },
    schedulingKeys: {
      type: Array,
      default: [],
    },
  },
  mounted() {
  },
  data() {
    return {
      data: [],
      form: {
        name: '',
        tableData: []
      },
      schedulingTableHeader: [
        {
          id: 1,
          label: "名称",
          prop: "name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "排班",
          prop: "kqbc_id",
          width: "250",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 4,
          label: "操作",
          prop: "operation",
          width: "80",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.getSchedulingData()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    getSchedulingData(){
      let data = this.classesData.filter(item => {return this.schedulingKeys.indexOf(item.id) !== -1})
      let list = [
        {
          id: -1,
          name: '休息'
        }
      ]
      this.data = [...data,...list]
    },
    addTable() {
      let index = this.form.tableData.length
      if (index > 30) {
        this.$message({
          message: '循环排班最多31天',
          type: 'warning'
        });
        return false
      }
      this.form.tableData.push({
        name: '',
        kqbc_id: '',
      })
    },
    del(index) {
      this.form.tableData.splice(index,1)
    },
    updatePlaybill() {
      if (this.form.name == '') {
        this.$message({
          message: '周期名称不能为空',
          type: 'warning'
        });
        return false
      }
      if (this.form.tableData.length < 1) {
        this.$message({
          message: '循环周期不能少于两条',
          type: 'warning'
        });
        return false
      }

      let success = true

      this.form.tableData.forEach(item => {
        if (item.kqbc_id == '') {
          success = false
        }
      })

      if (!success) {
        this.$message({
          message: '排班不能为空',
          type: 'warning'
        });
        return false
      }

      this.$emit('save-place',this.form)
      this.dialogClose()
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 350px;
}
</style>

