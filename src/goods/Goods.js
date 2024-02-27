import { useEffect, useState } from "react"
import { getGoods } from "../api/goodsApi"

export const Goods = () => {
	const [goods, setGoods] = useState(null)

	useEffect(() => {
		getGoods()
	}, [])
}