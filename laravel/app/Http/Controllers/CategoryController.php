<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function list(Request $request)
    {
        $brand_id = $request->get('brand_id');
        $status = $request->get('status');
        $category = Category::where('brand_id', $brand_id)->orderBy('name', 'asc');

        if (!empty($status)) {
            $category = $category->where('status', $status);
        }
        $category =  $category->get();
        return response()->json($category->toArray(JSON_PRETTY_PRINT));
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'name' => 'required',
        ]);

        $category = Category::create([
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'code' => $request->code ?? null,
        ]);
        
        return response()->json($category);
    }


    public function update(Request $request, $id)
    {

        $category = Category::findOrFail($id);
        $category->name = $request->name ?? $category->name;
        $category->code = $request->code ?? $category->code;
        $category->status = $request->status ?? $category->status;
        $category->save();
        
        return response()->json($category);
    }


    public function delete(Request $request, $id)
    {
        Category::where('id', $id)->delete();

        return $this->ok(['message' => 'Delete success']);
    }
}
