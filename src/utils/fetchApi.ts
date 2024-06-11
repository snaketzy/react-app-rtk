import { CID, TOKEN} from "./tools";
import { message } from "antd";

const codeMessage: {[key: number]: string} = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};
const checkStatus = (response: Response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  const error: any = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

export function fetchApi(method: string, url: string, data?: any) {
  const token = TOKEN
  const cid = CID
  const headers: {[key: string]: string} = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Authorization": `Bearer ${token}`,
    "Mscid": cid
  };

  
  // 断网情况check
  if (!navigator.onLine) {
    message.error("网络原因，请检查网络后继续！");
    return Promise.reject();
  }


  // 没有CID或token
  if (!token || !cid) {
    delete headers.Authorization;
    delete headers.Mscid;
  }
  // 发出请求
  return fetch("/" + url, {
    method,
    credentials: "include",
    headers: {...headers},
    body: method === "post" ? JSON.stringify(data) : undefined
  })
  .then(checkStatus)
  .then(res => res.json())
  .then(value => {
    if (value.result === 401) {
      console.log("401")
    } else if (value.result === 0) {
      return value;
    } else {
      message.error(value.detail || "获取数据异常");
    }
  })
  .catch(() => {
    console.log("ERROR")
  })
}

export function fetchFileApi(method: string, url: string, data?: any) {
  const token = TOKEN;
  const cId = CID;
  let respHeader = "content-type";
  let fn: any = null;

  // 断网情况check
  if (!navigator.onLine) {
    message.error("网络原因，请检查网络后继续！");
    return;
  }

  // header设置
  const headers: {[key: string]: string} = {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Authorization": "Bearer " + token,
    "Mscid": cId
  };

  // 检查token和cid
  if (!token) {
    delete headers.Authorization;
  }
  if (!cId) {
    delete headers.Mscid;
  }

  // 去除fn方法，文件升级接口不传fn，不会进入此方法；下载附件会进入此方法，最终data为{}
  if (data.fn) {
    fn = data.fn;
    respHeader = "content-disposition";
    delete data.fn;
  }

  // 发出请求，文件升级为post方式，下载附件为get方式。
  return fetch("/" + url, {
    method,
    headers: {...headers},
    body: method === "post" ? data : undefined
  })
  .then(res => {
    const str: string | null = res.headers.get(respHeader);
    if (fn) {
      if (str) {
        fn(str.split(";")[1].split("=")[1]);
        return res.blob();
      } else {
        return res.json();
      }
    }
    if (!str) {
      return res.blob();
    }
    return res.json();
  })
  .then(value => {
    if (value.detail) {
      message.error(value.detail);
    } else {
      return value;
    }   
  })
}
