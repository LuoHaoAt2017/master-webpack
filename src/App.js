import React from 'react';
import { HashRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';
import '@/assets/scss/app.scss';
import '@/assets/scss/home.scss';
import '@/assets/scss/common.scss';
import Home from '@/pages/Home';
import Plugin from '@/pages/Plugin';

const navs = [
	{
		label: '首页',
		value: '/home'
	},
	{
		label: '自定义插件',
		value: '/plugin'
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
								<Home/>
							</Route>
							<Route path="/plugin">
								<Plugin/>
							</Route>
							<Redirect to="/home" />
						</Switch>
					</div>
				</div>
			</Router>
		)
	}

	componentDidMount() {
		this.listenReload();
	}

	listenReload() {
		window.addEventListener('load', (evt) => {
			const href = window.location.hash.slice(1);
			this.changeRoute(href);
		});
	}

	changeRoute(value) {
		this.setState({
			route: value
		});
	}
}
export default App;