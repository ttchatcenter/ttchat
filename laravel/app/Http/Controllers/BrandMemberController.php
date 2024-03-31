<?php

namespace App\Http\Controllers;

use App\Models\BrandMember;
use Illuminate\Http\Request;

class BrandMemberController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $id = $request->get('brand_id');
        $page = $request->get('page', 1);
        $limit = $request->get('limit', 10);

        $offset = ($limit * ($page - 1));

        $users = BrandMember::where('brand_id', $id)
            ->leftJoin('users', 'users.id', '=', 'user_id')
            ->select([
                'brand_members.*',
                'users.firstname as firstname',
                'users.lastname as lastname',
                'users.username as username',
                'users.status as user_status',
                'users.email as email',
                'users.role as role',
            ]);

        if ($request->has('keyword')) {
            $keyword = '%' . $request->get('keyword') . '%';
            $users = $users->where(function ($query) use ($keyword) {
                $query->where('display_name', 'LIKE', $keyword)
                    ->orWhere('firstname', 'LIKE', $keyword)
                    ->orWhere('lastname', 'LIKE', $keyword)
                    ->orWhere('username', 'LIKE', $keyword)
                    ->orWhere('email', 'LIKE', $keyword);
            });
        }

        $sort_field = $request->get('sort_field', 'created_at');
        $sort_order = $request->get('sort_order', 'desc');

        $total = $users;
        $total = $total->count();
        $users = $users->offset($offset)->limit($limit)->orderBy($sort_field, $sort_order)->get();

        return response()->json([
            'members' => $users->toArray(JSON_PRETTY_PRINT),
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
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'user_id' => 'required|exists:users,id',
            'status' => 'required|in:active,inactive',
            'display_name' => 'required',
            'platform_1' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_2' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_3' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_4' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_5' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_6' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_7' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'concurrent_1' => 'required|integer',
            'concurrent_2' => 'required|integer',
            'concurrent_3' => 'required|integer',
            'concurrent_4' => 'required|integer',
            'concurrent_5' => 'required|integer',
            'concurrent_6' => 'required|integer',
            'concurrent_7' => 'required|integer',
        ]);

        $member = BrandMember::create($request->all());
        
        return response()->json($member);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\BrandMember  $brandMember
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $member = BrandMember::with('user')->findOrFail($id);
        return response()->json($member);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\BrandMember  $brandMember
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
            'display_name' => 'required',
            'platform_1' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_2' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_3' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_4' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_5' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_6' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'platform_7' => 'required|in:facebook,messenger,line,pantip,inbox,twitter,dm,none',
            'concurrent_1' => 'required|integer',
            'concurrent_2' => 'required|integer',
            'concurrent_3' => 'required|integer',
            'concurrent_4' => 'required|integer',
            'concurrent_5' => 'required|integer',
            'concurrent_6' => 'required|integer',
            'concurrent_7' => 'required|integer',
        ]);
    
        $member = BrandMember::findOrFail($id);
        $member->status = $request->status ?? $member->status;
        $member->display_name = $request->display_name ?? $member->display_name;
        $member->platform_1 = $request->platform_1 ?? $member->platform_1;
        $member->platform_2 = $request->platform_2 ?? $member->platform_2;
        $member->platform_3 = $request->platform_3 ?? $member->platform_3;
        $member->platform_4 = $request->platform_4 ?? $member->platform_4;
        $member->platform_5 = $request->platform_5 ?? $member->platform_5;
        $member->platform_6 = $request->platform_6 ?? $member->platform_6;
        $member->platform_7 = $request->platform_7 ?? $member->platform_7;
        $member->concurrent_1 = $request->concurrent_1 ?? $member->concurrent_1;
        $member->concurrent_2 = $request->concurrent_2 ?? $member->concurrent_2;
        $member->concurrent_3 = $request->concurrent_3 ?? $member->concurrent_3;
        $member->concurrent_4 = $request->concurrent_4 ?? $member->concurrent_4;
        $member->concurrent_5 = $request->concurrent_5 ?? $member->concurrent_5;
        $member->concurrent_6 = $request->concurrent_6 ?? $member->concurrent_6;
        $member->concurrent_7 = $request->concurrent_7 ?? $member->concurrent_7;
        $member->save();
        
        return response()->json($member);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\BrandMember  $brandMember
     * @return \Illuminate\Http\Response
     */
    public function destroy(BrandMember $brandMember)
    {
        //
    }
}
