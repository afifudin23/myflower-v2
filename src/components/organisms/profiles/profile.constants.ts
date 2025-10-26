import { CUSTOMER_CATEGORY_ITEMS, CUSTOMER_CATEGORY_LABELS } from "@/constants/category";

export const PROFILE_FORM_ITEMS = [
    {
        label: "Nama Lengkap",
        type: "text",
        name: "fullName",
    },
    {
        label: "Username",
        type: "text",
        name: "username",
    },
    {
        label: "Email",
        type: "email",
        name: "email",
    },
    {
        label: "Nomor Telepon",
        type: "text",
        name: "phoneNumber",
    },
    {
        name: "customerCategory",
        type: "dropdown",
        label: "Kategori Pelanggan",
        options: CUSTOMER_CATEGORY_ITEMS,
        optionLabel: CUSTOMER_CATEGORY_LABELS,
    },
    {
        label: "Password Lama",
        type: "password",
        name: "oldPassword",
    },
    {
        label: "Password Baru",
        type: "password",
        name: "newPassword",
    },
    {
        label: "Konfirmasi Password",
        type: "password",
        name: "confPassword",
    },
];
