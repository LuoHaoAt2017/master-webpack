import React from 'react';
import './index.scss';
import '@/assets/scss/common.scss';
import _ from 'loadsh'
import AAA from '@/components/AAA.js';
const current = _.now();
console.log('current: ', current);
class Transform extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className='transform-chapter'>
                Transform
                <footer><AAA/></footer>
            </div>
        )
    }
}

export default Transform;