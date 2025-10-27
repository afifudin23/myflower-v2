import { Loading } from "@/components/atoms";
import { AlertInfo } from "@/components/molecules";
import { RESET_PASSWORD_FIELDS } from "@/components/organisms/auth/auth.constants";
import AuthForm from "@/components/organisms/auth/AuthForm";
import AuthTemplate from "@/components/templates/AuthTemplate";
import { authSchema } from "@/schemas";
import { axiosInstance } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

function ResetPasswordPage() {
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const state = useLocation().state as { token: string } | null;
    const token = state?.token;
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<authSchema.ResetPasswordType>({
        resolver: zodResolver(authSchema.resetPassword),
    });

    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await axiosInstance.patch("/auth/reset-password", data, { headers: { Authorization: `Bearer ${token}` } });
            setMessage("Reset berhasil! Sekarang kamu bisa masuk dengan kata sandi baru");
            setShowAlert(true);
        } catch (error: any) {
            const axiosError = error as AxiosError;
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
        <AuthTemplate description="Reset Password, Silakan atur password kamu di bawah ini">
            <AuthForm
                fields={RESET_PASSWORD_FIELDS}
                register={register}
                onSubmit={onSubmit}
                errors={errors}
                buttonName="Update Password"
            />

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (message.includes("Reset berhasil! Sekarang kamu bisa masuk dengan kata sandi baru"))
                                navigate("/auth/login");
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

export default ResetPasswordPage;
