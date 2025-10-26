// Customer Category
export const CUSTOMER_CATEGORY_ITEMS = ["UMUM", "PEMDA", "PERBANKAN"];
export const CUSTOMER_CATEGORY_LABELS: any = { UMUM: "Umum", PEMDA: "Pemda", PERBANKAN: "Perbankan" };

// Delivery Option
export const DELIVERY_OPTION_ITEMS = ["SELF_PICKUP", "DELIVERY"];
export const DELIVERY_OPTION_LABELS: any = {
    SELF_PICKUP: "Ambil di Tempat",
    DELIVERY: "Kirim ke Alamat",
};

// Payment Method
export const PAYMENT_METHOD_ITEMS = ["COD", "OTHERS"];
export const PAYMENT_METHOD_LABELS: any = {
    ALL: "Semua",
    COD: "COD (Cash On Delivery)",
    OTHERS: "Lainnya (Transfer Bank)",
    BANK_TRANSFER: "TRANSFER BANK",
    CASH: "TUNAI",
    CREDIT_CARD: "KARTU KREDIT",
    QRIS: "QRIS",
    EWALLET: "E-WALLET",
    CSTORE: "CSTORE",
};

// Payment Status
export const PAYMENT_STATUS_LABELS: any = {
    ALL: "Semua",
    PAID: "Lunas",
    PENDING: "Menunggu",
    UNPAID: "Belum Lunas",
    EXPIRED: "Expired",
    REFUNDED: "Refund",
    DENIED: "Ditolak",
};

// Order Status
export const ORDER_STATUS_LABELS: any = {
    ALL: "Semua",
    IN_PROCESS: "Diproses",
    DELIVERY: "Dalam Pengiriman",
    CANCELED: "Dibatalkan",
    COMPLETED: "Selesai",
};
