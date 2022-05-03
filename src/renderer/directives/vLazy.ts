import type { Directive } from 'vue'
let observe: IntersectionObserver
function initObserve () {
  const root = document.querySelector('#v_lazy_root')
  if (!root) {
    throw new Error("no root element,please add id 'v_lazy_root' in your root element")
  }
  const baseOptions: IntersectionObserverInit = {
    root,
    threshold: 0.1
  }
  observe = new IntersectionObserver((enters) => {
    enters.forEach(item => {
      if (item.intersectionRatio > 0) {
        requestIdleCallback(() => {
          const target = item.target as HTMLImageElement
          if (target.getAttribute('src')) {
            return
          }
          const { origin } = target.dataset
          target.setAttribute('src', origin)
        })
      }
    })
  }, baseOptions)
}

export const vLazy: Directive<HTMLImageElement, string> = {
  mounted (el) {
    if (!el) {
      throw new Error('no root element,please check it')
    }
    if (!observe) initObserve()
    observe.observe(el)
  }
}
