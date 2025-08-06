import React from 'react'
import Loader from '../../../Component/Loader'
import CardsTop from './CardsTop'
import { PersonContext } from '../../../context/PersonContext'

const TopTSectionHome = () => {
    const { isloadingPersHome } = React.useContext(PersonContext);
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
