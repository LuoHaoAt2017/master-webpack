import React from 'react';
import { 
	HashRouter as Router, 
	Route, 
	Redirect, 
	Link, 
	Switch
} from 'react-router-dom';
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
		label: '模块热替换',
		value: '/hot-module-replace'
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
		return (<Router>
				<div className='root'>
					<div className='navigator'>
						<ul>
							{
								navs.map((elem, index) => (
									<li key={index}
										onClick={() => { this.changeRoute(elem.value) }}
										className={this.state.route === elem.value ? 'active' : null}>
										<Link to={elem.value}>{elem.label}</Link>
									</li>
								))
							}
						</ul>
					</div>
					<div className='content'>
						<Switch>
							<Route path="/home">
								{async () => await import('@/views/home')}
							</Route>
							<Route path="/hot-module-replace">
								{async () => await import('@/views/hot-module-replace')}
							</Route>
							<Route path="/code-segment">
								{async () => await import('@/views/code-segment')}
							</Route>
							<Route path="/compression">
								{async () => await import('@/views/file-compression')}
							</Route>
							<Route path="/module-merge">
								{async () => await import('@/views/module-merge')}
							</Route>
							<Route path="/transcoder">
								{async () => await import('@/views/transcoder')}
							</Route>
							<Redirect to="/home" />
						</Switch>
					</div>
					<div className='foot'></div>
				</div>
			</Router>)
	}

	componentDidMount() {
		const url = process.env.APP_URL;
		console.log(url);
	}

	changeRoute(value) {
		this.setState({
			route: value
		});
	}


}

export default App;
