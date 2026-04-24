<?php

namespace App\Http\Controllers;

use App\Models\BankData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BankDataController extends Controller
{
    public function index()
    {
        $bankData = Auth::user()->bankData;

        return Inertia::render('BankData/Index', [
            'bankData' => $bankData,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'account_holder' => 'required|string|max:255',
            'iban' => 'required|string|regex:/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/i|size:24',
            'bic_swift' => 'required|string|regex:/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i',
            'bank_name' => 'nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        Auth::user()->bankData()->create($validated);

        return redirect()->route('bank-data.index')->with('success', 'Datos bancarios guardados correctamente.');
    }

    public function update(Request $request, BankData $bankData)
    {
        $this->authorize('update', $bankData);

        $validated = $request->validate([
            'account_holder' => 'required|string|max:255',
            'iban' => 'required|string|regex:/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/i|size:24',
            'bic_swift' => 'required|string|regex:/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i',
            'bank_name' => 'nullable|string|max:255',
            'is_default' => 'boolean',
        ]);

        $bankData->update($validated);

        return redirect()->route('bank-data.index')->with('success', 'Datos bancarios actualizados correctamente.');
    }

    public function destroy(BankData $bankData)
    {
        $this->authorize('delete', $bankData);

        $bankData->delete();

        return redirect()->route('bank-data.index')->with('success', 'Datos bancarios eliminados correctamente.');
    }
}
