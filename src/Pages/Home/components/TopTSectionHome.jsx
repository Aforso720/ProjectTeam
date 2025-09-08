import React from 'react'
import Loader from '../../../Component/Loader'
import CardsTop from './CardsTop'
import usePerson from '../../../API/usePerson'

const TopTSectionHome = () => {
  const { isloading: isloadingPersHome } = usePerson({ amount: 3});
  return (
    <section className="TopT">
        <h2>Лидеры рейтинга</h2>
        <ul className="CardTop">
          {isloadingPersHome ? <Loader /> : <CardsTop />}
        </ul>
      </section>
  )
}

export default TopTSectionHome
