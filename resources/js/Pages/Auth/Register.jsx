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
            <Head title="Crear cuenta" />

            <div className="auth-header">
                <h1 className="auth-title">Crear cuenta</h1>
                <p className="auth-subtitle">Únete a DescubreSanlúcar y descubre los mejores lugares</p>
            </div>

            <div className="social-login">
                <a href={route('google.redirect')} className="social-button google-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20" height="20">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.966,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.084,4.166-3.946,5.136l6.474,5.317C42.146,36.096,43.611,28.311,43.611,20.083z"/>
                    </svg>
                    <span>Registrarse con Google</span>
                </a>
            </div>

            <div className="divider">
                <span>o</span>
            </div>

            <form onSubmit={submit} className="auth-form">
                <div className="form-group">
                    <InputLabel htmlFor="name" value="Nombre" />

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

                <div className="form-group">
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

                <div className="form-group">
                    <InputLabel htmlFor="password" value="Contraseña" />

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
                            <div className="password-requirements">
                                <p className="requirements-title">
                                    Requisitos de contraseña
                                </p>
                                <ul className="requirements-list">
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

                <div className="form-group">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contraseña"
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

                <div className="form-actions">
                    <PrimaryButton
                        className="auth-button"
                        disabled={processing || !isPasswordValid}
                    >
                        Crear cuenta
                    </PrimaryButton>
                </div>
                
                <div className="auth-footer-link">
                    <span>¿Ya tienes cuenta? </span>
                    <Link href={route('login')} className="register-link">
                        Inicia sesión aquí
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}

function PasswordRuleItem({ valid, text }) {
    return (
        <li className={valid ? 'valid' : ''}>
            {text}
        </li>
    );
}

function PasswordRequirementsButton({ active, isValid, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`password-requirements-button ${isValid ? 'valid' : ''}`}
            title="Ver requisitos de contraseña"
            aria-label="Ver requisitos de contraseña"
        >
            <span>
                {isValid ? '✓' : '!'}
            </span>
        </button>
    );
}

function TogglePasswordButton({ visible, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="password-toggle"
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
