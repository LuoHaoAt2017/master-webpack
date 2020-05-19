import React from 'react';
import { HashRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';
import Home from '@/views/home';
import AutoRefresh from '@/views/auto-refresh';
import CodeSegment from '@/views/code-segment';
import Compression from '@/views/file-compression';
import ModuleMerge from '@/views/module-merge';
import Transcoder from '@/views/transcoder';
import '@/assets/scss/app.scss';

const navs = [
	{
		label: '首页',
		value: '/home'
	},
	{
		label: '代码转换',
		value: '/transcoder'
	},
	{
		label: '文件压缩',
		value: '/compression'
	},
	{
		label: '代码分割',
		value: '/code-segment'
	},
	{
		label: '模块合并',
		value: '/module-merge'
	},
	{
		label: '自动刷新',
		value: '/auto-refresh'
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
							<Route path="/auto-refresh">
								<AutoRefresh />
							</Route>
							<Route path="/code-segment">
								<CodeSegment />
							</Route>
							<Route path="/compression">
								<Compression />
							</Route>
							<Route path="/module-merge">
								<ModuleMerge />
							</Route>
							<Route path="/transcoder">
								<Transcoder />
							</Route>
							<Redirect to="/home" />
						</Switch>

					</div>
					<div className='foot'></div>
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
