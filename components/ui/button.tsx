import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const variants = {
            primary: 'btn-primary',
            secondary: 'btn-secondary',
            ghost: 'btn-ghost',
            danger: 'btn-danger',
            outline:
                'inline-flex items-center justify-center border-2 border-primary-500 text-primary-600 font-semibold rounded-xl hover:bg-primary-50 active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-5 py-2.5 text-base',
            lg: 'px-8 py-4 text-lg',
        };

        return (
            <button
                className={cn(
                    variants[variant],
                    sizes[size],
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                    </>
                ) : (
                    <>
                        {leftIcon && <span className="mr-2">{leftIcon}</span>}
                        {children}
                        {rightIcon && <span className="ml-2">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
