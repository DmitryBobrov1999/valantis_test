import './Dropdown.css';
import { getGoodsFilter } from '../../api/goodsFilter';
import { getGoods } from '../../api/goodsApi';
import { useEffect, useState } from 'react';
import { getGoodsIds } from '../../api/goodsIdsApi';

export const DropDown = ({
	setSelect,
	selectOptions,
	setOffset,
	selectedKey,
	setLoader,
	setAllGoods,
	setPageCount,
	offset,
	setCurrentPage,
}) => {
	const [inputValue, setInputValue] = useState(''); // Значение поля ввода.
	const [isDisButton, setIsDisButton] = useState(null); // Состояние кнопки.
	const [isDisInput, setIsDisInput] = useState(null); // Состояние инпута.
	let limit = 100;

	useEffect(() => {
		if (inputValue) {
			setIsDisButton(false);
		}
		if (!selectedKey) {
			setIsDisButton(false);
			setIsDisInput(true);
			setInputValue('');
		}
		if (selectedKey && !inputValue) {
			setIsDisButton(true);
			setIsDisInput(false);
		}
	}, [inputValue, selectedKey]); // блокирование кнопки при пустом инпуте (кроме дефолта).

	const handleChange = event => {
		setInputValue(event.target.value);
	};

	const handleSubmit = event => {
		event.preventDefault();
		setOffset(0);
		offset = 0;
		setCurrentPage(0);

		if (!selectedKey) {
			getGoodsIds().then(goodsIdsData => {
				const goodsIdsArray = goodsIdsData?.result;
				setPageCount(Math.ceil(goodsIdsArray?.length / 50));
			});

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
		} // вновь загрузить список без фильтрации по нажатию "по умолчанию"

		if (selectedKey) {
			getGoodsFilter(
				selectedKey,
				selectedKey === 'price' ? Number(inputValue) : inputValue
			).then(filteredIdsData => {
				const filteredIdsArray = filteredIdsData?.result;
				setLoader(true);
				setPageCount(Math.ceil(filteredIdsArray?.length / 50));
				getGoods(filteredIdsArray, offset).then(filteredData => {
					const filteredArray = filteredData?.result;

					const uniqueGoods = filteredArray.reduce(
						(uniqueItems, currentItem) => {
							if (!uniqueItems.find(item => item.id === currentItem.id)) {
								uniqueItems.push(currentItem);
							}
							return uniqueItems;
						},
						[]
					);

					setAllGoods(uniqueGoods);
				});
			});
		} // запрос с фильтрацией
	};

	return (
		<form className='dropdown_form' onSubmit={handleSubmit}>
			<div className='dropdown_div'>
				<select
					className='dropdown_select'
					onChange={e => setSelect(e.target.value)}
				>
					{Object.keys(selectOptions).map(option => (
						<option key={option} className='dropdown_option' value={option}>
							{option}
						</option>
					))}
				</select>
			</div>
			<button disabled={isDisButton} className='dropdown_button' type='submit'>
				найти
			</button>
			<input
				disabled={isDisInput}
				className='dropdown_input'
				placeholder='placeholder'
				onChange={handleChange}
				value={inputValue}
			/>
		</form>
	);
}; // компонент сортировки
