import "./MainPage.css";
import Number from "../data/Number.jsx";
import BaseLine from "../data/BaseLine.jsx";

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
        <Number name="Курс Доллара" value="30.5" procent="0.3" period="За день" isNegative={true} currency="₽"></Number>
        <Number name="Акции VK" value="203.5" procent="8.4" period="За день" currency="₽"></Number>
        <Number name="Акции Сбер" value="203.5" procent="10.3" period="За месяц" currency="$"></Number>
        <Number name="Фьючерс на нефть Brent" value="203.5" procent="-10.3" period="За день" currency="₽"></Number>
        <Number name="Индекс ММВБ" value="203.5" procent="9.7" period="За месяц" currency="$"></Number>

        <BaseLine name="Индекс ММВБ" value="203.5" procent="9.7" period="За месяц" currency="$"></BaseLine>
      </div>
    </>
  );
}

export default MainPage;