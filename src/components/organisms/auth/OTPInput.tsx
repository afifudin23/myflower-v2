import { useRef, useState, useEffect } from "react";

interface OTPInputProps {
    length: number;
    onComplete: (otp: string) => void;
    onResend?: () => void; // biar parent bisa handle request resend OTP
}

function OTPInput({ length, onComplete, onResend }: OTPInputProps) {
    const [otp, setOtp] = useState(Array(length).fill(""));
    const inputRef = useRef<HTMLInputElement[]>([]);

    const [timer, setTimer] = useState(0);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer((t) => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleChange = (value: string, index: number) => {
        if (/^[0-9]?$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < length - 1) {
                inputRef.current[index + 1]?.focus();
                inputRef.current[index + 1]?.select();
            }

            if (newOtp.every((digit) => digit)) {
                onComplete(newOtp.join(""));
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRef.current[index - 1]?.focus();
            inputRef.current[index - 1]?.select();
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRef.current[index - 1]?.focus();
            inputRef.current[index - 1]?.select();
            e.preventDefault();
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRef.current[index + 1]?.focus();
            inputRef.current[index + 1]?.select();
            e.preventDefault();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("Text").replace(/\D/g, "");
        if (!pasteData) return;

        const newOtp = [...otp];
        for (let i = 0; i < length; i++) {
            newOtp[i] = pasteData[i] || "";
        }
        setOtp(newOtp);

        if (newOtp.every((digit) => digit)) {
            onComplete(newOtp.join(""));
        }

        const lastIndex = Math.min(pasteData.length, length) - 1;
        if (lastIndex >= 0) {
            inputRef.current[lastIndex]?.focus();
            inputRef.current[lastIndex]?.select();
        }
    };

    const handleResend = () => {
        if (timer === 0) {
            setTimer(60); // reset countdown 60  detik
            setOtp(Array(length).fill("")); // kosongkan input OTP
            if (onResend) onResend();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        type="text"
                        maxLength={1}
                        ref={(el) => {
                            inputRef.current[index] = el!;
                        }}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        onFocus={(e) => e.target.select()}
                        className="w-10 h-10 border rounded text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                ))}
            </div>

            <button
                onClick={() => handleResend()}
                disabled={timer > 0}
                className={`py-2  ${timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-500 hover:underline"}`}
            >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
        </div>
    );
}

export default OTPInput;
