import React from 'react';
import { HashRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';
import Home from '@/views/index';
import '@/assets/scss/app.scss';

const navs = [
	{
		label: '首页',
		value: '/home'
	}
];

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			route: '/home'
		}
		this.changeRoute = this.changeRoute.bind(this);
	}

	render() {
		return (
			<Router>
				<div className='root'>
					<div className='navigator'>
						<ul>
							{
								navs.map((elem, index) => (
									<li key={index} 
										onClick={() => {this.changeRoute(elem.value)}}
										className={this.state.route === elem.value ? 'active': null}>
										<Link to={elem.value}>{elem.label}</Link>
									</li>
								))
							}
						</ul>
					</div>
					<div className='content'>
						<Switch>
							<Route path="/home">
								<Home />
							</Route>
							<Redirect to="/home" />
						</Switch>

					</div>
				</div>
			</Router>
		)
	}

	changeRoute(value) {
		this.setState({
			route: value
		});
	}

}

export default App;
