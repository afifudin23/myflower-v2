import { z, type TypeOf } from "zod";

export const create = z
    .object({
        deliveryOption: z.enum(["DELIVERY", "SELF_PICKUP"], {
            message: "Harap pilih metode pengiriman terlebih dahulu.",
        }),
        deliveryAddress: z.string().nullish(),
        readyDate: z.date({
            required_error: "Harap isi tanggal produk jadi terlebih dahulu.",
            invalid_type_error: "Tanggal tidak valid.",
        }),
        paymentMethod: z.enum(["COD", "OTHERS"], {
            required_error: "Harap pilih metode pembayaran terlebih dahulu.",
        }),
        items: z.array(
            z.object({
                productId: z.string(),
                quantity: z.number(),
                message: z.string().nullish(),
            })
        ),
    })
    .superRefine((data, ctx) => {
        // If delivery option is "Pickup", set delivery address, date, and shipping cost to null
        if (data.deliveryOption === "SELF_PICKUP") {
            data.deliveryAddress = null;
        }

        if (data.deliveryOption === "DELIVERY") {
            if (!data.deliveryAddress) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["deliveryAddress"],
                    message: "Alamat Pengiriman Harus Diisi Untuk Pengiriman",
                });
            }
        }
    });

export type CreateType = TypeOf<typeof create>;
