import { useEffect, useState } from 'react';
import { getGoodsIds } from '../api/goodsIdsApi';
import { getGoods } from '../api/goodsApi';
import './Goods.css';
import { Pagination } from '../components/pagination/Pagination';
import { Loader } from '../components/loader/Loader';

export const Goods = () => {
	const [goods, setGoods] = useState(null);
	const [pageCount, setPageCount] = useState(0);
	const [offset, setOffset] = useState(0);
	const [limit, setLimit] = useState(110);
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		setLoader(true);
		getGoodsIds(offset, limit).then(goodsIdsData => {
			const goodsData = goodsIdsData?.result;
			getGoods(goodsData).then(goodsData => {
				const idSet = new Set();

				const filteredGoods = goodsData?.result.filter(item => {
					if (!idSet.has(item?.id)) {
						idSet.add(item?.id);
						return true;
					}
					return false;
				});
				if (limit <= 50) {
					setGoods(filteredGoods);
				}
				if (limit > 50) {
					setLimit(50);
					setGoods(filteredGoods);
				}
				
				if (pageCount === 0) {
					setPageCount(Math.ceil(filteredGoods?.length / 50));
				}

				setLoader(false);
			});
		});
	}, [offset, limit, pageCount]);

	const handlePageClick = event => {
		setOffset(event.selected * 50);
		console.log(event.selected * 50);
	};

	return (
		<div className='goods_wrapper'>
			<h1>Товары</h1>
			{loader ? (
				<Loader />
			) : (
				<div className='goods_container'>
					{goods &&
						goods.map(good => (
							<div className='goods_item' key={good.id}>
								<span className='goods_span'>{good.brand}</span>
								<span className='goods_span'>{good.product}</span>
								<span className='goods_span'>id: {good.id}</span>
								<span className='goods_span-price'>{good.price} ₽</span>
							</div>
						))}
				</div>
			)}
			{limit ? (
				<Pagination pageCount={pageCount} handlePageClick={handlePageClick} />
			) : (
				<div className='fake_div'></div>
			)}
		</div>
	);
};
