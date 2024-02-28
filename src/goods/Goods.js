import { useEffect, useState } from 'react';
import { getGoodsIds } from '../api/goodsIdsApi';
import { getGoods } from '../api/goodsApi';
import './Goods.css';

export const Goods = () => {
	const [goodsIds, setGoodsIds] = useState(null);
	const [goods, setGoods] = useState(null);

	useEffect(() => {
		getGoodsIds().then(goodsIdsData => {
			
			setGoodsIds(goodsIdsData.result);
		});
	}, []);

	console.log(goodsIds);

	useEffect(() => {
		getGoods(goodsIds).then(goodsData => {
			console.log(goodsData?.result);
			setGoods(goodsData?.result);
		});
	}, [goodsIds]);

	return (
		<div className='goods_wrapper'>
			<h1>Товары</h1>
			<div className='goods_container'>
				{goods &&
					goods.map(good => (
						<div className='goods_item' key={good}>
							<p className='goods_span'>{good.id}</p>
							<p className='goods_span'>{good.price}</p>
							<p className='goods_span'>{good.product}</p>
						</div>
					))}
			</div>
		</div>
	);
};
