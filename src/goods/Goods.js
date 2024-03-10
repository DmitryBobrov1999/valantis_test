import { useEffect, useState } from 'react';
import { getGoodsIds } from '../api/goodsIdsApi';
import { getGoods } from '../api/goodsApi';
import './Goods.css';
import { Pagination } from '../components/pagination/Pagination';
import { Loader } from '../components/loader/Loader';
import { DropDown } from '../components/dropdown/Dropdown';

export const Goods = () => {
	const [goods, setGoods] = useState(null);
	const [pageCount, setPageCount] = useState(0); // Кол-во страниц.
	const [offset, setOffset] = useState(0); // Сдвиг на опр. кол-во элементов.
	const [loader, setLoader] = useState(false); // true/false состояния элемента загрузки.
	const [allGoods, setAllGoods] = useState(null); // Запись массива после удаления дубликатов.
	const [select, setSelect] = useState(null); // Название сортировки.
	const [currentPage, setCurrentPage] = useState(0); // Текущая страница.

	const selectOptions = {
		'по умолчанию': null,
		цена: 'price',
		бренд: 'brand',
		название: 'product',
	}; // Опции фильтрации.

	const selectedKey = selectOptions[select];

	let limit = 100; // Лимит выводимых элементов.

	useEffect(() => {
		if (pageCount === 0) {
			getGoodsIds().then(goodsIdsData => {
				const goodsIdsArray = goodsIdsData?.result;
				setPageCount(Math.ceil(goodsIdsArray?.length / 50));
			});
		} // Запись в стейт кол-ва страниц при первичной загрузке.
	}, []);

	useEffect(() => {
		if (!selectedKey) {
			getGoodsIds(offset, limit).then(goodsIdsData => {
				const goodsIdsArray = goodsIdsData?.result;
				setLoader(true);
				getGoods(goodsIdsArray).then(goodsData => {
					const goodsArray = goodsData?.result;

					const uniqueGoods = goodsArray.reduce((uniqueItems, currentItem) => {
						if (!uniqueItems.find(item => item.id === currentItem.id)) {
							uniqueItems.push(currentItem);
						}
						return uniqueItems;
					}, []);

					setAllGoods(uniqueGoods);
				});
			});
		} // Запрос на элементы без сортировки.
	}, [offset]); // Вызов запроса при переключении страниц.

	useEffect(() => {
		if (allGoods && !selectedKey) {
			const item = allGoods.slice(0, 50);
			setGoods(item);
			setLoader(false);
		}
		if (allGoods && selectedKey) {
			const item = allGoods.slice(offset, offset + 50);
			setGoods(item);
			setLoader(false);
		}
	}, [allGoods, offset]); // Отображение только 50 элементов.

	const handlePageClick = event => {
		setOffset(event.selected * 50);
		setCurrentPage(event.selected);
	}; // Функция при клике по пагинации.

	return (
		<div className='goods_wrapper'>
			<DropDown
				setSelect={setSelect}
				selectOptions={selectOptions}
				setOffset={setOffset}
				selectedKey={selectedKey}
				setCurrentPage={setCurrentPage}
				setLoader={setLoader}
				setAllGoods={setAllGoods}
				setPageCount={setPageCount}
				offset={offset}
			/>
			{loader ? (
				<Loader />
			) : (
				<div className='goods_container'>
					{goods &&
						goods.map(good => (
							<div className='goods_item' key={good.id}>
								<span className='goods_span goods_span-brand'>
									{good.brand}
								</span>
								<span className='goods_span goods_span-product'>
									{good.product}
								</span>
								<span className='goods_span goods_span-id'>id: {good.id}</span>
								<span className='goods_span goods_span-price'>
									{good.price} ₽
								</span>
							</div>
						))}
				</div>
			)}
			{goods ? (
				<Pagination
					currentPage={currentPage}
					pageCount={pageCount}
					handlePageClick={handlePageClick}
				/>
			) : (
				<div className='fake_div'></div>
			)}
		</div>
	);
};
