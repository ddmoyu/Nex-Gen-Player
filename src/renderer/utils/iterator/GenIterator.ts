type StageCb<T> = (res:T, index:number)=>void
type FinishCb = ()=>void
type IteratorType<T = any> = (()=>Promise<T>)
export class GenIterator {
  gen:Generator<()=>Promise<any>>
  length:number
  genIterator (promiseArr:IteratorType[]) {
    this.length = promiseArr.length
    function * gen () {
      for (let index = 0; index < promiseArr.length; index++) {
        yield promiseArr[index]
      }
    }
    this.gen = gen()
  }

  run<T = any> (stageCb?:StageCb<T>, finishCb?:FinishCb) {
    const { gen, length } = this
    let callFinish:null|(()=>void) = null
    let len = 0
    function runGen (next:IteratorResult<IteratorType<T>>, i = 0) {
      if (next.done) {
        if (finishCb) {
          if (len === length) {
            finishCb()
          } else {
            callFinish = () => finishCb()
          }
        }
      } else {
        let jump = false
        const time = setTimeout(() => {
          jump = true
          runGen(gen.next(), i + 1)
        }, 2000)
        next.value().then((res:T) => {
          if (stageCb) {
            stageCb(res, i)
          }
          len++
          if (len === length) {
            if (callFinish) callFinish()
          }
        }).finally(() => {
          if (!jump) {
            clearTimeout(time)
            runGen(gen.next(), i + 1)
          }
        })
      }
    }
    runGen(gen.next())
  }
}
