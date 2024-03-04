<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\BrandMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Log;

class BrandController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $brands = Brand::select('*');

        $user = auth()->user();

        if ($user->role !== 'super_admin') {
            $func = function($value) {
                return $value['brand_id'];
            };

            $member = BrandMember::where('user_id', $user->id)->where('status', 'active')->get()->toArray(JSON_PRETTY_PRINT);
            $idList = array_map($func, $member);
            $brands = $brands->whereIn('id', $idList);
        }

        $sort_field = $request->get('sort_field', 'created_at');
        $sort_order = $request->get('sort_order', 'desc');

        $total = $brands;
        $total = $total->count();
        $brands = $brands->orderBy($sort_field, $sort_order)->get();

        return response()->json([
            'brands' => $brands->toArray(JSON_PRETTY_PRINT),
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
            'name' => 'required',
            'description' => 'required',
        ]);

        $brand = Brand::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);
    
        if ($request->hasfile('logo')) {
            $image = $request->file('logo');
            $path = 'public/logo/' . $brand->id . '/';
            $image_resize = Image::make($image);
            $image_resize->resize(640, 640, function ($constraint) {
                $constraint->aspectRatio();
            });
            $image_name = $brand->gen_uuid() . '.' . $image->getClientOriginalExtension();
            Storage::put($path . $image_name, $image_resize->stream(), 'public');
            $brand->logo = url(Storage::url($path . $image_name));
            $brand->save();
        }

        $user = auth()->user();

        if ($user->role === 'supervisor') {
            $member = BrandMember::create([
                'brand_id' => $brand->id,
                'user_id' => $user->id,
                'status' => 'active',
                'display_name' => $user->username,
                'platform_1' => 'none',
                'platform_2' => 'none',
                'platform_3' => 'none',
                'platform_4' => 'none',
                'concurrent_1' => 0,
                'concurrent_2' => 0,
                'concurrent_3' => 0,
                'concurrent_4' => 0,
            ]);
        }

        
        return response()->json($brand);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $brand = Brand::findOrFail($id);
        return response()->json($brand);
    }

    public function getAssignee(Request $request, $id)
    {
        $validated = $request->validate([
            'source' => 'required|in:facebook,messenger,line,pantip',
        ]);
        $platform = $request->source;
        $brand = Brand::findOrFail($id);
        $member = BrandMember::where('brand_id', $id)->where('status', 'active')->with('user');
        $member = $member->where(function ($query) use ($platform) {
            $query->where(function ($query2) use ($platform) {
                $query2->where('platform_1', $platform)
                    ->where('concurrent_1', '>', 0);
            })->orWhere(function ($query2) use ($platform) {
                $query2->where('platform_2', $platform)
                    ->where('concurrent_2', '>', 0);
            })->orWhere(function ($query2) use ($platform) {
                $query2->where('platform_3', $platform)
                    ->where('concurrent_3', '>', 0);
            })->orWhere(function ($query2) use ($platform) {
                $query2->where('platform_4', $platform)
                    ->where('concurrent_4', '>', 0);
            });
        });
        $list = $member->get();
        return response()->json([
            'list' => $list,
        ]);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required',
            'description' => 'required',
        ]);

        $brand = Brand::findOrFail($id);

        $brand->name = $request->name;
        $brand->description = $request->description;
    
        if ($request->hasfile('logo')) {
            $image = $request->file('logo');
            $path = 'public/logo/' . $brand->id . '/';
            $image_resize = Image::make($image);
            $image_resize->resize(640, 640, function ($constraint) {
                $constraint->aspectRatio();
            });
            $image_name = $brand->gen_uuid() . '.' . $image->getClientOriginalExtension();
            Storage::put($path . $image_name, $image_resize->stream(), 'public');
            $brand->logo = url(Storage::url($path . $image_name));
        }

        $brand->save();
        
        return response()->json($brand);
    }

    public function updateLogo(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        if ($request->hasfile('logo')) {
            $image = $request->file('logo');
            $path = 'public/logo/' . $brand->id . '/';
            $image_resize = Image::make($image);
            $image_resize->resize(640, 640, function ($constraint) {
                $constraint->aspectRatio();
            });
            $image_name = $brand->gen_uuid() . '.' . $image->getClientOriginalExtension();
            Storage::put($path . $image_name, $image_resize->stream(), 'public');
            $brand->logo = url(Storage::url($path . $image_name));
            $brand->save();
        }
        
        return response()->json($brand);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Brand  $brand
     * @return \Illuminate\Http\Response
     */
    public function destroy(Brand $brand)
    {
        //
    }
}
