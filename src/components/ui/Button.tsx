import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary";
    children: ReactNode;
}

export default function Button({ variant = "primary", children, ...props }: ButtonProps) {
    const base = "px-4 py-2 rounded font-medium transition-colors duration-200";
    const styles = variant === "primary"
        ? "bg-brand text-white hover:bg-brand-dark"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300";

    return (
        <button className={`${base} ${styles}`} {...props}>
            {children}
        </button>
    );
}

