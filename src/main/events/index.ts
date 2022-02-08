
export function registerIpcEvent () {
  const requireAll = (requireContext: __WebpackModuleApi.RequireContext) => {
    requireContext.keys().forEach(item => {
      if (item.includes('index')) return
      requireContext(item)
    })
  }
  const modules = require.context('.', false, /\.ts$/)
  requireAll(modules)
}
