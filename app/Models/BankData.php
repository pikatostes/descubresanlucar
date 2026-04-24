<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BankData extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'account_holder',
        'iban',
        'bic_swift',
        'bank_name',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'iban' => 'encrypted',
            'bic_swift' => 'encrypted',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    protected static function booted(): void
    {
        static::creating(function ($bankData) {
            if ($bankData->is_default) {
                static::where('user_id', $bankData->user_id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }
        });

        static::updating(function ($bankData) {
            if ($bankData->is_default) {
                static::where('user_id', $bankData->user_id)
                    ->where('id', '!=', $bankData->id)
                    ->where('is_default', true)
                    ->update(['is_default' => false]);
            }
        });
    }
}