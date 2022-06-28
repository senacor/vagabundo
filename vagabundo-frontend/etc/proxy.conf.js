// https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md

const PROXY_CONFIG = [{
  context: [
    "/trips",
    "/stats"
  ],
  target: "http://localhost:10010",
  secure: false,
  logLevel: "debug"
}];

module.exports = PROXY_CONFIG;
