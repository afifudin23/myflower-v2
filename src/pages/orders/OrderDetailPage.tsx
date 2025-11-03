import { Loading } from "@/components/atoms";
import BackButton from "@/components/atoms/BackButton";
import { AlertConfirm, AlertInfo } from "@/components/molecules";
import OrderDetailSection from "@/components/organisms/orders/OrderDetailSection";
import OrderReceipt from "@/components/organisms/orders/OrderReceipt";
import MainLayout from "@/components/templates/MainLayout";
import { axiosInstance } from "@/utils";
import { pdf } from "@react-pdf/renderer";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function OrderDetailPage() {
    const [order, setOrder] = useState<any>({});
    const [snapToken, setSnapToken] = useState<string | null>("");
    const navigate = useNavigate();
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showAlertConfirm, setShowAlertConfirm] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const storedOrder = JSON.parse(localStorage.getItem("orderDetail") || "{}");
        setSnapToken(localStorage.getItem("snapToken"));
        setOrder(storedOrder);
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "");
        document.body.appendChild(script);
    }, []);

    const confirmCancelOrder = () => {
        setMessage("Apakah Anda yakin ingin membatalkan pesanan ini?");
        setShowAlertConfirm(true);
    };
    const handleCancelOrder = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.patch(`/orders/myflower/${order.id}/cancel`);
            localStorage.removeItem("orderDetail");
            localStorage.removeItem("snapToken");
            setMessage("Pesanan berhasil dibatalkan.");
            setShowAlert(true);
        } catch (error: any) {
            setMessage("Gagal membatalkan pesanan.");
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const confirmConfirmOrder = () => {
        setMessage("Apakah Anda yakin pesanan sudah diterima?");
        setShowAlertConfirm(true);
    };
    const handleConfirmOrder = async () => {
        setIsLoading(true);
        try {
            await axiosInstance.patch(`/orders/myflower/${order.id}/confirm`);
            localStorage.removeItem("orderDetail");
            localStorage.removeItem("snapToken");
            setMessage("Pesanan berhasil diterima.");
            setShowAlert(true);
        } catch (error: any) {
            setMessage("Gagal menerima pesanan.");
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePay = () => {
        if (snapToken) {
            window.snap.pay(snapToken, {
                onSuccess: () => {
                    localStorage.removeItem("cartItems");
                    localStorage.removeItem("snapToken");
                    window.location.href = "/orders/payment-success";
                },
                onPending: () => {
                    localStorage.setItem("snapToken", snapToken);
                },
                onError: async (error: any) => {
                    console.error("Payment Failed:", error);
                    await axiosInstance.delete("/orders/myflower/" + order.id);
                    window.location.href = "/orders/payment-failed";
                },
            });
        }
    };
    const handlePrintPdf = async () => {
        const blob = await pdf(<OrderReceipt data={order} />).toBlob();
        const url = URL.createObjectURL(blob);

        const newWindow = window.open(url);
        if (newWindow) {
            newWindow.onload = function () {
                newWindow.focus();
                newWindow.print();
            };
        }
    };

    const handleClickReview = (index: number) => {
        localStorage.setItem("productDetail", JSON.stringify(order.items[index].product));
    };

    return (
        <MainLayout className="w-full max-w-5xl xl:max-w-7xl mx-auto">
            <div className="space-y-6">
                <BackButton onClick={() => navigate("/orders")}>Kembali ke Pesanan</BackButton>

                <OrderDetailSection
                    order={order}
                    snapToken={snapToken}
                    handleCancelOrder={confirmCancelOrder}
                    handleConfirmOrder={confirmConfirmOrder}
                    handlePay={handlePay}
                    handleClickReview={handleClickReview}
                    handlePrintPdf={handlePrintPdf}
                />
            </div>

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (
                                ["Pesanan berhasil dibatalkan.", "Pesanan berhasil diterima."].some((msg) =>
                                    message.includes(msg)
                                )
                            )
                                navigate("/orders");
                            if (
                                ["Gagal membatalkan pesanan.", "Gagal menerima pesanan."].some((msg) =>
                                    message.includes(msg)
                                )
                            )
                                return false;
                            setShowAlert(false);
                        }}
                        message={message}
                    />
                )}
                {showAlertConfirm && message === "Apakah Anda yakin ingin membatalkan pesanan ini?" && (
                    <AlertConfirm
                        message={message}
                        handleAlert={() => {
                            setShowAlertConfirm(false);
                        }}
                        handleResultConfirm={handleCancelOrder}
                    />
                )}
                {showAlertConfirm && message === "Apakah Anda yakin pesanan sudah diterima?" && (
                    <AlertConfirm
                        message={message}
                        handleAlert={() => setShowAlertConfirm(false)}
                        handleResultConfirm={handleConfirmOrder}
                    />
                )}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && <Loading />}
        </MainLayout>
    );
}

export default OrderDetailPage;
