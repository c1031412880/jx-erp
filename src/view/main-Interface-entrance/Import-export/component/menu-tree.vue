<template>
  <div class="o-tree">
    <el-popover
      placement="bottom"
      width="192"
      popper-class="tree-popover"
      v-model="popoverVisible"
      @after-enter="focusInput"
      trigger="click">
      <el-input ref="focusInput" placeholder="搜索功能关键字" v-model="filterText" style="margin-bottom: 20px;" size="mini">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-tree
        ref="tree"
        :data="manuTree"
        :props="defaultProps"
        node-key="code"
        :filter-node-method="filterNode"
        @node-click="checkNode"
        :expand-on-click-node="false"
        >
      </el-tree>
      <el-input slot="reference" @clear="onClear" placeholder="请选择功能名称" clearable v-model="name" style="margin-bottom: 20px;" size="mini"></el-input>
    </el-popover>
  </div>
</template>
<script>
import { getUser } from '@/utils/auth';
export default {
  data() {
    return {
      popoverVisible: false,
      filterText: "",
      manuTree: [],
      codes: [],
      name: '',
      defaultProps: {
        children: 'child',
        label: 'name'
      },
    }
  },
  mounted() {
    this.loadDataCneter()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 中台路由菜单接口
    loadDataCneter() {
      let params = {
        tenant_id: window.newHttpConfig.TenantId,
        id: JSON.parse(getUser()).user_id,
        app_key: 'erp-web'
      }
      this.$client.getMunePermission(params)
        .then(res => {
          if (res.errcode === 200) {
            this.manuTree = res.data[0].trees
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }

        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // loadData() {
    //   this.$client.getMenuRecordsSysMenu({
    //     enable: 1
    //   }).then(res => {
    //     if (res.head.result == "200") {
    //       this.manuTree = res.context
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: res.head.describle,
    //           type: "error"
    //         })
    //       }
    //   }).catch(err => {
    //   })
    // },
    checkNode(node) {
      this.popoverVisible = false
      this.name = node.name
      this.codes = this.getCode(node, [])
      this.$nextTick(() => {
        this.$emit('node-click', this.codes)
      })
    },
    getCode(node, code) {
      if (node.code) code.push(node.code)
      if (node.children && node.children.length) {
        node.children.forEach(element => {
          this.getCode(element, code)
        })
      }
      return code
    },
    onClear() {
      this.popoverVisible = false
      this.filterText = ''
      this.codes = []
      this.name = ''
      this.$emit('node-click', this.codes)
    },
    focusInput() {
      this.$refs.focusInput.focus()
    }
  },
  watch:{
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.tree-popover {
  .el-tree {
    height: 380px !important;
    overflow: auto !important;
  }
}
</style>