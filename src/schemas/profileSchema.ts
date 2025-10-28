import { z, type TypeOf } from "zod";

export const profile = z
    .object({
        fullName: z.string({ required_error: "Nama Harus Diisi" }).nonempty({ message: "Nama Harus Diisi" }),
        username: z
            .string()
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
        oldPassword: z.string().min(6, "Password lama minimal 6 karakter").optional().or(z.literal("")),
        newPassword: z.string().min(6, "Password baru minimal 6 karakter").optional().or(z.literal("")),
        confPassword: z.string().min(6, "Konfirmasi password minimal 6 karakter").optional().or(z.literal("")),
    })
    .superRefine((data, ctx) => {
        const oneFilled = !!(data.oldPassword || data.newPassword || data.confPassword);
        const allFilled = !!(data.oldPassword && data.newPassword && data.confPassword);

        if (oneFilled && !allFilled) {
            if (!data.oldPassword) {
                ctx.addIssue({
                    path: ["oldPassword"],
                    message: "Password lama tidak boleh kosong jika ingin mengganti password",
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.newPassword) {
                ctx.addIssue({
                    path: ["newPassword"],
                    message: "Password baru tidak boleh kosong jika ingin mengganti password",
                    code: z.ZodIssueCode.custom,
                });
            }
            if (!data.confPassword) {
                ctx.addIssue({
                    path: ["confPassword"],
                    message: "Konfirmasi password tidak boleh kosong jika ingin mengganti password",
                    code: z.ZodIssueCode.custom,
                });
            }
        }

        if (data.newPassword && data.confPassword && data.newPassword !== data.confPassword) {
            ctx.addIssue({
                path: ["confPassword"],
                message: "Konfirmasi password harus sama dengan password baru",
                code: z.ZodIssueCode.custom,
            });
        }
    });
export type ProfileType = TypeOf<typeof profile>;
