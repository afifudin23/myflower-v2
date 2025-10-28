import { Loading } from "@/components/atoms";
import BackButton from "@/components/atoms/BackButton";
import Button from "@/components/atoms/Button";
import SectionTitle from "@/components/atoms/SectionTitle";
import { AlertInfo } from "@/components/molecules";
import ProfileForm from "@/components/organisms/profiles/ProfileForm";
import MainLayout from "@/components/templates/MainLayout";
import { BG_COLORS } from "@/constants/colors";
import { profileSchema } from "@/schemas";
import useAuthStore from "@/stores/useAuthStore";
import { axiosInstance } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() => {});
    const {
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<profileSchema.ProfileType>({
        resolver: zodResolver(profileSchema.profile),
        defaultValues: {
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            customerCategory: user.customerCategory,
            oldPassword: "",
            newPassword: "",
            confPassword: "",
        },
    });
    console.log(watch("customerCategory"));
    const onSubmit = handleSubmit(async (data) => {
        setIsLoading(true);
        try {
            console.log(data);
            await axiosInstance.patch("users/profile", data);
            await useAuthStore.getState().getMe();
            setMessage("Profil berhasil diubah.");
        } catch (error: any) {
            console.log(error.response.data);
            const axiosError = error as AxiosError;
            if (axiosError.code === "ERR_NETWORK") {
                setMessage("Tidak Dapat Terhubung Ke Server. Periksa Koneksi Internet Anda");
            } else if (error.response.data.errorCode === 1003) {
                setMessage("Password Lama Salah.");
            }
        } finally {
            setShowAlert(true);
            setIsLoading(false);
        }
    });

    const handleLogout = async () => {
        await useAuthStore.getState().logout();
    };
    return (
        <MainLayout className="w-full max-w-3xl">
            <div className="space-y-6">
                <BackButton onClick={() => navigate("/products")}>Kembali ke Produk</BackButton>
                <SectionTitle className="text-3xl font-bold md:text-4xl">Profile Saya</SectionTitle>
                <form className="space-y-7 w-full" onSubmit={onSubmit}>
                    <ProfileForm control={control} errors={errors} />
                    <div className="flex flex-col lg:flex-row gap-5">
                        <Button
                            type="submit"
                            className={`sm:w-[15rem] w-full p-2 rounded-md text-white ${BG_COLORS.primary}`}
                        >
                            Edit Profile
                        </Button>
                        <Button
                            type="button"
                            className={`sm:w-[15rem] w-full p-2 rounded-md text-white ${BG_COLORS.primary}`}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </div>
                </form>
            </div>

            {/* Custom Alert */}
            <AnimatePresence>
                {showAlert && (
                    <AlertInfo
                        handleAlert={() => {
                            if (message === "Profil berhasil diubah.") navigate("/products");
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

export default ProfilePage;
