<template>
  <div class="my-filled">
    <sub-req
      ref="head"
      @on-btn="onBtn"
      @on-ok="onSubmit"
    ></sub-req>
    <div :style="{height:TableHeight + 'px',overflow: 'auto'}">
      <table-box
        :tableBoxType='tableBoxType'
        ref="tableBox"
        :loadin="loading"
      ></table-box>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import tableBox from '../component/table-box';
import subReq from './sub-req';
import {deepCopy} from '@/utils/index'
export default {
  name: "my-filled",
  components: {
    subReq,
    tableBox
  },
  data() {
    return {
      form: {},
      TableHeight: 500,
      tableBoxType: 'detail',
      loading: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    onSubmit(params) {
      this.form = params
      this.loadData()
    },
    loadData() {
      let params = Object.assign({}, this.form);
      this.loading = true
      this.$client.GetByUserIdBicycleManage({context:params})
        .then(res => {
          if (res.head.result == "200") {
            if (!res.context) {
              this.$message({
                showClose: true,
                message: "暂无数据",
                type: "warning",
              });
              this.loading = false
              return
            }
            this.tableBoxType = 'detail'
            this.$refs.tableBox.setData([res.context])
            this.loading = false
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
            this.loading = false
          }
        }).catch(err => {
          this.loading = false
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    save() {
      let form = deepCopy(this.$refs.tableBox.tableList[0])
      for (const key in form) {
        if (key != 'remark' && key != 'title') {
          form[key] = Number(form[key])
        }
      }
      let params = Object.assign({},form)
      params.date = this.form.date
      params.user_id = this.form.user_id
      delete params.updated_id
      delete params.updated_date
      delete params.created_date
      delete params.created_name
      delete params.created_id
      delete params.title
      this.$client.AddOrUpdateBicycleManage({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: "success",
            });
            this.loadData()
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th
      }, 60);
    },
    onBtn(type) {
      this.tableBoxType = 'edit'
      if (type == 'save') {
        this.save()
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.my-filled {
  width: 100%;
  height: 100%;
}
</style>
