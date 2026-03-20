import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showPasswordRequirements, setShowPasswordRequirements] =
        useState(false);
    const [passwordValidationError, setPasswordValidationError] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const passwordRules = {
        minLength: data.password.length >= 8,
        hasUppercase: /[A-Z]/.test(data.password),
        hasNumber: /\d/.test(data.password),
        hasSymbol: /[^A-Za-z0-9]/.test(data.password),
    };

    const isPasswordValid = Object.values(passwordRules).every(Boolean);

    const submit = (e) => {
        e.preventDefault();

        if (!isPasswordValid) {
            setPasswordValidationError(
                'La contraseña debe tener mínimo 8 caracteres, una mayúscula, un número y un símbolo.',
            );
            return;
        }

        setPasswordValidationError('');

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="mt-1 block w-full"
                            autoComplete="name"
                            isFocused
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />

                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mt-4">
                        <InputLabel htmlFor="email" value="Email" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* PASSWORD */}
                    <div className="mt-4">
                        <InputLabel htmlFor="password" value="Password" />

                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full pr-20"
                                autoComplete="new-password"
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setData('password', value);

                                    if (
                                        value.length >= 8 &&
                                        /[A-Z]/.test(value) &&
                                        /\d/.test(value) &&
                                        /[^A-Za-z0-9]/.test(value)
                                    ) {
                                        setPasswordValidationError('');
                                    }
                                }}
                                required
                            />

                            <TogglePasswordButton
                                visible={showPassword}
                                onClick={() => setShowPassword(!showPassword)}
                            />

                            <PasswordRequirementsButton
                                active={showPasswordRequirements}
                                isValid={isPasswordValid}
                                onClick={() =>
                                    setShowPasswordRequirements(
                                        !showPasswordRequirements,
                                    )
                                }
                            />

                            {showPasswordRequirements && (
                                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-3 shadow-xl">
                                    <p className="text-sm font-semibold text-gray-900">
                                        Requisitos de contraseña
                                    </p>
                                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                        <PasswordRuleItem
                                            valid={passwordRules.minLength}
                                            text="Mínimo 8 caracteres"
                                        />
                                        <PasswordRuleItem
                                            valid={passwordRules.hasUppercase}
                                            text="Al menos una mayúscula"
                                        />
                                        <PasswordRuleItem
                                            valid={passwordRules.hasNumber}
                                            text="Al menos un número"
                                        />
                                        <PasswordRuleItem
                                            valid={passwordRules.hasSymbol}
                                            text="Al menos un símbolo"
                                        />
                                    </ul>
                                </div>
                            )}
                        </div>

                        <InputError message={errors.password} className="mt-2" />
                        <InputError
                            message={passwordValidationError}
                            className="mt-2"
                        />
                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="mt-4">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full pr-10"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                            />

                            <TogglePasswordButton
                                visible={showConfirmPassword}
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            />
                        </div>

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex items-center justify-end">
                        <Link
                            href={route('login')}
                            className="text-sm text-gray-600 underline hover:text-gray-900"
                        >
                            Already registered?
                        </Link>

                        <PrimaryButton
                            className="ms-4"
                            disabled={processing || !isPasswordValid}
                        >
                            Register
                        </PrimaryButton>
                    </div>
                </form>
        </GuestLayout>
    );
}

function PasswordRuleItem({ valid, text }) {
    return (
        <li className={valid ? 'text-green-600' : 'text-gray-600'}>
            {valid ? '✓' : '•'} {text}
        </li>
    );
}

function PasswordRequirementsButton({ active, isValid, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`absolute inset-y-0 right-10 flex items-center pr-1 ${
                isValid
                    ? 'text-green-600'
                    : active
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
            }`}
            title="Ver requisitos de contraseña"
            aria-label="Ver requisitos de contraseña"
        >
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-xs font-bold">
                {isValid ? '✓' : '!'}
            </span>
        </button>
    );
}

/* ---------- COMPONENTE BOTÓN MOSTRAR CONTRASEÑA ---------- */

function TogglePasswordButton({ visible, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
        >
            {visible ? (
                <EyeOffIcon />
            ) : (
                <EyeIcon />
            )}
        </button>
    );
}

function EyeIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
        </svg>
    );
}

function EyeOffIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498M6.228 6.228 3 3m3.228 3.228 12.544 12.544M21 21"
            />
        </svg>
    );
}
