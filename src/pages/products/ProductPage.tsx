import { AlertInfo } from "@/components/molecules";
import ProductList from "@/components/organisms/products/ProductList";
// import ProductSearch from "@/components/organisms/products/ProductSearch";
import MainLayout from "@/components/templates/MainLayout";
import { useProducts } from "@/hooks";
import { axiosInstance } from "@/utils";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ProductsPage() {
    const { products } = useProducts();
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const location = useLocation();

    useEffect(() => {
        const state = location.state as { message?: string; };
        if (state?.message) {
            setMessage(state.message);
            setShowAlert(true);
            navigate("/products", { state: {} });
        }
    }, [location, navigate]);

    const handleClick = (product: any) => {
        localStorage.setItem("productDetail", JSON.stringify(product));
        navigate(`/products/${product.id}`);
    };
    const handleAddToCart = async (productId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        try {
            await axiosInstance.post("/carts", { productId });
            setMessage("Produk berhasil ditambahkan ke keranjang.");
        } catch (error) {
            setMessage("Produk gagal ditambahkan ke keranjang.");
        } finally {
            setShowAlert(true);
        }
    };
    return (
        <MainLayout>
            <div className="flex flex-col gap-10">
                {/* <ProductSearch /> */}
                <ProductList products={products} handleClick={handleClick} handleAddToCart={handleAddToCart} />
            </div>
            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && <AlertInfo handleAlert={() => setShowAlert(false)} message={message} />}
            </AnimatePresence>
        </MainLayout>
    );
}

export default ProductsPage;
