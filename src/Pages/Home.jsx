import React from 'react'
import Banner from '../Elements/Banner'

const Home = () => {
  return (
    <div className='Home'>
        <div className='Banner'>
            <Banner/>
        </div>
        <div className='Events'>
          <div className='stateEvents'>
            <ul className='stateEvents'>

            </ul>
          </div>
        </div>
        <div className='TopT'></div>
        <div className='aboutHome'></div>
        <div className='Manajer'></div>
    </div>
  )
}

export default Home