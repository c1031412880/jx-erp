// 打印模板
export function PrintTemplate(object_id,flow_id) {
  let params = {
    context: {
      object_id: object_id,
      enable: 1
    }
  }
  this.$client.GetByPage(params).then((req) => {
    if (req.head.result === "200") {
      console.log(req);
      let data = req.context.list
      if(!data.length) {
        this.$message({
          showClose: true,
          message: '暂无该表单打印模板,请到打印模板管理确认.',
          type: "error",
        });
      }
      if(data.length > 1) {
        const h = this.$createElement;
        this.$msgbox({
          title: '请选择打印模板',
          message: h('el-select',
            {
              ref: 'sendMsg',
              // attrs: {
                // value: '',
                // placeholder: '请选择打印模板'
              // },
              props: {
                value: '',
                placeholder: '请选择打印模板'
              },
              on: {
                change: event => {
                  this.$refs['sendMsg'].value = event;
                }
              }
            },
            data.map(item => {
              return h('el-option', {
                      attrs: {
                        value: (item.file_name).toString(), 
                        label: item.temp_name
                      }
                    })
            })
          ),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          console.log(this.$refs['sendMsg'].value);
          let str = this.$refs['sendMsg'].value
          let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + str + '&flow_id=' + flow_id
          window.open(url, '_blank')

        }).catch(() => {
          this.$message({ type: 'info', message: '已取消'});
        })
      }else {
        let url = window.newHttpConfig.printUrl + '/html/preview?appid=' + window.newHttpConfig.printUrl_appid +'&_u=' + data[0].file_name + '&flow_id=' + flow_id
        window.open(url, '_blank')
      }
    } else {
      this.$message.error(req.head.describle);
    }
  });
}