import React from 'react';
import './index.scss';
import '@/assets/scss/common.scss';
import Icon from '@/assets/img/webpack.jpg';

function Home() {
    return (
        <div className='home'>
            <img src={Icon} alt='webpack'></img>
        </div>
    )
}
export default Home;