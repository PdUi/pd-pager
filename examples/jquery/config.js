System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "jquery": "npm:jquery@3.1.1",
    "pdui/pd-pager": "github:pdui/pd-pager@master"
  }
});
