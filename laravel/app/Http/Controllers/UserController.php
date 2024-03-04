<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserStatusLog;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Log;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $page = $request->get('page');
        $limit = $request->get('limit');

        $users = User::select('*')->withCount('brands');

        if ($request->has('keyword')) {
            $keyword = '%' . $request->get('keyword') . '%';
            $users = $users->where(function ($query) use ($keyword) {
                $query->where('employee_id', 'LIKE', $keyword)
                ->orWhere('username', 'LIKE', $keyword)
                ->orWhere('email', 'LIKE', $keyword);
            });
        }

        $sort_field = $request->get('sort_field', 'created_at');
        $sort_order = $request->get('sort_order', 'desc');

        $total = $users;
        $total = $total->count();

        if ($page && $limit) {
            $offset = ($limit * ($page - 1));
            $users = $users->offset($offset)->limit($limit);
        }

        $users = $users->orderBy($sort_field, $sort_order)->get();

        return response()->json([
            'users' => $users->toArray(JSON_PRETTY_PRINT),
            'total' => $total,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->employee_id = $request->employee_id ?? $user->employee_id;
        $user->username = $request->username ?? $user->username;
        $user->firstname = $request->firstname ?? $user->firstname;
        $user->lastname = $request->lastname ?? $user->lastname;
        $user->email = $request->email ?? $user->email;
        $user->tel = $request->tel ?? $user->tel;
        $user->password = $request->password ? bcrypt($request->password) : $user->password;
        $user->role = $request->role ?? $user->role;
        $user->status = $request->status ?? $user->status;
        $user->save();
        
        return response()->json($user);
    }

    public function updateProfile(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->hasfile('profile')) {
            $image = $request->file('profile');
            $path = 'public/profile/' . $user->id . '/';
            $image_resize = Image::make($image);
            $image_resize->resize(640, 640, function ($constraint) {
                $constraint->aspectRatio();
            });
            $image_name = $user->gen_uuid() . '.' . $image->getClientOriginalExtension();
            Storage::put($path . $image_name, $image_resize->stream(), 'public');
            $user->profile_pic = url(Storage::url($path . $image_name));
            $user->save();
        }
        
        return response()->json($user);
    }

    public function updateBadgeStatus(Request $request)
    {

        $validated = $request->validate([
            'status' => 'required|in:idle,available,awc,break,toilet,meeting,consult,training,special_assign',
        ]);

        $user = auth()->user();
        $user->badge_status = $request->status;

        $current = Carbon::now();
        $log = UserStatusLog::where('user_id', $user->id)->whereNull('ended_at')->first();

        if ($log) {
            $log->ended_at = $current;
            $log->save();
        }   
        
        $user->save();
        UserStatusLog::create([
            'user_id' => $user->id,
            'status' => $request->status,
            'started_at' => $current,
        ]);
    
        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        //
    }
}
