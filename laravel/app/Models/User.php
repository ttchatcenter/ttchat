<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Carbon\Carbon;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, SoftDeletes;

    // Rest omitted for brevity
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'id' => $this->attributes['id'],
            'username' => $this->attributes['username'],
            'token_uid' => $this->gen_uuid(),
        ];
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'username',
        'firstname',
        'lastname',
        'email',
        'password',
        'status',
        'role',
        'badge_status',
        'is_reset_password',
        'changed_password_at',
    ];

    // use HasApiTokens, HasFactory, Notifiable;

    // /**
    //  * The attributes that should be hidden for serialization.
    //  *
    //  * @var array<int, string>
    //  */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = ['should_change_password'];

    public function getShouldChangePasswordAttribute() {
        $password_expired_duration = env('PASSWORD_EXPIRED_DURATION', 90);
        
        return Carbon::parse($this->changed_password_at)
            ->addDay($password_expired_duration)
            ->lessThan(Carbon::now());
    }

    public function gen_uuid()
    {
        return sprintf( '%04x%04x%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000
        );
    }

    public function brands() 
    {
        return $this->hasMany(BrandMember::class, 'user_id',);
    }
}