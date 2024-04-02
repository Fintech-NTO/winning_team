import "./MainPage.css";
import Number from "../data/Number.jsx";

function MainPage() {
  return (
    <>
      <header>
        <a class="logo">
          Dashboard.io
        </a>
        <nav>
          <a className="selected">Главная</a>
          <a>Данные</a>
          <a>О нас</a>
        </nav>
      </header>
      <div class="main">
        <Number name="Курс Рубля" value="30.5" procent="0.3" period="За день" isNegative={true}></Number>
        <Number name="Акции VK" value="203.5" procent="8.4" period="За день"></Number>
        <Number name="Акции Сбер" value="203.5" procent="10.3" period="За месяц"></Number>
        <Number name="Фьючерс на нефть Brent" value="203.5" procent="-10.3" period="За день"></Number>
        <Number name="Индекс ММВБ" value="203.5" procent="9.7" period="За месяц"></Number>
        <Number name="Курс Юаней" value="203.5" procent="167.2" period="За год"></Number>
      </div>
    </>
  );
}

export default MainPage;