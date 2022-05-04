import type { Directive } from 'vue'
const observeMap: Map<string, IntersectionObserver> = new Map()
export function initImgObserve (root: Element, id: string) {
  if (!root) {
    throw new Error('no root element,please pass rootId  in your root element')
  }
  const baseOptions: IntersectionObserverInit = {
    root,
    threshold: 0.1
  }
  const observe = new IntersectionObserver((enters) => {
    enters.forEach(item => {
      if (item.intersectionRatio > 0) {
        requestIdleCallback(() => {
          const target = item.target as HTMLImageElement
          if (target.getAttribute('src')) {
            observe.unobserve(target)
            return
          }
          const { origin } = target.dataset
          target.setAttribute('src', origin)
        })
      }
    })
  }, baseOptions)
  observeMap.set(id, observe)
}

export const vLazy: Directive<HTMLImageElement, string> = {
  mounted (el, binding) {
    const { value } = binding
    if (!el) {
      throw new Error('no root element,please check it')
    }
    const observe = observeMap.get(value)
    if (observe) {
      observe.observe(el)
    } else {
      throw new Error('no root observe can use')
    }
  },
  unmounted (el, binding) {
    const { value } = binding
    const observe = observeMap.get(value)
    if (observe) {
      observe.unobserve(el)
    }
  }
}
