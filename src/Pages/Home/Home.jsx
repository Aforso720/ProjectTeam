import "./Home.scss";
import ManagerList from "./components/ManagerList";
import EventsSectionHome from "./components/EventsSectionHome";
import BannerSectionHome from "./components/BannerSectionHome";
import TopTSectionHome from './components/TopTSectionHome'
import SlaiderMobilVersHome from "./components/SlaiderMobilVersHome";

const Home = () => {
  return (
    <section className="Home">
      <BannerSectionHome/>
      <EventsSectionHome/>
      <TopTSectionHome/>
      <section className="aboutHome">
        <div className="contentAbout">
          <div className="textAbout">
            <h3>О нас</h3>
            <p>
              Project Team — это команда активных и амбициозных студентов ГГНТУ,
              которые специализируются на подаче заявок на гранты, конкурсы и
              стартапы. Мы помогаем превращать идеи в реальные проекты, открывая
              новые возможности для студентов и университета.
            </p>
          </div>
          <img src="img/image 6.webp" loading="lazy" className="imgAbout" alt="Фото Команды" />
        </div>
      </section>
      <section className="manager">
        <h2>Руководители</h2>
        <ManagerList />
        <SlaiderMobilVersHome/>
      </section>
    </section>
  );
};

export default Home;
