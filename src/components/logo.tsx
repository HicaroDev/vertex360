import Image from "next/image";
import Link from "next/link";

interface LogoProps {
    className?: string;
    variant?: "full" | "icon";
}

export function Logo({ className = "", variant = "full" }: LogoProps) {
    return (
        <Link href="/" className={`inline-block ${className}`}>
            <div className="relative flex items-center gap-3">
                {/* Usando a imagem da logo fornecida pelo usuário */}
                <div className="relative w-12 h-12 overflow-hidden bg-white">
                    <Image
                        src="/logo.jpeg"
                        alt="R&V Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                {variant === "full" && (
                    <div className="flex flex-col leading-none">
                        <span className="text-xl font-bold tracking-tight text-brand-slate uppercase">
                            R&V
                        </span>
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-brand-gold uppercase">
                            Consultores Associados
                        </span>
                    </div>
                )}
            </div>
        </Link>
    );
}
