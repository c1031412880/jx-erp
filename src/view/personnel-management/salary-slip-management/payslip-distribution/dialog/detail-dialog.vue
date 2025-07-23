<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    :close-on-click-modal="false"
    append-to-body
    width="820px"
    @change-full="changeFull"
  >
    <div class="base-info">
      <el-form :inline="true" size="mini" :model="form" ref="form">
        <el-form-item label="姓名:">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="onExport()">导出</el-button>
        </el-form-item> -->
      </el-form>
    </div>
    <div>
      <tr-table
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :frontFixedNum="1"
      >
        <template slot-scope="scope" slot="is_read">
          <p :style="{'color': scope.data.is_read ? '#0CB780' : '#F2260E'}">{{ scope.data.is_read ? '已读' : '未读' }}</p>
        </template>
      </tr-table>
    </div>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import { deepCopy } from '@/utils/index'
export default {
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        name: ''
      },
      TableHeight: 300,
      data: [],
      oldData: [],
      title: '',
      canRendererTableHeader: []
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
      }
    },
  },
  mounted() {
  },
  methods: {
    getData(row) {
      this.title = row.slip_name
      this.reqOrgProjectList(row.template_id)
      this.GetByPaySlipId(row.id)
    },
    // 获取表头 
    reqOrgProjectList(id) {
      this.canRendererTableHeader = []
      this.$client.GetItemByTemplateId({id})
      .then(res => {
        if (res.head.result == "200") {
          let list = res.context
          list.forEach((item,index) => {
            let obj = {
              id: index + 1,
              label: item.item_name,
              prop: item.item_name,
              width: "120",
              align: "center",
              signIndex: index,
            }
            this.canRendererTableHeader.push(obj)
          })
          let end_list = [
            {
              id: list.length,
              label: '已读状态',
              prop: 'is_read',
              width: "120",
              align: "center",
              signIndex: list.length + 1,
            },
            {
              id: list.length + 1,
              label: '阅读时间',
              prop: 'read_time',
              width: "150",
              align: "center",
              signIndex: list.length + 2,
            },
          ]
          this.canRendererTableHeader = [...this.canRendererTableHeader,...end_list]
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      })
    },
    // 根据id下发工资 
    GetByPaySlipId(id) {
      this.$client.GetByPaySlipId({id})
        .then(res => {
          if (res.head.result == "200") {
            let list = res.context
            this.oldData = []
            list.forEach(item => {
              let obj = {}
              item.pay_slip_details.forEach(child => {
                obj[child.item_name] = child.value
              })
              obj['is_read'] = item.is_read
              obj['read_time'] = item.read_time
              this.oldData.push(obj)
            })

            this.data = deepCopy(this.oldData)
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    onSubmit() {
      if (this.form.name) {
        this.data = this.oldData.filter(item => {
          return item['姓名'].includes(this.form.name)
        })
      } else {
        this.data = deepCopy(this.oldData)
      }
    },
    resetForm() {
      this.form.name = ''
      this.onSubmit()
    },
    onExport() {},
    changeFull(bool) {
      if (bool) {
        let h = this.$el.offsetHeight
        this.TableHeight = h - 150
      } else {
        this.TableHeight = 300
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


