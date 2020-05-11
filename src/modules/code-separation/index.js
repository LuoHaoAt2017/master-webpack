import React from 'react';
import {cube} from '@/utils/math';

function Codeseparation() {
	{cube(2)}
	return <div>
		<article>
			<section>
				<h4>Code Separation</h4>
				<div>
					<p>对于没有副作用的文件在没用引用的情况下可以删除。</p>
					<p>将文件标记为无副作用：在module.rules中指定sideEffects</p>
					<p>在webpack中将mode设置为production，启用uglifyjs压缩。</p>
				</div>
			</section>
		</article>
	</div>
}

export default Codeseparation;
