<?php

namespace App\Http\Controllers;

use App\Models\SubcategoryLevel2;
use Illuminate\Http\Request;

class SubcategoryLevel2Controller extends Controller
{
    public function list(Request $request)
    {
        $brand_id = $request->get('brand_id');
        $category_id = $request->get('category_id');
        $subcategory_level1_id = $request->get('subcategory_level1_id');
        $status = $request->get('status');
        $subcategoryLevel2 = SubcategoryLevel2::where('brand_id', $brand_id)
            ->where('category_id', $category_id)
            ->where('subcategory_level1_id', $subcategory_level1_id)
            ->orderBy('name', 'asc');

        if (!empty($status)) {
            $subcategoryLevel2 = $subcategoryLevel2->where('status', $status);
        }
        $subcategoryLevel2 = $subcategoryLevel2->get();
        
        return response()->json($subcategoryLevel2->toArray(JSON_PRETTY_PRINT));
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'category_id' => 'required|exists:category,id',
            'subcategory_level1_id' => 'required|exists:subcategory_level1,id',
            'name' => 'required',
        ]);

        $subcategoryLevel2 = SubcategoryLevel2::create([
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'code' => $request->code ?? null,
            'category_id' => $request->category_id ?? null,
            'subcategory_level1_id' => $request->subcategory_level1_id ?? null,
        ]);
        
        return response()->json($subcategoryLevel2);
    }


    public function update(Request $request, $id)
    {

        $subcategoryLevel2 = SubcategoryLevel2::findOrFail($id);
        $subcategoryLevel2->name = $request->name ?? $subcategoryLevel2->name;
        $subcategoryLevel2->code = $request->code ?? $subcategoryLevel2->code;
        $subcategoryLevel2->status = $request->status ?? $category->status;
        $subcategoryLevel2->save();
        
        return response()->json($subcategoryLevel2);
    }


    public function delete(Request $request, $id)
    {
        SubcategoryLevel2::where('id', $id)->delete();

        return $this->ok(['message' => 'Delete success']);
    }
}
