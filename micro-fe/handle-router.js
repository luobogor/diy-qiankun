import { getApps } from './index';
import { importHTML } from './import-html';
import { getNextRoute, getPrevRoute } from './rewrite-router';

export const handleRouter = async () => {
  // 2. 匹配子应用
  // 2.1 获取到当前的路由路径
  // 2.2 去 apps 里面查找对应的 app
  const apps = getApps()

  const prevApp = apps.find(item => {
    return getPrevRoute().startsWith(item.activeRule)
  })

  const app = apps.find(item => {
    return getNextRoute().startsWith(item.activeRule)
  })

  if (prevApp) {
    await unmount(prevApp)
  }

  if (!app) {
    return;
  }

  // 3. 加载子应用
  const {
    template,
    getExternalScripts,
    execScripts
  } = await importHTML(app.entry)

  const container = document.querySelector(app.container)
  container.appendChild(template)
  window.__POWERED_BY_QIANKUN__ = true

  // 浏览器出于安全考虑，插入 HTML 的 script 标签是不会执行的，所以要手动执行
  const appExports = await execScripts()
  app.boostrap = appExports.boostrap
  app.mount = appExports.mount
  app.unmount = appExports.unmount

  await boostrap(app)
  await mount(app)

  // 4. 渲染子应用
}

async function boostrap(app) {
  if (app.boostrap) {
    await app.boostrap()
  }
}

async function mount(app) {
  if (app.mount) {
    await app.mount({
      container: document.querySelector(app.container)
    })
  }
}

async function unmount(app) {
  if (app.unmount) {
    await app.unmount({
      container: document.querySelector(app.container)
    })
  }
}
