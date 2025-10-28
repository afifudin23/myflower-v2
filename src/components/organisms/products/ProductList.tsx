import ProductCard from "@/components/molecules/products/ProductCard";

function ProductList({ products, handleClick, handleAddToCart }: any) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product: any) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    handleClick={() => handleClick(product)}
                    handleAddToCart={(e: React.MouseEvent) => handleAddToCart(product.id, e)}
                />
            ))}
        </div>
    );
}

export default ProductList;
