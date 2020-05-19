import React from 'react';
import ReactMarkdown from 'react-markdown';
import docs from './index.md';
import './index.scss';
class HMR extends React.Component {
    constructor() {
        super();
        this.initGoogleMap = this.initGoogleMap.bind(this);
    }

    render() {
        return (
            <div className='auto-refresh'>
                <strong>HMR 不适用于生产环境，只在开发环境使用。</strong>
                <strong>如何开启热模块替换</strong>
                <strong>模块热替换内部使用观察者模式</strong>
                <ReactMarkdown source={docs} escapeHtml={false}/>
            </div>
        )
    }

    componentDidMount() {

    }

    initGoogleMap() {
        let map = document.getElementById("google-map");
        this.google = new google.maps.Map(map, {
            center: {
                lat: 30,
                lng: 109
            },
            zoom: 4,
            minZoom: 4
        });
    }
}

export default HMR;