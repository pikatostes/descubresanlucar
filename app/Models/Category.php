<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['slug', 'label', 'icon'];

    public function places()
    {
        return $this->hasMany(Places::class);
    }
}