import React from 'react'
import Loader from '../../../Component/Loader';
import Banner from '../../../Elements/Banner';
import usePosts from '../../../API/usePosts';

const BannerSectionHome = () => {
 const {date: isLoading } = usePosts()
    
  return (
     <section className="Banner">
        {isLoading ? <Loader /> : <Banner />}
      </section>
  )
}

export default BannerSectionHome
