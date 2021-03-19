const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token // !这里给外面的想要访问token的地方一个快捷访问的方式
}
export default getters
