module.exports = (configFile) => {

  const {html, html: {
    description, 
    author, 
    styles,
    SYSTEM_CONFIG_WITHOUT_THIS_REPO_PACKAGES
  }} = configFile

  let css = configFile.html.devPreloadCSS.map(item => {
    return `<link rel="stylesheet" type="text/css" href="${item}">`
  }).join('')

  let preloadJS = configFile.html.devPreloadJS.map(item => {
    return `<script src='${item}'></script>`
  }).join('')

  let preloadPackage = configFile.html.preloadPackages.map(packname => {
    const target = configFile.targets.find(item => item.name === packname)
    if (!target) return `<!-- ${item} not found -->`
    const isTargetIgnore = !!configFile.ignoreTargets.find(item => item === target.name)
    return isTargetIgnore ? 
      `<script src='https://unpkg.com/${target.name}@${target.version}/dist/${target.name}.js'></script>`:
      `<script src='http://127.0.0.1:${configFile.port}/${target.name}/dist/${target.name}.js'></script>`
  }).join('')

  let globalConstants = Object.assign({}, configFile.html.devGlobalConstants)

  let __SYSTEM_CONFIG = Object.assign({}, SYSTEM_CONFIG_WITHOUT_THIS_REPO_PACKAGES)

  configFile.targets.map(target => {
    const isTargetIgnore = !!configFile.ignoreTargets.find(item => item === target.name)
    __SYSTEM_CONFIG.map[target.name] = isTargetIgnore ? 
      `https://unpkg.com/${target.name}@${target.version}/dist/${target.name}.js`:
      `http://127.0.0.1:${configFile.port}/${target.name}/dist/${target.name}.js`
  })

  if (configFile.argv.production) {
    
    css = configFile.html.preloadCSS.map(item => {
      return `<link rel="stylesheet" type="text/css" href="${item}">`
    }).join('')

    preloadJS = configFile.html.preloadJS.map(item => {
      return `<script src='${item}'></script>`
    }).join('')

    preloadPackage = configFile.html.preloadPackages.map(packname => {
      const target = configFile.targets.find(item => item.name === packname)
      if (!target) return `<!-- ${item} not found -->`
      return `<script src='https://unpkg.com/${target.name}@${target.version}/dist/${target.name}.js'></script>`
    }).join('')

    globalConstants = Object.assign({}, configFile.html.globalConstants)
    
    configFile.targets.map(target => {
      __SYSTEM_CONFIG.map[target.name] = `https://unpkg.com/${target.name}@${target.version}/dist/${target.name}.js`
    })

  }

  globalConstants.__SYSTEM_CONFIG = __SYSTEM_CONFIG

  const globalConstantsToScript = Object.keys(globalConstants).map(item => {
    return `window.${item} = ${JSON.stringify(globalConstants[item])}`
  }).join(';')

  

  return `<!DOCTYPE html>
<html lang="zh-CN" style="${styles.html}">
<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="description" content=${description}>
  <meta name="author" content=${author}>
  <meta name="viewport" content='initial-scale=1,user-scalable=no,maximum-scale=1,width=device-width'>
  <meta name="viewport" content='initial-scale=1,user-scalable=no,maximum-scale=1' media='(device-height: 568px)'>
  <meta name=apple-mobile-web-app-title content='Material Console'>
  <meta name=apple-mobile-web-app-capable content=yes>
  <meta name=apple-mobile-web-app-status-bar-style content=black-translucent>
  <meta name=format-detection content='telephone=no'>
  <meta name="HandheldFriendly" content=True>
  <meta http-equiv="cleartype" content=on>
  <meta http-equiv="cache-control" content="no-cache, must-revalidate, post-check=0, pre-check=0" />
  <meta http-equiv="cache-control" content="max-age=0" />
  <meta http-equiv="expires" content="0" />
  <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
  <meta http-equiv="pragma" content="no-cache" />
</head>
<body style="${styles.body}">
  <div id='app'></div>
  <script>
    ${globalConstantsToScript}
  </script>

  ${css}
  ${preloadJS}
  ${preloadPackage}
  
</body>
</html>`
}
