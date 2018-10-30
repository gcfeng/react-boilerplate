
/**
 * 删除 URL 参数
 *
 * case:
 *  http://localhost:8080/index.html?bar=one
 *  index.html?bar=one
 *  bar=one&foo=two
 *  ?bar=one&foo=two
 */
export function removeUrlParam (url, param) {
  let hasPrefix;
  // 添加前缀统一后面的操作步骤
  if (url.indexOf('?') >= 0) {
    hasPrefix = true;
  } else {
    hasPrefix = false;
    url = '?' + url;
  }
  url = url.split('?');
  let base = url[0];
  let params = url[1].split('&');

  /* eslint-disable no-unmodified-loop-condition */
  let i = 0;
  while (param && i < params.length) {
    if (params[i].indexOf(param) === 0) {
      params.splice(i, 1);
    } else {
      i++;
    }
  }

  params = params.join('&');

  return base ? (params ? base + '?' + params : base) : (hasPrefix ? '?' + params : params);
}

/**
 * 更新 URL 参数值
 */
export function updateUrlParam (url, param, value) {
  let i;

  url = removeUrlParam(url, param);
  i = url.indexOf('?');

  return i >= 0 ? (i === url.length - 1 ? url + param + '=' + value : url + '&' + param + '=' + value)
    : (url + '?' + param + '=' + value);
}

/**
 * 添加URL参数，如果参数值存在，会更新
 */
export function addUrlParams (url, params, encoded = true) {
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      if (encoded) {
        url = updateUrlParam(url, encodeURIComponent(key), encodeURIComponent(params[key]));
      } else {
        url = updateUrlParam(url, key, params[key]);
      }
    }
  }

  return url;
}
