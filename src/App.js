import React from 'react';
// import TreeShaking from './modules/tree-shaking/index.js';
// import CodeSeparation from './modules/code-separation/index.js';
import HotModuleReplace from './modules/hot-module-replacement';

function App() {
    return (
		<div>
			<HotModuleReplace/>
		</div>
	)
}

export default App;
