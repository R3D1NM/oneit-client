import { Product } from "@/lib/types"
import { Link } from "react-router-dom"

interface ProductCardProps {
    product: Product
}

const ProductCard = (props: ProductCardProps) => {
    const {product} = props
    return (
    <div className="rounded-lg overflow-hidden shadow-sm ">
        <Link to={`/product/${product.productIdx}`} className="block">
            <img
                src={product.thumbnailUrl || "https://via.placeholder.com/400"}
                alt={product.name}
                width={400}
                height={300}
                className="relative z-[-10] w-full object-cover hover:opacity-80 transition-opacity"
            />
            <div className="p-4">
                <h3 className="max-w-full  text-sm font-semibold mb-2 overflow-hidden whitespace-nowrap  overflow-ellipsis">{product.name}</h3>
                <div className="flex items-center justify-end">
                    <span className="font-bold text-lg">{product.currentPrice.toLocaleString()}원</span>
                </div>
            </div>
        </Link>
    </div>
    )
}

export default ProductCard