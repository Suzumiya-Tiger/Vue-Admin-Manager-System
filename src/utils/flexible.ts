;(function flexible(window, document) {
  const docEl = document.documentElement
  // 获取当前显示设备的物理像素分辨率与CSS像素分辨率之比;
  const dpr = window.devicePixelRatio || 1

  //根据分辨率调整全局字体大小
  function setBodyFontSize() {
    // html已完成加载，则立即调整字体大小，否则等待html加载完成再调整字体大小
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + 'px'
    } else {
      // 监听DOMContentLoaded 事件——当初始的 HTML 文档被完全加载和解析完成之后触发，无需等待样式表
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  // 根据屏幕宽度，重置1rem的长度为当前屏幕宽度的1/10
  function setRemUnit() {
    const rem = docEl.clientWidth / 10
    // 1rem的值永远为根元素的字体大小，所以此处通过调整全局字体大小来重置rem
    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // 监听resize事件——屏幕大小发生变化时触发
  window.addEventListener('resize', setRemUnit)
  // 监听pageshow事件——显示页面时触发
  window.addEventListener('pageshow', function (e) {
    // 若是浏览器中点击后退时显示页面，则重置rem
    if (e.persisted) {
      setRemUnit()
    }
  })

  // 检测是否支持0.5px
  if (dpr >= 2) {
    const fakeBody = document.createElement('body')
    const testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)
