import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helper, leftIcon, rightIcon, type, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={inputId} className="input-label">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            'input-field',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            error && 'input-error',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && <p className="input-error-text">{error}</p>}
                {helper && !error && <p className="input-helper">{helper}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

// Textarea component
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helper?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, helper, id, ...props }, ref) => {
        const textareaId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={textareaId} className="input-label">
                        {label}
                    </label>
                )}
                <textarea
                    id={textareaId}
                    className={cn(
                        'input-field min-h-[100px] resize-y',
                        error && 'input-error',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="input-error-text">{error}</p>}
                {helper && !error && <p className="input-helper">{helper}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

// Select component
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helper?: string;
    options: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, helper, options, id, ...props }, ref) => {
        const selectId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <label htmlFor={selectId} className="input-label">
                        {label}
                    </label>
                )}
                <select
                    id={selectId}
                    className={cn(
                        'input-field appearance-none cursor-pointer',
                        error && 'input-error',
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && <p className="input-error-text">{error}</p>}
                {helper && !error && <p className="input-helper">{helper}</p>}
            </div>
        );
    }
);

Select.displayName = 'Select';

export { Input, Textarea, Select };
