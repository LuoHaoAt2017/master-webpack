import React from 'react';
import { HashRouter as Router, Route, Redirect, Link, Switch } from 'react-router-dom';
import Home from '@/views/home';
import AutoRefresh from '@/views/auto-refresh';
import CodeSegment from '@/views/code-segment';
import Compression from '@/views/file-compression';
import ModuleMerge from '@/views/module-merge';
import Transcoder from '@/views/transcoder';

function App() {
	return (
		<Router>
			<div className='root'>
				<div className='navigator'>
					<ul>
						<li>
							<Link to="/transcoder">代码转换</Link>
						</li>
						<li>
							<Link to="/compression">文件压缩</Link>
						</li>
						<li>
							<Link to="/code-segment">代码分割</Link>
						</li>
						<li>
							<Link to="/module-merge">模块合并</Link>
						</li>
						<li>
							<Link to="/auto-refresh">自动刷新</Link>
						</li>
					</ul>
				</div>
				<div className='content'>
					<Switch>
						<Route path="/home">
							<Home/>
						</Route>
						<Route path="/auto-refresh">
							<AutoRefresh/>
						</Route>
						<Route path="/code-segment">
							<CodeSegment/>
						</Route>
						<Route path="/compression">
							<Compression/>
						</Route>
						<Route path="/module-merge">
							<ModuleMerge/>
						</Route>
						<Route path="/transcoder">
							<Transcoder/>
						</Route>
						<Redirect to="/home"/>
					</Switch>
					
				</div>
				<div className='foot'>

				</div>
			</div>
		</Router>
	)
}

export default App;
