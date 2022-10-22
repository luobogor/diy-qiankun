import { rewriteRouter } from './rewrite-router';
import { handleRouter } from './handle-router';

let _apps

export const getApps = () => {
  return _apps
}

export const registerMicroApps = (apps) => {
  _apps = apps
}

export const start = () => {
  rewriteRouter()
  handleRouter()
}
