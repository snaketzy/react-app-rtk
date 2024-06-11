
export const  CID = "288572";
export const TOKEN = "209157.eyJhbGciOiJIUzI1NiJ9.eyJhcHBpZCI6IjEzMDAxIiwiZXhwIjoxNzE4MTEwMTE2LCJ1c2VyaWQiOiIyMDkxNTcifQ.bX6R6qBkZDJw8KVNBNDZ0h3ehLvImMl6DU3IfwLRl7Y";

const getRootDomain = () => {
  const url = window.location.hostname;
  const rootDomain: RegExpMatchArray | null = url.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g) || url.match(/([a-z0-9][a-z0-9]*?\.(?:com|cn|net|org|gov|info|la|cc|co|jp)(?:\.(?:cn|jp))?)$/);
  if (!rootDomain) {
    return;
  }
  return rootDomain[0];
}

/**
 * 工具类
 *
 * @export
 * @class Tools
 */
const Tools = {

  /**
   * 是否支持HTML5 history API
   *
   * @returns
   */
  supportsHistory() {
    const ua = window.navigator.userAgent;
    if ((ua.indexOf("Android 2.") > -1 || ua.indexOf("Android 4.0") > -1) && ua.indexOf("Mobile Safari") > -1 && ua.indexOf("Chrome") < 0 && ua.indexOf("Windows Phone") < 0) {
      return false
    }
    return window.history && "pushState" in window.history;
  },

  /**
   * 对象深拷贝
   *
   * @param {*} obj
   * @returns objCopy
   */
  deepCopy: (obj: any) => {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 清除obj中的undefined，null，"", NAN
   *
   * @param {*} obj
   * @returns 清除空值后的对象
   */
  clearObj: (obj: any) => {
    const o = { ...obj };
    for (const key in o) {
      if (!o[key] && o[key] !== 0) {
        delete o[key];
      }
    }
    return o;
  },

  /**
   * 在数组指定位置插入元素
   *
   * @param {*} obj
   * @returns 清除空值后的对象
   */
  insertArray: (array: any[], index: number, item: any) => {
    array.splice(index, 0, item);
  },

  /**
   * 将json拼接为请求参数字符串
   * 非生产环境打印内容供测试查看
   * @param {*} params 参数对象
   * @returns 参数字符串
   */
  appendParams: (url: string, params: any, convertCode = false) => {
    if (!url) {
      return "";
    }
    let str = "";
    for (const key in params) {
      if ([undefined, null].indexOf(params[key]) < 0) {
        str += (key + "=" + params[key] + "&");
      }
    }
    str = str
      ? `${url}?${convertCode ? encodeURIComponent(str.substr(0, str.length - 1)) : str.substr(0, str.length - 1)}`
      : url;
    return str;
  },

  /**
   * 根据名称过滤下拉列表
   *
   * @param {string} name
   * @returns
   */
  filterOption: (input: string, option: any) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) > -1;
  },

  /**
   * 根据名称获取cookie
   *
   * @param {string} name
   * @returns
   */
  getCookie: (name: string) => {
    const reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    const arr = document.cookie.match(reg);
    if (arr) {
      return unescape(arr[2]);
    }
    else {
      return null;
    }
  },

  /**
   * 设置cookie
   *
   * @param {string} name cookie名称
   * @param {string} value cookie值
   * @param {date} 过期时间
   * @returns
   */
  setCookie: (name: string, value: string, date: Date) => {
    if (Tools.getCookie(name)) {
      Tools.delCookie(name);
    }
    const domain = getRootDomain();
    if (domain) {
      document.cookie = `${name}=${escape(value)};expires=${date.toUTCString()};path=/;domain=${domain}`;
    }
  },

  /**
   * 删除cookie
   *
   * @param {string} name cookie名称
   * @returns
   */
  delCookie: (name: string) => {
    const date = new Date();
    const value = Tools.getCookie(name);
    date.setTime(date.getTime() - 1);
    if (value != null) {
      const domain = getRootDomain();
      if (domain) {
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;domain=${domain}`;
      }
    }
  },

  /**
   * 根据键值获取名称
   *
   * @param {any[]} list 列表
   * @param {string} keyValue 键值
   * @param {string | undefined} keyName 键名
   * @param {string | undefined} valueName 值名
   * @returns
   */
  mappingFilter: (list: any[], keyValue: string | number | boolean, keyName?: string, valueName?: string) => {
    if (!list || !list.length) {
      return "";
    }
    const obj = list.find((item: any) => item[(keyName ? keyName : "dataKey")] === keyValue);
    return obj
      ? obj[(valueName ? valueName : "dataValue")]
      : "";
  },

  /**
   * 事件防抖动事件
   *
   * @param {F} fn type is Arrow Function
   * @param {number} delay
   * @returns
   */
  debounce: <F extends (...params: any[]) => void>(fn: F, delay: number): F => {
    let timeoutId: number;
    return function (this: any, ...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
    } as F;
  },

  /**
   * 获取对象数组的每个元素的指定属性值，组成数组返回
   * @param {array} array
   * @param {string} key
   * @returns {Array}
   */
  arrayPluck: (array: any[], key: string, value: string | number) => {
    const rs: any[] = [];
    array.forEach(obj => obj[key] === `${value}` && rs.push(obj[key]));
    return rs;
  },

  /**
   * 格式化时间
   * @param   time   时间
   * @param   bool   是否需要时分秒
   */
  formatTime: (time: number | string, bool = false) => {
    const dd = new Date(time);
    const y = dd.getFullYear();
    const m = dd.getMonth() + 1;
    const d = dd.getDate();
    const h = dd.getHours();
    const mm = dd.getMinutes();
    const s = dd.getSeconds();
    return `${y}-${m < 10 ? `0${m}` : m}-${d < 10 ? `0${d}` : d}${!bool ? "" : ` ${h < 10 ? `0${h}` : h}:${mm < 10 ? `0${mm}` : mm}:${s < 10 ? `0${s}` : s}`}`;
  },

  /**
   * 返回字符长度（中文2个字符）
   */
  getStrLength: (value: string) => value.replace(/[^ -~]/g, "AA").length,

  /**
   * 字符串超过指定长度即返回指定长度的字符串
   */
  getLimitLengthStr: (value: string, maxLength: number) => {
    const getStr = () => {
      const result: string[] = [];
      for (let i = 0; i < maxLength; i++) {
        const char = value[i]
        if (/[^ -~]/.test(char)) {
          maxLength--;
        }
        result.push(char);
      }
      return result.join("");
    };
    if (Tools.getStrLength(value) > maxLength) {
      value = getStr();
    }
    return value;
  },

  /**
   * 获取地址中指定的参数
   * @param   name   参数名称
   */
  getUrlParam: (name: string) => {
    let value = "";
    const url = decodeURIComponent(window.location.href);
    const list = url.split("?");
    if (list[1]) {
      const arr = list[1].split("&");
      for (const ele of arr) {
        const arrs = ele.split("=");
        if (arrs[0] === name) {
          value = arrs[1];
          break;
        }
      }
    }
    return value;
  },

  /**
   * 号码脱敏（前3后4）
   * @param   type    类型   mobile:手机  idCard:身份证号
   * @param   number  要脱敏的号码
   */
  sensitiveNumber: (type: string, number: string | number) => {
    const reg = /(\d{3})\d*(\d{4})/;
    return `${number}`.replace(reg, `$1${"*".repeat(type === "mobile" ? 4 : 11)}$2`);
  },

  /**
   * 姓名脱敏（只显示最后一个字）
   */
  sensitiveName: (name: string) => {
    if (name && name.length > 1) {
      const len = name.length;
      name = `${"*".repeat(len - 1)}${name.substr(len - 1)}`;
    }
    return name || "";
  },

  /**
   * 下载文件
   *
   * @param {*} url 文件地址
   */
  downloadFile: (url: string, fileName: string) => {
    const elemA = document.createElement("a");
    elemA.href = url;
    elemA.download = fileName || "文件下载";
    document.body.appendChild(elemA);
    elemA.click();
    elemA.onload = () => {
      document.body.removeChild(elemA);
    };
  },
  /**
   * 通过原生ajax下载文件
   * @param    url        地址
   * @param    fileName   文件名
   */
  downloadFileWithXHR: (url: string, fileName?: string) => {
    try {
      if (window.navigator.userAgent.indexOf("MSIE 9.0") > -1) {
        const elemA = document.createElement("a");
        elemA.href = url;
        elemA.download = fileName || "文件下载";
        document.body.appendChild(elemA);
        elemA.click();
        elemA.onload = () => {
          document.body.removeChild(elemA);
        };
      } else {
        const xhr = new XMLHttpRequest();
        const html5Saver = (blob: any, name: string) => {
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          const path = window.URL.createObjectURL(blob);
          a.href = path;
          a.download = name;
          a.click();
          document.body.removeChild(a);
        }
        const saveBlob = (response: any, name: string) => {
          (navigator as any).msSaveBlob
            ? (navigator as any).msSaveBlob(response, name)
            : html5Saver(response, name);
        }
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = (event: any) => {
          const e = event.target || event.srcElement;
          if (e.status === 200) {
            saveBlob(e.response, fileName || "");
          }
        };
        xhr.onerror = (e: any) => {
          console.log(e);
        };
        xhr.send();
      }
    } catch (err) {
      console.log(err);
    }
  },

  /**
   * 获取浏览器信息
   */
  getBrowser: () => {
    const Sys = {
      browser: "未知",
      verson: ""
    };
    const ua = window.navigator.userAgent.toLowerCase();

    // 首先判断edge
    let re = /(edge).*?([\d.]+)/;
    let m = ua.match(re);

    // 非edge的场合,ie，firefox，chrome，opera，safari判断
    if (!m) {
      re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
      m = ua.match(re);
    }

    // ie11判断
    if (ua.indexOf("trident") > -1 && ua.indexOf("rv") > -1) {
      Sys.browser = "ie";
      Sys.verson = "11";
    }

    // 常用浏览器的场合
    if (m) {
      Sys.browser = m[1].replace(/version/, "safari");
      Sys.verson = m[2];

      // chrome内核
      if (Sys.browser === "chrome") {
        const external = window.external;
        const appVersion = window.navigator.appVersion;
        const _mime = (option: any, value: any) => {
          const mimeTypes: any = navigator.mimeTypes;
          for (const mt in mimeTypes) {
            if (mimeTypes[mt][option] === value) {
              return true;
            }
          }
          return false;
        }

        // 搜狗
        if (external && "SEVersion" in external) {
          Sys.browser = "搜狗";
        } else if (external && "LiebaoGetVersion" in external) {
          Sys.browser = "猎豹";
        } else if (/QQBrowser/.test(appVersion)) {
          Sys.browser = "qq";
        } else if (/Maxthon/.test(appVersion)) {
          Sys.browser = "遨游";
        } else if (/TaoBrowser/.test(appVersion)) {
          Sys.browser = "淘宝";
        } else if (/BIDUBrowser/.test(appVersion)) {
          Sys.browser = "百度";
        } else if (/UBrowser/.test(appVersion)) {
          Sys.browser = "uc";
        } else if (_mime("type", "application/vnd.chromium.remoting-viewer")) {
          Sys.browser = "360极速版";
        }
      }
    }
    return Sys;
  },

  /**
   * 获取初始化分页对象
   *
   * @returns 初始化分页对象
   */
  getInitPagination: () => {
    return {
      pageSize: 25,
      current: 1,
      total: 0,
      totalPages: 0,
      pageIndex:1,
    };
  },

  /**
   * 获取本地存储的内容
   * @param   name   名称
   */
  getStorageItem: (name: string) => {
    const obj = localStorage.getItem(name);
    return obj ? JSON.parse(obj) : null;
  },

  /**
   * 本地存储的内容
   * @param   obj   存储的对象
   */
  setStorage: (name: string, obj: { [key: string]: any }) => {
    const str = JSON.stringify(obj);
    localStorage.setItem(name, str);
  },

  /**
   * 金额转千分位格式，带两位小数
   * @param  num      金额
   * @param  noFloat  是否要带小数
   * 注：
   * 后端可能会传入已经是千分位的数字，先去掉千分位
   */
  thousandSeparator: (num: string | number, noFloat?: boolean) => {
    const newNum = `${num}`.replace(/,/g, "");
    if (isNaN(+newNum)) {
      return "";
    }
    const str: any = (+newNum).toFixed(2);
    const arr = str.split(".");
    return `${arr[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")}${noFloat ? "" : `.${arr[1]}`}`;
  },

  /**
   * 金额转中文（例如：12300000890）
   * @param   num    金额
   *
   * 1-  金额的长度取余数，比如，长度11除以4余3
   * 2-  先截取余数，把123存入数组
   * 3-  截取余数后，再每4位截取，最终的数组为["123", "0000", "0890"]
   * 4-  0000不处理
   * 5-  最后一位是0（比如 0340），要在最后加”零“
   * 6-  当前数字和下一个数字都为0，不匹配中文和单位，否则当前为0的只匹配中文
   * 7-  由于bool，最终会出现”零零“的情况，比如 ["130", "0022"]这种情况
   * 8-  去掉最后一个零
   * 9-  finalStr如果为空（金额只有角、分的情况），直接赋值”零”
   * 10- 没有角分，加上”整“
   * 11- 00不处理
   * 12- 角分只取前两位
   * 13- 处理只有角、分的情况（比如0.45、0.7）
   */
  transNumberToCH: (num: string | number) => {
    const numberCH = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    const unitSmall = ["", "拾", "佰", "仟"];
    const unitLarge = ["", "万", "亿"];
    const unitTiny = ["角", "分"];
    const unitBasic = "圆";
    const unitFinal = "整";
    const str = `${num}`;
    if (!str.trim() || str.substr(str.length - 1) === "." || isNaN(+str) || (+str) < 0 || (+str) > 999999999999.99) {
      return "";
    }
    const arr = str.replace(/,/g, "").split(".");
    let leftNum = arr[0];
    let finalStr = "";
    let len = leftNum.length;
    const first = len % 4;  // 1
    const leftArr: string[] = [];
    if (first) { // 2
      leftArr.push(leftNum.substring(0, first));
      leftNum = leftNum.substring(first);
      len = leftNum.length;
    }
    for (let i = 0; i < len; i = i + 4) { // 3
      leftArr.push(leftNum.substring(i, i + 4));
    }
    const mLen = leftArr.length;
    leftArr.forEach((ele: any, i: number) => {
      if (+ele) { // 4
        const eleLen = ele.length;
        const bool = ele.substring(ele.length - 1) === "0"; // 5
        for (let j = 0; j < eleLen; j++) { // 6
          finalStr += !+ele[j] && !+ele[j + 1] ? "" : `${numberCH[ele[j]]}${!+ele[j] ? "" : unitSmall[(eleLen - (j + 1))]}`;
        }
        finalStr += unitLarge[mLen - (i + 1)];
        finalStr += (bool ? "零" : "");
      }
    });
    finalStr = finalStr.replace(/零零/g, "零"); // 7
    if (finalStr.substring(finalStr.length - 1) === "零") { // 8
      finalStr = finalStr.substring(0, finalStr.length - 1);
    }
    finalStr = (finalStr || "零") + unitBasic; // 9
    if (!arr[1]) { // 10
      return finalStr += unitFinal;
    }
    const rightNum: any = arr[1];
    const rightLen = rightNum.length;
    let rightStr = "";
    if (+rightNum) { // 11
      for (let i = 0; i < rightLen; i++) {
        rightStr += `${numberCH[rightNum[i]]}${!+rightNum[i] ? "" : unitTiny[i]}`;
        if (i === 1) { // 12
          break;
        }
      }
    }
    finalStr += rightStr.replace(/角零/g, "角");
    if (finalStr.length > 2 && finalStr !== "零圆整" && finalStr.substr(0, 2) === "零圆") { // 13
      finalStr = finalStr.substr(2);
    }
    return finalStr;
  },

  formatStringValue: (value: any) => {
    if (typeof value === "string" || typeof value === "number") {
      if (value === undefined || value === "") {
        return "--";
      }
      else {
        return value;
      }
    } else {
      return "--";
    }

  },
  formatStringWithMapValue: (list: any, mathvalue: any) => {
    if (mathvalue === null || mathvalue === undefined || mathvalue === "") {
      return "--";
    } else {
      const name = Tools.mappingFilter(list, mathvalue.toString());
      return Tools.formatStringValue(name);
    }

  },

  /**
   * 地址加上时间戳
   */
  addT: (url: string) => `${url}${url.indexOf("?") < 0 ? "?" : "&"}t=${new Date().getTime()}`,

  /**
   * 判断字符串是否能转换
   * @param  str        字符串
   * @param  initValue  报错时赋默认值
   */
  setJsonParse: (str: string, initValue: any) => {
    if (!str) {
      return initValue;
    }
    try {
      JSON.parse(str);
      return JSON.parse(str);
    } catch (e) {
      return initValue;
    }
  }
}

export default Tools;
