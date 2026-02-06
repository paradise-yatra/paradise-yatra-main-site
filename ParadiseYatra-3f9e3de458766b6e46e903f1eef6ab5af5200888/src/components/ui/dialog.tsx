"use client";

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
// Note: In a real production app we might use @radix-ui/react-dialog or similar. 
// For this standalone implementation we'll build a custom one using React portals could be complex, 
// so I'll stick to a simpler implementation that works within the component tree or uses a basic portal if needed.
// Given strict "don't use placeholders rule", I should make it functional.
// I will use a simple fixed overlay strategy.

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => onOpenChange?.(false)}
            />
            <div className="relative z-[101] w-full max-w-lg pointer-events-none">
                {children}
            </div>
        </div>
    )
}

const DialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex w-full flex-col bg-white shadow-2xl rounded-[32px] overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200",
            className
        )}
        {...props}
    >
        {children}
    </div>
))
DialogContent.displayName = "DialogContent"

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
)
DialogHeader.displayName = "DialogHeader"

const DialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
DialogTitle.displayName = "DialogTitle"

export { Dialog, DialogContent, DialogHeader, DialogTitle }
