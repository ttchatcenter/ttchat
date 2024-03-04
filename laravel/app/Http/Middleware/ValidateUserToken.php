<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Carbon\Carbon;

class ValidateUserToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $token= request()->bearerToken();
        $user = auth()->user();
        $decoded_token = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

        if ($user->token_uid !== $decoded_token->token_uid) {
            abort(403, 'Access denied');
        }
        if ($user) {
            $current = Carbon::now();
            $user->last_active = $current;
            $user->save();
        }
        return $next($request);
    }
}
