import { fetchResource } from './fetch-resource';

export const importHTML = async (url) => {
  const template = document.createElement('div')
  template.innerHTML = await fetchResource(url)
  const scripts = template.querySelectorAll('script')

  // 获取所有 script 标签代码
  function getExternalScripts() {
    return Promise.all(Array.from(scripts).map(script => {
      const src = script.getAttribute('src')
      if (!src) {
        return Promise.resolve(script.innerHTML)
      }

      // 第三方资源直接加载，本站资源补全本站前缀
      return fetchResource(src.startsWith('http') ? src : `${url}${src}`)
    }))
  }

  // 获取并执行所有的 script 脚本代码
  async function execScripts() {
    const scripts = await getExternalScripts()

    const module = { exports: {} }
    const exports = module.exports

    scripts.forEach(code => {
      // eval 可以访问全局属性，上级作用域有 module 属性，也可以访问到，所以可以得到子应用 export 的变量
      eval(code)
    })

    return module.exports
  }

  return {
    template,
    getExternalScripts,
    execScripts
  }
}
