import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Index({ auth, bankData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
        account_holder: '',
        iban: '',
        bic_swift: '',
        bank_name: '',
        is_default: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(`/bank-data/${editingId}`, {
                onSuccess: () => {
                    setIsEditing(false);
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post('/bank-data', {
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    const handleEdit = (item) => {
        setData({
            account_holder: item.account_holder,
            iban: item.iban,
            bic_swift: item.bic_swift,
            bank_name: item.bank_name || '',
            is_default: item.is_default,
        });
        setEditingId(item.id);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar estos datos bancarios?')) {
            destroy(`/bank-data/${id}`);
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Datos de Pago</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Introduce tus datos bancarios para el cobro del anuncio de tu negocio.
                    </p>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div>
                            <InputLabel htmlFor="account_holder" value="Titular de la cuenta" />
                            <TextInput
                                id="account_holder"
                                name="account_holder"
                                value={data.account_holder}
                                onChange={(e) => setData('account_holder', e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                            <InputError message={errors.account_holder} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="iban" value="IBAN" />
                            <TextInput
                                id="iban"
                                name="iban"
                                value={data.iban}
                                onChange={(e) => setData('iban', e.target.value.toUpperCase())}
                                className="mt-1 block w-full"
                                placeholder="ES12 3456 7890 1234 5678 9012"
                                required
                            />
                            <InputError message={errors.iban} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="bic_swift" value="BIC/SWIFT" />
                            <TextInput
                                id="bic_swift"
                                name="bic_swift"
                                value={data.bic_swift}
                                onChange={(e) => setData('bic_swift', e.target.value.toUpperCase())}
                                className="mt-1 block w-full"
                                placeholder="ABCDESMMXXX"
                                required
                            />
                            <InputError message={errors.bic_swift} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="bank_name" value="Nombre del banco (opcional)" />
                            <TextInput
                                id="bank_name"
                                name="bank_name"
                                value={data.bank_name}
                                onChange={(e) => setData('bank_name', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.bank_name} className="mt-2" />
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="is_default"
                                checked={data.is_default}
                                onChange={(e) => setData('is_default', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                            />
                            <label htmlFor="is_default" className="ml-2 text-sm text-gray-600">
                                Establecer como cuenta principal
                            </label>
                        </div>

                        <div className="flex gap-4">
                            <PrimaryButton type="submit">
                                {editingId ? 'Actualizar' : 'Guardar'}
                            </PrimaryButton>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {bankData && bankData.length > 0 && (
                    <div className="mt-8 bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4">Métodos de pago guardados</h2>
                            <div className="space-y-4">
                                {bankData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">{item.account_holder}</p>
                                            <p className="text-sm text-gray-500">•••• {item.iban.slice(-4)}</p>
                                            {item.is_default && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                                                    Principal
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-indigo-600 hover:text-indigo-900 text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-600 hover:text-red-900 text-sm"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}