<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="760px"
    
  >
    <div class="el-dialog-div">
      <div style="height:50px"> 当前角色：<el-button size="small" v-for="(item,i) in datalist" :key="i">{{item}}</el-button></div>
      <div style="width: 670px;height: 550px;overflow: auto">
        <role-data ref="roleData"></role-data>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import roleData from './menu-tree'
  export default {
    props: {
      dialogBool: Boolean,
      title: [String]
    },
    components: { roleData},
    data() {
      return {
        datalist:[],
        form: {
        },
        activeName: "用户信息",
        checkers: []
      };
    },
    // watch: {
    //   dialogBool(bool) {
    //     if (bool === false) {
    //       Object.assign(this.$data, this.$options.data());
    //       // this.$refs.roleData.initTreeData({});
    //     }
    //   },
    // },
    methods: {
      reqRolePriData(val) {
        let params = {
          user_id: val.i_id,
        };
        if(val.contain_role!=null&&val.contain_role!=''){
          this.datalist = val.contain_role.split(",")
        }
        this.$client.GetRolePriData1RoleManager(params)
        .then(res => {
          if(res.head.result=="205"){
            this.$refs.roleData.resetChecked()
          return
          }
          if (res.head.result == "200") {
            // this.curRolePriIds = this.bulidRolePritArr(res.context);
            this.curRolePriIds = res.context;
            let lastLevelIds = []
            this.curRolePriIds.forEach(item => {
              if(item.indexOf('.') > -1) {
                lastLevelIds.push(item)
              }
              
            })
            // console.log('*******************************',this.curRolePriIds)
            // console.log('*******************************',lastLevelIds)
            // 回显示角色权限
            this.$refs.roleData.setSelecedCheckedKeys(lastLevelIds)
            } else {
              this.$message({
                showClose: true,
                message: res.head.describle,
                type: "error",
              });
            }
        }).catch(err => {

        })
    },
      initFormData(form) {
        let roles = []
        let group = []
        if (form.orgs) {
          form.orgs.forEach(item => {
            group.push(item.i_org_id)
          })
        }

        if (form.roles){
          form.roles.forEach(item => {
            roles.push(item.i_id)
          })
        }
        // this.$refs.roleData.initTreeData({keys: roles})
      },
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
