import React from 'react'
import Loader from '../../../Component/Loader';
import Banner from '../../../Elements/Banner';
import { ContentContext } from '../../../context/ContentContext';

const BannerSectionHome = () => {
    const { loadingMyNews } = React.useContext(ContentContext);
    
  return (
     <section className="Banner">
        {loadingMyNews ? <Loader /> : <Banner />}
      </section>
  )
}

export default BannerSectionHome
