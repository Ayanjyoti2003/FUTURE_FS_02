export type Product = {
    id: number;
    title: string;
    description: string;
    price: number;
    brand?: string;
    category?: string;
    thumbnail?: string;
    images?: string[];
    rating?: number;
    stock?: number;
};

export type CartItem = {
    id: number;
    title: string;
    price: number;
    image?: string;
    qty: number;
};

export type OrderItem = {
    productId: number;
    title: string;
    price: number;
    image?: string;
    qty: number;
    lineTotal: number;
};

export type Order = {
    _id?: string;
    userUid: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    total: number;
    status: "PAID" | "PENDING" | "CANCELLED";
    shippingInfo: {
        fullName: string;
        address1: string;
        city: string;
        country: string;
        zip: string;
        phone?: string;
    };
    createdAt?: string;
};
