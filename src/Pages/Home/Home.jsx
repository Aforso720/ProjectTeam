import "./Home.scss";
import ManagerList from "./components/ManagerList";
import EventsSectionHome from "./components/EventsSectionHome";
import BannerSectionHome from "./components/BannerSectionHome";
import TopTSectionHome from "./components/TopTSectionHome";
import SlaiderMobilVersHome from "./components/SlaiderMobilVersHome";
import Seo from "../../components/Seo/Seo";

const Home = () => {
  return (
    <>
      <Seo
        title="Project Team GGNTU — студенческая команда проектов и стартапов"
        description="Project Team GGNTU объединяет студентов для участия в конкурсах, грантах и IT-проектах. Следите за событиями и присоединяйтесь к команде."
        canonicalPath="/"
        ogTitle="Project Team GGNTU"
        ogDescription="Студенческая команда Project Team GGNTU: гранты, конкурсы и совместные IT-проекты."
        ogImage="/img/image2.webp"
        ogImageAlt="Команда Project Team GGNTU"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Project Team GGNTU",
          url: "https://project-team.site/",
          description:
            "Project Team GGNTU помогает студентам реализовывать проекты, участвовать в конкурсах и запускать стартапы.",
          logo: "https://project-team.site/img/LogoFoot.webp",
        }}
      />
      <section className="Home">
        <BannerSectionHome />
        <EventsSectionHome />
        <TopTSectionHome />
        <section className="aboutHome">
          <div className="contentAbout">
            <div className="textAbout">
              <h3>О нас</h3>
              <p>
                Project Team — это команда активных и амбициозных студентов
                ГГНТУ, которые специализируются на подаче заявок на гранты,
                конкурсы и стартапы. Мы помогаем превращать идеи в реальные
                проекты, открывая новые возможности для студентов и
                университета.
              </p>
            </div>
            <img
              src="img/image 6.webp"
              loading="lazy"
              className="imgAbout"
              alt="Фото команды Project Team"
            />
          </div>
        </section>
        <section className="manager">
          <h2>Руководители</h2>
          <ManagerList />
          <SlaiderMobilVersHome />
        </section>
      </section>
    </>
  );
};

export default Home;
