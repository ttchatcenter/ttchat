<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Controller;
use Validator;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;
use Mail;
use Illuminate\Support\Str;
use App\Models\PasswordReset;
use App\Models\UserStatusLog;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use DB;
use Log;

class AuthController extends Controller
{
    private $ttl = (24 * 60);
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'forgotPassword', 'resetPassword', 'verifyAccount', 'refresh']]);
        $this->middleware('update.user', ['except' => ['login', 'register', 'forgotPassword', 'resetPassword', 'verifyAccount', 'refresh']]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|unique:users,employee_id',
            'username' => 'required|unique:users,username',
            'firstname' => 'required',
            'lastname' => 'required',
            'email' => 'required',
            'password' => 'required',
            'status' => 'required|in:active,inactive',
            'role' => 'in:super_admin,supervisor,admin',
        ]);

        $amount = User::count();
        if ($amount >= env('USER_ACCOUNT_LIMIT', 999)) {
            return response()->json(['errors' => ['Exceeded the maximum number of user accounts']], 400);
        }
        $user = User::create([
            'employee_id' => $request->employee_id,
            'username' => $request->username,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'status' => $request->status,
            'role' => $request->role ?? 'admin',
            'badge_status' => 'idle',
            'changed_password_at' => Carbon::now(),
            'is_reset_password' => true,
        ]);

        return response()->json(['title' => 'Success', 'msg' => 'You have Successfully register'], 200);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make(
            $request->all(),
            [
                'username' => 'required',
                'password' => 'required',
            ]
        );

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $this->guard()->factory()->setTTL($this->ttl);

        $credentials = ['username' => $request->input('username'), 'password' => $request->input('password')];

        if (!$token = $this->guard()->attempt($credentials)) {
            return response()->json(['error' => 'Username or password invalid'], 401);
        }

        $response = $this->respondWithToken($token);

        $user = auth()->user();

        if ($user->status === 'inactive') {
            return response()->json(['error' => 'User status is inactive'], 400);
        }
        if ($user->token_uid) {
            return response()->json(['error' => 'This account is already logged in on another device. You must log out of other browsers before being able to log in'], 400);
        }

        $decoded_token = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

        $current = Carbon::now();

        $user->token_uid = $decoded_token->token_uid;
        $user->last_active = $current;
        $user->badge_status = 'available';

        $user->save();

        $log = UserStatusLog::where('user_id', $user->id)->whereNull('ended_at')->first();

        if ($log) {
            $log->ended_at = $current;
            $log->save();
        }   

        UserStatusLog::create([
            'user_id' => $user->id,
            'status' => 'available',
            'started_at' => $current,
        ]);

        return $response;
    }


    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function user()
    {
        $user = auth()->user();
        return response()->json($user);
    }

    public function deleteUser()
    {
        $user = auth()->user();
        $user->delete();
        return response()->json(['msg' => 'User Deleted']);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $user = auth()->user();
        $user->token_uid = null;
        $user->last_active = null;
        $user->badge_status = 'idle';
        $user->save();

        $current = Carbon::now();
        $log = UserStatusLog::where('user_id', $user->id)->whereNull('ended_at')->first();

        if ($log) {
            $log->ended_at = $current;
            $log->save();
        }   

        auth()->logout();
    
        return response()->json(['message' => 'Successfully logged out']);
    }

    public function cronIdleStatus()
    {
        $users = User::where('last_active', '<=', Carbon::now()->subMinutes(30))->get();
        $current = Carbon::now();

        foreach ($users as $user) {
            Log::info($user);
            $user->token_uid = null;
            $user->last_active = null;
            $user->badge_status = 'idle';
            $user->save();
    
            $log = UserStatusLog::where('user_id', $user->id)->whereNull('ended_at')->first();
            if ($log) {
                $log->ended_at = $current;
                $log->save();
            }   
    
        }

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $this->guard()->factory()->setTTL($this->ttl);

        $token = auth()->refresh();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL(),
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $data = [
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL(),
            'profile' => auth()->user(),
        ];
        return response()->json($data);
    }

    protected function guard()
    {
        return Auth::guard();
    }

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->where('username', $request->username)->first();
        if (!empty($user)) {
            $password = Str::random(8);
            $user->password = bcrypt($password);
            $user->is_reset_password = true;
            $user->changed_password_at = Carbon::now();
            $user->save();

            Mail::send('email.forgotPassword', ['password' => $password, 'username' => $user->username, 'email' => $user->email, 'firstname' => $user->firstname, 'lastname' => $user->lastname], function ($message) use ($request) {
                $message->to($request->email);
                $message->subject('Chat Center Member Password Recovery.');
            });

            return response()->json(['msg' => 'ทำการ reset รหัสผ่านให้เรียบร้อย กรุณาเช็ค email'], 200);
        }
        return response()->json(['error' => 'Username or email is invalid'], 400);
    }

    public function resetPassword(Request $request)
    {

        $request->validate([
            'password' => 'required|string|min:8',
        ]);
        $user = auth()->user();

        $user->password = bcrypt($request->password);
        $user->is_reset_password = false;
        $user->changed_password_at = Carbon::now();
        $user->save();

        return response()->json(['message' => 'Reset Password Success'], 200);

    }
}