// Product comes from DummyJSON API → keep id as number
export type Product = {
    id: number;   // keep number, matches API
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

// CartItem → store productId as number (since product.id is number)
export type CartItem = {
    id: number;
    title: string;
    price: number;
    image?: string;
    qty: number;
};

// OrderItem → productId stays number, because it refers to Product
export type OrderItem = {
    productId: number;
    title: string;
    price: number;
    image?: string;
    qty: number;
    lineTotal: number;
};

// Order itself → MongoDB _id is a string
export type Order = {
    _id?: string;   // MongoDB id
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
