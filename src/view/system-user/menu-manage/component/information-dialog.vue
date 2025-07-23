<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="菜单类别:" prop="type">
          <el-radio-group  v-model="form.type" :disabled="curSelecedType == 'edit'">
            <el-radio :label="0"><span style="color:#606266">目录菜单</span></el-radio>
            <el-radio :label="1"><span style="color:#606266">跳转菜单</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单编号:" prop="code">
          <el-input v-model="form.code" placeholder="请输入菜单编号"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单:" prop="parent_id">
          <menu-calssify-select-tree
            ref="menuCalssifySelectTree"
            :width="360"
            :isExportMultiple="false"
            :placeholder="'请选择上级菜单(不选择默认建第一级菜单)'"
            v-model="form.parent_id"
          >
          </menu-calssify-select-tree>
        </el-form-item>
        <div>
          <el-form-item label="跳转方式:" prop="mode" v-if="!!form.type">
            <el-radio-group  v-model="form.mode">
              <el-radio :label="1"><span style="color:#606266">站内跳转</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">站外跳转</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="!form.type?'路径':'跳转路径'" prop="link_url">
            <el-input v-model="form.link_url" placeholder="站内跳转写相对路径， 站外跳转写绝对路径"></el-input>
          </el-form-item>
          <el-form-item label="新页面:" prop="is_new" v-if="!!form.type">
            <el-radio-group  v-model="form.is_new">
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="0"><span style="color:#606266">否</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        
        <el-form-item label="菜单图标:" prop="icon_path">
          <div class="show-flex-box-r" style="align-items: center;">
          <el-button size="small" type="primary" @click="uploadFile">{{!!form.icon_path?'更换图标':'上传图标'}}</el-button>
          <el-image
            v-if="!!form.icon_path"
            style="width: 60px; margin-left: 10px;"
            :src="form.icon_path"
            fit="contain"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="菜单状态（启用）:" prop="enable">
          <el-radio-group  v-model="form.enable">
            <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
            <el-radio :label="0"><span style="color:#606266">否</span></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单描述:" prop="describe">
          <el-input
            v-model="form.describe" 
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入菜单描述"></el-input>
        </el-form-item>
        <el-form-item label="菜单功能:" prop="type" v-if="!!form.type">
          <div>
            <el-table
              :data="form.funcs"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              border
              :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
              :cell-style="{fontSize: '13px', padding: '4px 0px'}">
              <el-table-column
                prop="name"
                label="操作名称"
                min-width="150">
                <template slot-scope="scope">
                  <el-input style="width: 130px" v-model="scope.row.name" placeholder="请输入菜单名称"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="key"
                label="标识码"
                min-width="150">
                <template slot-scope="scope">
                  <el-input style="width:120px" v-model="scope.row.key" placeholder="请输入标识码"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="address"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
            size="mini"
            type="danger"
            @click="addMenuFunction()">添加菜单功能</el-button>
          </div>
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
import menuCalssifySelectTree from './menu-calssify-select-tree'
export default {
  components: {
    menuCalssifySelectTree
  },
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
      form: {
        id: '',
        type: 0,
        name: '',
        code: '',
        parent_id: '',
        mode: 1,
        link_url:'',
        is_new: 0,
        icon_path: '',
        enable: 1,
        describe: '',
        funcs:[
          {
            name: '查看',
            key: 'search'
          }
        ],
      },
      basicRules: {
        type:  [
          { required: true, message: "请选择菜单类别", trigger: "change" },
        ],
        name: [
          { required: true, message: "请输入菜单名称", trigger: "change" },
        ],
        code: [
          { required: true, message: "请输入菜单编号", trigger: "change" },
        ],
        // parent_id: [
        //   { required: true, message: "请输入菜单名称", trigger: "change" },
        // ]
      },
      tableData:[{
          name: '',
          key: ''
        }]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.resetInfo()
        Object.assign(this.$data, this.$options.data());
      }else{
        setTimeout(() => {
          this.$refs.menuCalssifySelectTree.$refs.tree.loadData();
        }, 300);
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    resetInfo() {
      this.$refs.menuCalssifySelectTree.onClear()
    },
    // 自定义上传文件方法
    // :http-request="uploadFile"
    uploadFile() {
      let input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        console.log(input.files);
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        let file = input.files[0];
        if(!this.beforeUpload(file)) {
          return
        }
        reader.onload = (ev) => {
          input = undefined;
        };
        let formData = new FormData();
        formData.append("file", file);
        let params = {
          file: formData,
        };
        this.$client.AddCarInfoImageUpload(params)
        .then(res => {
          if(res.head.result == '200') {
            this.form.icon_path = res.context;
            console.log(this.form.icon_path)
            this.$message({
              showClose: true,
              message: "上传成功",
              type: "success"
            });
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
       
      };
      input.click();
    },
    // 判断文件大小
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 4
      if (isLt1M) {
        return true
      }
      this.$message({type: 'error', message: '请不要上传大小超过4M的文件', showClose: true})
      return false
    },
    handleDelete(index, row) {
      this.form.funcs.splice(index,1)
    },
    // 添加菜单功能 
    addMenuFunction() {
      let obj = {
        name: '',
        key: ''
      }
      this.form.funcs.push(obj)
    },
    // 设置 编辑回显
    setData(val) {
      console.log(val)
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
            this.form[key] = val[key] 
        }
      }
    },
    // 设置添加子菜单父级
    setSubmenuData(val) {
      this.form.parent_id = val.id;
      setTimeout(() => {
        this.$refs.menuCalssifySelectTree.id = val.id
      }, 60);
    },
   
    updatePlaybill(formName) {
      if(!this.form.type) {
        delete this.form.funcs
        delete this.form.is_new
        // delete this.form.mode
      }
       this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.$emit("save-add-edit-job", this.form);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 500px;
  overflow-y: scroll;
}
.el-dialog-div /deep/ .el-input {
  width: 400px;
}
.el-dialog-div /deep/ .el-upload-list {
  display: none;
}
</style>

