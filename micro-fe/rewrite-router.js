import { handleRouter } from './handle-router';

let prevRoute = ''
let nextRoute = window.location.pathname

export const getPrevRoute = () => prevRoute
export const getNextRoute = () => nextRoute

// hash 路由：onhashchange
// history 路由：
//   - history.go、history.back、history.forward 使用 popstate
//   - pushState、replaceState 需要通过重写进行劫持
export const rewriteRouter = () => {
  window.addEventListener('popstate', () => {
    prevRoute = nextRoute
    nextRoute = window.location.pathname
    handleRouter()
  })

  const rawPushState = window.history.pushState
  window.history.pushState = (...args) => {
    prevRoute = window.location.pathname
    rawPushState.apply(window.history, args)
    nextRoute = window.location.pathname
    handleRouter()
  }


  const rawReplaceState = window.history.replaceState
  window.history.replaceState = (...args) => {
    prevRoute = window.location.pathname
    rawReplaceState.apply(window.history, args)
    nextRoute = window.location.pathname
    handleRouter()
  }
}
