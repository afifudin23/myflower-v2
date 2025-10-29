import { Loading } from "@/components/atoms";
import BackButton from "@/components/atoms/BackButton";
import { AlertInfo } from "@/components/molecules";
import ProductDetailSection from "@/components/organisms/products/ProductDetailSection";
import ProductReviewSection from "@/components/organisms/products/ProductReviewSection";
import ReviewForm from "@/components/organisms/products/ReviewForm";
import MainLayout from "@/components/templates/MainLayout";
import { useOrders, useReviews } from "@/hooks";
import { reviewSchema } from "@/schemas";
import { axiosInstance } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ProductDetailPage() {
    const [product, setProduct] = useState({ id: "", name: "", images: [], price: 0, stock: 0 });
    const { reviews } = useReviews(product?.id);
    const [myReview, setMyReview] = useState<any>(null);
    const { orders } = useOrders();
    const [hasPurchased, setHasPurchased] = useState(false);
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const { handleSubmit, control, reset } = useForm<reviewSchema.CreateType>({
        resolver: zodResolver(reviewSchema.create),
        defaultValues: {
            id: "",
            rating: 0,
            comment: "",
        },
    });

    useEffect(() => {
        const storedProduct = JSON.parse(localStorage.getItem("productDetail") || "{}");
        if (storedProduct) {
            setProduct(storedProduct);

            const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

            const isPurchased = orders.some((order: any) =>
                order.items.some((item: any) => item.productId === product.id && order.userId === currentUser.id)
            );
            setHasPurchased(isPurchased);

            const myReview = reviews.find((r: any) => r.userId === currentUser.id) || {
                id: "",
                rating: 0,
                comment: "",
            };
            if (myReview) {
                reset({
                    id: myReview.id,
                    rating: myReview.rating,
                    comment: myReview.comment,
                });
                if (myReview.rating === 0) return;
                setMyReview(myReview);
            }
        }
    }, [reviews, reset, orders, product.id]);

    const onCreate = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await axiosInstance.post(`/products/${product.id}/reviews`, data);
            setMessage("Review berhasil ditambahkan");
        } catch (error: any) {
            console.log(error.response.data);
            setMessage("Gagal menambahkan review.");
        } finally {
            setIsLoading(false);
            setShowAlert(true);
        }
    });

    const onUpdate = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await axiosInstance.post(`/products/${product.id}/reviews`, data);
            setMessage("Review berhasil diperbarui.");
        } catch (error: any) {
            console.log(error.response.data);
            setMessage("Gagal menambahkan review.");
        } finally {
            setIsLoading(false);
            setShowAlert(true);
        }
    });

    return (
        <MainLayout>
            <div className="max-w-5xl space-y-10 mx-auto">
                <BackButton onClick={() => navigate("/products")}>Kembali ke Produk</BackButton>
                <ProductDetailSection product={product} />
                <ReviewForm
                    onSubmit={myReview ? onUpdate : onCreate}
                    control={control}
                    isUpdate={!!myReview}
                    hasPurchased={hasPurchased}
                />
                <ProductReviewSection reviews={reviews} />
            </div>

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (["Review berhasil"].some((msg) => message.includes(msg)))
                                navigate("/products");
                            setShowAlert(false);
                        }}
                        message={message}
                    />
                )}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && <Loading />}
        </MainLayout>
    );
}

export default ProductDetailPage;
