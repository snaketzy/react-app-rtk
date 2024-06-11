import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment  } from "./store/counter/counterSlice";
import { Button, Row } from 'antd';
import { fetchApi } from './utils/fetchApi';
import { fetchDict } from './store/counter/commonSlice';


function App() {
  const {
    counter: {value},
    common: {dict}
  } = useSelector((state: any) => state)
  const dispatch = useDispatch()

  const getDict = async() => {
    try {
      const res = await fetchApi("post","roster/weizhi/common/queryExtraMetaMapList",{});
      if(res.result === 0) {
        dispatch(fetchDict(res.data.extra))
      }
    } catch(e: any) {
      console.log(e.detail || "ERROR")
    }
  }

  useEffect(() => {
    getDict()
  },[])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <Row>
          接口字典 {dict && dict["account.billMode"][0].dataValue}
        </Row>
        <Row justify="space-around" style={{ marginTop: 16}}>
          <Button
            type='primary'
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            增加
          </Button>
          <div style={{ alignContent:"center", marginLeft: 16, marginRight: 16}}> 累计 {value} </div>
          <Button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            减少
          </Button>
        </Row>
      </header>
    </div>
  );
}

export default App;
