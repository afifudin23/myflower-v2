import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthTemplate from "@/components/templates/AuthTemplate";
import { TEXT_COLORS } from "@/constants/colors";
import AuthForm from "@/components/organisms/auth/AuthForm";
import { REGISTER_FIELDS } from "@/components/organisms/auth/auth.constants";
import { axiosInstance } from "@/utils";
import { authSchema } from "@/schemas";
import { AnimatePresence } from "framer-motion";
import { AlertInfo } from "@/components/molecules";
import { Loading } from "@/components/atoms";

function Register() {
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<authSchema.RegisterType>({ resolver: zodResolver(authSchema.register) });
    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            await axiosInstance.post("auth/register", data);
            setMessage("Pendaftaran berhasil! OTP verifikasi akun telah dikirim ke email kamu.");
            setShowAlert(true);
            setEmail(data.email);
        } catch (error: any) {
            const axiosError = error as AxiosError;
            if (axiosError.code === "ERR_NETWORK")
                setMessage("Tidak Dapat Terhubung Ke Server. Periksa Koneksi Internet Anda");
            if (axiosError.response) setMessage("Gagal Daftar Akun. Silahkan Periksa Kembali");
        } finally {
            setIsLoading(false);
        }
    });
    return (
        <AuthTemplate description="Daftar Akun, untuk memulai berbelanja di MyFlower">
            <AuthForm
                fields={REGISTER_FIELDS}
                onSubmit={onSubmit}
                register={register}
                errors={errors}
                buttonName="Daftar"
                link={
                    <p className="text-center">
                        Sudah terdaftar?{" "}
                        <Link to="/auth/login" className={`font-bold hover:underline ${TEXT_COLORS.primary}`}>
                            Masuk ke akun Anda.
                        </Link>
                    </p>
                }
            />

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (message.includes("Pendaftaran berhasil!"))
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

export default Register;
