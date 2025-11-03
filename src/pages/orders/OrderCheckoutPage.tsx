import { Loading } from "@/components/atoms";
import BackButton from "@/components/atoms/BackButton";
import Button from "@/components/atoms/Button";
import SectionTitle from "@/components/atoms/SectionTitle";
import { AlertConfirm, AlertInfo } from "@/components/molecules";
import InputText from "@/components/molecules/inputs/InputText";
import OrderForm from "@/components/organisms/orders/OrderForm";
import MainLayout from "@/components/templates/MainLayout";
import { BG_COLORS } from "@/constants/colors";
import { orderSchema } from "@/schemas";
import { axiosInstance, formatters } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function OrderCheckoutPage() {
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    const totalItem = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total: number, item: any) => total + item.product.price * item.quantity, 0);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [showAlertConfirm, setShowAlertConfirm] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        const item = JSON.parse(localStorage.getItem("cartItems") || "[]");
        if (!item.length) {
            navigate("/products");
        }
    }, [navigate]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "");
        document.body.appendChild(script);
    }, []);

    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<orderSchema.CreateType>({
        resolver: zodResolver(orderSchema.create),
        defaultValues: {
            deliveryOption: undefined,
            deliveryAddress: "",
            readyDate: undefined,
            paymentMethod: undefined,
            items: cartItems.map((item: any) => ({
                productId: item.product.id,
                quantity: item.quantity,
                message: "",
            })),
        },
    });

    const { fields } = useFieldArray({
        control,
        name: "items",
    });
    const confirmBackButton = () => {
        setMessage("Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang belum disimpan akan hilang.");
        setShowAlertConfirm(true);
    };

    const handleBackButton = async () => {
        if (order) {
            await axiosInstance.delete(`/orders/myflower/${order.id}`);
            setMessage("Pesanan berhasil dibatalkan.");
            setShowAlert(true);
        }
        navigate("/products");
    };

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            let createOrder = order;
            if (!createOrder) {
                const response = await axiosInstance.post("/orders/myflower", {
                    ...data,
                    readyDate: data.readyDate.toISOString(),
                });
                createOrder = response.data.data;
                setOrder(response.data.data);
            }

            if (data.paymentMethod === "COD") {
                setMessage("Pesanan berhasil dibuat. Silahkan melakukan pembayaran melalui metode COD");
                setShowAlert(true);
                return true;
            }

            const currentOrderCode = createOrder.orderCode;
            const snapResponse = await axiosInstance.post("/transactions/create", { orderCode: currentOrderCode });
            const snapToken = snapResponse.data.data.token;

            window.snap.pay(snapToken, {
                onSuccess: async () => {
                    localStorage.removeItem("snapToken");
                    localStorage.removeItem("cartItems");
                    window.location.href = "/orders/payment-success";
                },
                onPending: async () => {
                    await axiosInstance.delete("/carts");
                    localStorage.setItem("snapToken", snapToken);
                    window.location.href = "/orders/" + order.id;
                },
                onError: async (error: any) => {
                    console.error("Payment Failed:", error);
                    await axiosInstance.delete("/orders/myflower/" + order.id);
                    window.location.href = "/orders/payment-failed";
                },
                onClose: async () => console.log("Payment closed"),
            });
        } catch (error: any) {
            console.log(error);
            const axiosError = error as AxiosError;
            if (axiosError.code === "ERR_NETWORK") {
                setMessage("Tidak Dapat Terhubung Ke Server. Periksa Koneksi Internet Anda");
            } else {
                setMessage("Gagal Membuat Pesanan. Silahkan Periksa Kembali");
            }
            setShowAlert(true);
        } finally {
            setIsLoading(false);
        }
    });

    return (
        <MainLayout className="w-full max-w-7xl mx-auto mb-32">
            <div className="space-y-6">
                <BackButton onClick={confirmBackButton}>Kembali ke Keranjang</BackButton>
                <SectionTitle className="text-3xl font-bold">Checkout</SectionTitle>

                <form className="grid md:grid-cols-2 gap-6" onSubmit={onSubmit}>
                    {/* Informasi Pengiriman */}
                    <div className="space-y-4">
                        <SectionTitle>Informasi Pengiriman</SectionTitle>
                        <OrderForm control={control} errors={errors} watch={watch} />
                    </div>

                    {/* Ringkasan Pesanan */}
                    <div className="space-y-4">
                        <SectionTitle>Ringkasan Pesanan</SectionTitle>
                        <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-2">
                            <div className="space-y-3">
                                {fields.map((field: any, index: number) => (
                                    <div key={field.id} className="flex flex-col gap-2">
                                        <p className="flex justify-between">
                                            <span className="font-medium">
                                                {cartItems[index]?.product?.name} ({cartItems[index]?.quantity}x)
                                            </span>
                                            <span className="ml-2">Rp {cartItems[index].product.price}</span>
                                        </p>
                                        <InputText
                                            name={`items.${index}.message`}
                                            label="pesan untuk penjual (opsional)"
                                            formInput={false}
                                            control={control}
                                            error={errors.items?.[index]?.message}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <span>Total Item</span>
                                <span>{totalItem}</span>
                            </div>

                            <div className="flex justify-between font-semibold">
                                <span>Total Harga</span>
                                <span>{formatters.formatRupiah(totalPrice)}</span>
                            </div>
                        </div>

                        <Button type="submit" className={`w-full p-2 text-white rounded-lg ${BG_COLORS.primary}`}>
                            Bayar Sekarang
                        </Button>
                    </div>
                </form>
            </div>

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (
                                [
                                    "Pesanan berhasil dibuat",
                                    "Terjadi kesalahan saat pembayaran",
                                    "Gagal Membuat Pesanan",
                                    "Pesanan berhasil dibatalkan",
                                ].some((msg) => message.includes(msg))
                            )
                                navigate("/products");
                            if (message.includes("Anda belum melakukan pembayaran")) navigate("/orders");
                            setShowAlert(false);
                        }}
                        message={message}
                    />
                )}
                {showAlertConfirm && message && (
                    <AlertConfirm
                        message={message}
                        handleAlert={() => {
                            setShowAlertConfirm(false);
                        }}
                        handleResultConfirm={handleBackButton}
                    />
                )}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && <Loading />}
        </MainLayout>
    );
}

export default OrderCheckoutPage;
