<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;
use App\Traits\FacebookTrait;
use App\Utils\FacebookApiUtil;
use Validator;

class PlatformController extends Controller
{
    use FacebookTrait;

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

        $platforms = Platform::where('brand_id', $id);

        if ($request->has('keyword')) {
            $keyword = '%' . $request->get('keyword') . '%';
            $platforms = $platforms->where(function ($query) use ($keyword) {
                $query->where('name', 'LIKE', $keyword);
            });
        }

        $sort_field = $request->get('sort_field', 'created_at');
        $sort_order = $request->get('sort_order', 'desc');

        $total = $platforms;
        $total = $total->count();
        $platforms = $platforms->offset($offset)->limit($limit)->orderBy($sort_field, $sort_order)->get();

        return response()->json([
            'platforms' => $platforms->toArray(JSON_PRETTY_PRINT),
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
            'name' => 'required',
            'platform_id' => 'required',
            'platform_secret' => 'required',
            'status' => 'required|in:active,inactive',
            'type' => 'required|in:facebook,messenger,line,pantip',
        ]);

        $platform = Platform::create([
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'platform_id' => $request->platform_id,
            'platform_secret' => $request->platform_secret,
            'status' => $request->status,
            'type' => $request->type,
        ]);
        
        return response()->json($platform);
    }

    public function check(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|array',
        ]);
        $platform = Platform::whereIn('platform_id', $request->id)->get();
        return response()->json($platform);
    }

    public function storeFacebook(Request $request)
    {
        $datas = ['data' => $request->all()];

        $validator = Validator::make($datas, [
            'data.*.access_token' => 'required',
            'data.*.id' => 'required',
            'data.*.name' => 'required',
            'data.*.fb_user_id' => 'required',
            'data.*.brand_id' => 'required',
            'data' => 'required',
        ])->validate();

        $platforms = Platform::whereIn('platform_id', array_column($datas['data'], 'id'))
            ->whereIn('type', ['facebook', 'messenger'])
            ->whereIn('brand_id', array_column($datas['data'], 'brand_id'))
            ->get();
        
        $platform_id_list = [];
        foreach ($platforms as $platform) {
            array_push($platform_id_list, $platform->platform_id);
        }

        $created_list = [];
        foreach ($datas['data'] as $data) {
            if (!in_array($data['id'], $platform_id_list)) {
                $long_access_token = $this->longLivedPageAccessToken($data['access_token'], $data['fb_user_id'], $data['id']);
                $new_fb_platform = new Platform;
                $new_fb_platform->name = $data['name'];
                $new_fb_platform->platform_id = $data['id'];
                $new_fb_platform->platform_secret = $long_access_token['page_long_token'];
                $new_fb_platform->status = 'active';
                $new_fb_platform->type = 'facebook';
                $new_fb_platform->brand_id = $data['brand_id'];
                $new_fb_platform->save();

                $new_messenger_platform = new Platform;
                $new_messenger_platform->name = $data['name'];
                $new_messenger_platform->platform_id = $data['id'];
                $new_messenger_platform->platform_secret = $long_access_token['page_long_token'];
                $new_messenger_platform->status = 'active';
                $new_messenger_platform->type = 'messenger';
                $new_messenger_platform->brand_id = $data['brand_id'];
                $new_messenger_platform->save();

                array_push($created_list, $new_fb_platform);
                array_push($created_list, $new_messenger_platform);

                (new FacebookApiUtil)->subscribePage(
                    pageId: $data['id'],
                    accessToken: $long_access_token['page_long_token'],
                    fields: ['feed', 'messages']
                );
            } else {
                $long_access_token = $this->longLivedPageAccessToken($data['access_token'], $data['fb_user_id'], $data['id']);
                $pfs = Platform::where('platform_id', $data['id'])->get();
                foreach ($pfs as $pf) {
                    $pf->platform_secret = $long_access_token['page_long_token'];
                    $pf->save();
                    array_push($created_list, $pf);
                }
            }
        }

        return response()->json($created_list);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Platform  $platform
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $platform = Platform::findOrFail($id);
        return response()->json($platform);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Platform  $platform
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $platform = Platform::findOrFail($id);
        $platform->name = $request->name ?? $platform->name;
        $platform->platform_id = $request->platform_id ?? $platform->platform_id;
        $platform->platform_secret = $request->platform_secret ?? $platform->platform_secret;
        $platform->status = $request->status ?? $platform->status;
        $platform->save();
        
        return response()->json($platform);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Platform  $platform
     * @return \Illuminate\Http\Response
     */
    public function destroy(Platform $platform)
    {
        //
    }

    public function delete(Request $request, $id)
    {
        Platform::where('id', $id)->delete();

        return $this->ok(['message' => 'Delete success']);
    }
}
