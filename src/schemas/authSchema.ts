import { z, type TypeOf } from "zod";

export const login = z.object({
    username: z
        .string()
        .nonempty("Username wajib diisi")
        .min(3, "Username minimal 3 karakter")
        .max(10, "Username maksimal 10 karakter"),
    password: z.string().nonempty("Password wajib diisi").min(6, "Password minimal 6 karakter"),
});

export type LoginType = TypeOf<typeof login>;

export const register = z
    .object({
        fullName: z.string({ required_error: "Nama Harus Diisi" }).nonempty({ message: "Nama Harus Diisi" }),
        username: z
            .string({ required_error: "Username Harus Diisi" })
            .nonempty({ message: "Username Harus Diisi" })
            .min(3, "Username minimal 3 karakter")
            .max(10, "Username maksimal 10 karakter"),
        email: z
            .string({ required_error: "Email Harus Diisi" })
            .nonempty({ message: "Email Harus Diisi" })
            .email({ message: "Email Tidak Valid" }),
        phoneNumber: z
            .string({ required_error: "Nomor Telepon Harus Diisi" })
            .nonempty({ message: "Nomor Telepon Harus Diisi" }),
        customerCategory: z.enum(["UMUM", "PEMDA", "PERBANKAN"], {
            message: "Kategori Pelanggan Harus Diisi",
        }),
        password: z
            .string({ required_error: "Password Harus Diisi" })
            .nonempty({ message: "Password Harus Diisi" })
            .min(6, "Password minimal 6 karakter"),
        confPassword: z
            .string({ required_error: "Konfirmasi Password Harus Diisi" })
            .nonempty({ message: "Konfirmasi Password Harus Diisi" })
            .min(6, "Konfirmasi Password minimal 6 karakter"),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confPassword) {
            ctx.addIssue({
                path: ["confPassword"],
                code: z.ZodIssueCode.custom,
                message: "Konfirmasi Password Tidak Sesuai",
            });
        }
    });

export type RegisterType = TypeOf<typeof register>;

export const forgotPassword = z.object({
    email: z
        .string({ required_error: "Email Harus Diisi" })
        .nonempty({ message: "Email Harus Diisi" })
        .email({ message: "Email Tidak Valid" }),
});

export type ForgotPasswordType = TypeOf<typeof forgotPassword>;

export const resetPassword = z
    .object({
        password: z
            .string({ required_error: "Password Harus Diisi" })
            .nonempty({ message: "Password Harus Diisi" })
            .min(6, "Password minimal 6 karakter"),
        confPassword: z
            .string({ required_error: "Konfirmasi Password Harus Diisi" })
            .nonempty({ message: "Konfirmasi Password Harus Diisi" })
            .min(6, "Konfirmasi Password minimal 6 karakter"),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confPassword) {
            ctx.addIssue({
                path: ["confPassword"],
                code: z.ZodIssueCode.custom,
                message: "Konfirmasi Password Tidak Sesuai",
            });
        }
    });

export type ResetPasswordType = TypeOf<typeof resetPassword>;
