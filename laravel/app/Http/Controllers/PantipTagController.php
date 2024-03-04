<?php

namespace App\Http\Controllers;

use App\Models\PantipTags;
use Illuminate\Http\Request;

class PantipTagController extends Controller
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

        $tags = PantipTags::where('brand_id', $id)
            ->with('createdUser')
            ->with('updatedUser');

        if ($request->has('keyword')) {
            $keyword = '%' . $request->get('keyword') . '%';
            $tags = $tags->where(function ($query) use ($keyword) {
                $query->where('keyword', 'LIKE', $keyword);
            });
        }

        $sort_field = $request->get('sort_field', 'created_at');
        $sort_order = $request->get('sort_order', 'desc');

        $total = $tags;
        $total = $total->count();
        $tags = $tags->offset($offset)->limit($limit)->orderBy($sort_field, $sort_order)->get();

        return response()->json([
            'tags' => $tags->toArray(JSON_PRETTY_PRINT),
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
            'keyword' => 'required',
            'status' => 'required|in:active,inactive',
        ]);

        $user = auth()->user();

        $tag = PantipTags::create([
            'brand_id' => $request->brand_id,
            'keyword' => $request->keyword,
            'status' => $request->status,
            'created_by' => $user->id,
        ]);
        
        return response()->json($tag);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\PantipTags  $pantipTags
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tag = PantipTags::findOrFail($id);
        return response()->json($tag);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PantipTags  $pantipTags
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();

        $tag = PantipTags::findOrFail($id);
        $tag->keyword = $request->keyword ?? $tag->keyword;
        $tag->updated_by = $user->id;
        $tag->status = $request->status ?? $tag->status;
        $tag->save();
        
        return response()->json($tag);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\PantipTags  $pantipTags
     * @return \Illuminate\Http\Response
     */
    public function destroy(PantipTags $pantipTags)
    {
        //
    }
}
