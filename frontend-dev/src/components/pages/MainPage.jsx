import "./MainPage.css";
import CurrencyValue from "../data/CurrencyValue.jsx";
import CurrencyBaseLine from "../data/CurrencyBaseLine.jsx";
import {v4 as uuidv4} from "uuid";
import { useEffect, useState, useContext, createContext } from "react";

export const componentsContext = createContext([]);


function MainPage() {
  const [components, setComponents] = useState([]);
  useEffect(() => {
      // let _components = [];
      // let uuid = uuidv4();
      // _components.push(<CurrencyValue isNegative={true} uuid={uuid}></CurrencyValue>)
      // uuid = uuidv4();
      // _components.push(<CurrencyBaseLine uuid={uuid}></CurrencyBaseLine>)
      // uuid = uuidv4();
      // _components.push(<CurrencyBaseLine   uuid={uuid}></CurrencyBaseLine>)
      // setComponents(_components)
      // uuid = uuidv4();
      // _components.push(<CurrencyValue isNegative={true} uuid={uuid}></CurrencyValue>)
  }, [])

  function addCurrencyValue() {
    let _components = [...components];
    let uuid = uuidv4();
    _components.push(<CurrencyValue uuid={uuid}></CurrencyValue>);
    setComponents(_components);
  }

  function addCurrencyBaseLine() {
    let _components = [...components];
    let uuid = uuidv4();
    _components.push(<CurrencyBaseLine uuid={uuid}></CurrencyBaseLine>);
    setComponents(_components);
  }

  function saveDashboard() {
    console.log(JSON.stringify(components))
  }

  return (
    <>
      <header>
        <a class="logo">
          Dashboard.io
        </a>
        <nav>
          {/* <p onClick={addCurrencyValue}>add value</p>
          <p onClick={addCurrencyBaseLine}>add line</p> */}
          <div class="dropdown">
            <button class="dropbtn">Валюта
              <i class="fa fa-caret-down"></i>
            </button>
            <div class="dropdown-content">
              <div class="element" onClick={addCurrencyValue}>Значение</div>
              <div class="element" onClick={addCurrencyBaseLine}>График</div>
            </div>
          </div>
          <div class="dropdown">
            <button class="dropbtn">Акции
              <i class="fa fa-caret-down"></i>
            </button>
            <div class="dropdown-content">
              <div class="element">Значение</div>
              <div class="element">График</div>
            </div>
          </div>
        </nav>
      </header>
      <div class="main">
        <componentsContext.Provider value={{components: components, setComponents: setComponents}}>
          {components}
        </componentsContext.Provider>
      </div>
    </>
  );
}

export default MainPage;