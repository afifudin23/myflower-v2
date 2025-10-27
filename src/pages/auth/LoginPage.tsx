import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthTemplate from "@/components/templates/AuthTemplate";
import AuthForm from "@/components/organisms/auth/AuthForm";
import { TEXT_COLORS } from "@/constants/colors";
import axiosInstance from "@/utils/axiosInstance";
import { LOGIN_FIELDS } from "@/components/organisms/auth/auth.constants";
import useAuthStore from "@/stores/useAuthStore";
import { authSchema } from "@/schemas";
import { AnimatePresence } from "framer-motion";
import { AlertInfo } from "@/components/molecules";
import { Loading } from "@/components/atoms";

function Login() {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<authSchema.LoginType>({
        resolver: zodResolver(authSchema.login),
    });
    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.post("auth/login", {
                username: data.username,
                password: data.password,
            });
            const resData = response.data.data;
            if (resData.needVerification) {
                setEmail(resData.email);
                setMessage("Email belum terverifikasi. Mengalihkan ke halaman verifikasi...");
                setShowAlert(true);
                return;
            }
            await useAuthStore.getState().getMe();
            navigate("/products");
        } catch (error: any) {
            const axiosError = error as AxiosError;
            setIsLoading(false);
            setShowAlert(true);
            if (axiosError.code === "ERR_NETWORK") {
                setMessage("Tidak Dapat Terhubung Ke Server. Periksa Koneksi Internet Anda");
            }
            if (axiosError.response) {
                setMessage(error.response.data.message);
            }
        } finally {
            setIsLoading(false);
        }
    });
    return (
        <AuthTemplate description="Masuk untuk memulai pemesanan bunga secara online">
            <AuthForm
                fields={LOGIN_FIELDS}
                register={register}
                onSubmit={onSubmit}
                errors={errors}
                buttonName="Masuk"
                formType="login"
                link={
                    <p className="text-center">
                        Belum memiliki akun?{" "}
                        <Link to="/auth/register" className={`font-bold hover:underline ${TEXT_COLORS.primary}`}>
                            Buat akun baru sekarang.
                        </Link>
                    </p>
                }
            />

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (message.includes("Email belum terverifikasi"))
                                navigate("/auth/verify-otp", { state: { email, type: "email_verification" } });
                            setShowAlert(false);
                        }}
                        message={message}
                    />
                )}
            </AnimatePresence>

            {/* Loading */}
            {isLoading && <Loading />}
        </AuthTemplate>
    );
}
export default Login;
