import React from 'react';

class HotModuleReplace extends React.Component {
    constructor() {
        super();
        this.state = {
            value: '456'
        }
        this.handleChane = this.handleChane.bind(this);
    }

    handleChane(evt) {
        console.log(evt.target);
    }

    render() {
        return (
            <div className="hot-module-replace">
                <input className="common-input" value={this.state.value} onChange={this.handleChane}></input>
            </div>
        )
    }

    componentDidMount() {
        // setInterval(() => {
        //     console.log('-----------');
        //     document.location.reload();
        // }, 1000);
    }
}

export default HotModuleReplace;
