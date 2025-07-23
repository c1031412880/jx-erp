export function getApprovalStateColor(state) {
  const colorMap = {
    0: { color: '#E6A23C', name: '未发起' },
    1: { color: '#E6A23C', name: '审批中' },
    2: { color: '#67C23A', name: '审批完成' },
    3: { color: '#d9001b', name: '审批拒绝' },
    4: { color: '#909399', name: '审批撤回' }
  };
  return colorMap[state] || { color: '', name: '' };
}