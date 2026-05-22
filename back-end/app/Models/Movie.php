<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; 

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'overview',
        'poster_path',
        'release_date',
        'user_id',
    ]; 

    public function genres(): BelongsToMany
    {
        return $this->belongsToMany(Genre::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}