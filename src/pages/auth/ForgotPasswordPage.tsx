import { Loading } from "@/components/atoms";
import { AlertInfo } from "@/components/molecules";
import { FORGOT_PASSWORD_FIELDS } from "@/components/organisms/auth/auth.constants";
import AuthForm from "@/components/organisms/auth/AuthForm";
import AuthTemplate from "@/components/templates/AuthTemplate";
import { TEXT_COLORS } from "@/constants/colors";
import { authSchema } from "@/schemas";
import { axiosInstance } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
    const [message, setMessage] = useState("");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<authSchema.ForgotPasswordType>({ resolver: zodResolver(authSchema.forgotPassword) });
    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await axiosInstance.post("/auth/otp/resend", { email: data.email, type: "password_reset" });
            setEmail(data.email);
            setShowAlert(true);
            setMessage("OTP reset password telah dikirim, silahkan cek email!");
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
        <AuthTemplate description="Masukkan email kamu untuk mengatur ulang kata sandi">
            <AuthForm
                fields={FORGOT_PASSWORD_FIELDS}
                register={register}
                onSubmit={onSubmit}
                errors={errors}
                buttonName="Kirim"
                link={
                    <p className="text-center">
                        Sudah ingat kata sandi?{" "}
                        <Link to="/auth/login" className={`font-bold hover:underline ${TEXT_COLORS.primary}`}>
                            Masuk sekarang.
                        </Link>
                    </p>
                }
            />
            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (message.includes("OTP reset password telah dikirim, silahkan cek email!"))
                                navigate("/auth/verify-otp", { state: { email, type: "password_reset" } });
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

export default ForgotPasswordPage;
