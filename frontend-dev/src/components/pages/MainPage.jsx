import "./MainPage.css";
import CurrencyValue from "../data/CurrencyValue.jsx";
import CurrencyBaseLine from "../data/CurrencyBaseLine.jsx";
import {v4 as uuidv4} from "uuid";
import { useEffect, useState } from "react";


function MainPage() {
  const [components, setComponents] = useState();
  const [removeElementChecked, setRemoveElementChecked] = useState(false);
  useEffect(() => {
      let _components = [];
      let uuid = uuidv4();
      _components.push(<div><CurrencyValue currency="USD" isNegative={true} top={64} left={16} uuid={uuid}></CurrencyValue></div>)
      uuid = uuidv4();
      _components.push(<CurrencyBaseLine name="Индекс ММВБ" value="203.5" procent="9.7" period="За месяц" currency="$"  top={64} left={272}></CurrencyBaseLine>)
      setComponents(_components)
  }, [setComponents])
  
  document.onclick = (e) => {
    if (removeElementChecked) {
      let i = 0;
      let rect = document.body.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;
      
      console.log(x, y);
      while (i < components.length) {
        let component = components[i];
        console.log(component);
        i++;
      }
    }
  }

  function removeElementChange() {
    console.log(removeElementChecked);
    setRemoveElementChecked(true);
  }

  return (
    <>
      <header>
        <a class="logo">
          Dashboard.io
        </a>
        <nav>
          <div class="remove">
            <input type="checkbox" class="remove" id="removeComponentsCheckbox" onChange={removeElementChange}/>
            <label htmlFor="removeComponentsCheckbox">Удалить</label>
          </div>
          {/* <a className="selected">Главная</a>
          <a>Данные</a>
          <a>О нас</a> */}
        </nav>
      </header>
      <div class="main">
        {/* <Number name="Акции VK" value="203.5" procent="8.4" period="За день" currency="₽"></Number>
        <Number name="Акции Сбер" value="203.5" procent="10.3" period="За месяц" currency="$"></Number>
        <Number name="Фьючерс на нефть Brent" value="203.5" procent="-10.3" period="За день" currency="₽"></Number>
        <Number name="Индекс ММВБ" value="203.5" procent="9.7" period="За месяц" currency="$"></Number> */}
        {components}
      </div>
    </>
  );
}

export default MainPage;