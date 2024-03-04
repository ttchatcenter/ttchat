<?php

namespace App\Http\Controllers;

use App\Models\SubcategoryLevel1;
use Illuminate\Http\Request;

class SubcategoryLevel1Controller extends Controller
{
    public function list(Request $request)
    {
        $brand_id = $request->get('brand_id');
        $category_id = $request->get('category_id');
        $status = $request->get('status');
        $subcategoryLevel1 = SubcategoryLevel1::where('brand_id', $brand_id)
            ->where('category_id', $category_id)
            ->orderBy('name', 'asc');
        if (!empty($status)) {
            $subcategoryLevel1 = $subcategoryLevel1->where('status', $status);
        }
        $subcategoryLevel1 = $subcategoryLevel1->get();


        return response()->json($subcategoryLevel1->toArray(JSON_PRETTY_PRINT));
    }

    public function create(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'category_id' => 'required|exists:category,id',
            'name' => 'required',
        ]);

        $subcategoryLevel1 = SubcategoryLevel1::create([
            'brand_id' => $request->brand_id,
            'name' => $request->name,
            'code' => $request->code ?? null,
            'category_id' => $request->category_id ?? null,
        ]);
        
        return response()->json($subcategoryLevel1);
    }


    public function update(Request $request, $id)
    {

        $subcategoryLevel1 = SubcategoryLevel1::findOrFail($id);
        $subcategoryLevel1->name = $request->name ?? $subcategoryLevel1->name;
        $subcategoryLevel1->code = $request->code ?? $subcategoryLevel1->code;
        $subcategoryLevel1->status = $request->status ?? $category->status;
        $subcategoryLevel1->save();
        
        return response()->json($subcategoryLevel1);
    }


    public function delete(Request $request, $id)
    {
        SubcategoryLevel1::where('id', $id)->delete();

        return $this->ok(['message' => 'Delete success']);
    }
}
