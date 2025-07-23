import { getUser } from '@/utils/auth'

export default {
  data() {
    const userjson = getUser()
    let user_id = ''
    if (userjson) {
      user_id = JSON.parse(userjson).user_id
    }
    return {
      localCommonUseKey: user_id
        ? `erp_local_common_use_key_${user_id}`
        : 'erp_local_common_use_key',
      commonUseData: []
    }
  },
  methods: {
    getCommonUseData() {
      const { localCommonUseKey } = this
      try {
        this.commonUseData = JSON.parse(localStorage.getItem(localCommonUseKey)) || []
      } catch (error) {
        this.commonUseData = []
      }
    },
    setCommonUseData(item) {
      const { localCommonUseKey } = this
      let data
      try {
        data = JSON.parse(localStorage.getItem(localCommonUseKey)) || []
      } catch (error) {
        data = []
      }
      let index = data.findIndex(x => x.name === item.name)
      if (index > -1) {
        data.splice(index, 1)
      }
      data.unshift(item)
      data = data.slice(0, 8)
      localStorage.setItem(localCommonUseKey, JSON.stringify(data))
    }
  }
}
