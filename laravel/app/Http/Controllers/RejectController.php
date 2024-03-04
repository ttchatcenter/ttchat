<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRejectRequest;
use App\Http\Requests\UpdateRejectRequest;
use App\Models\Reject;

class RejectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $list = Reject::all();
        return response()->json($list);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreRejectRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreRejectRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Reject  $reject
     * @return \Illuminate\Http\Response
     */
    public function show(Reject $reject)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Reject  $reject
     * @return \Illuminate\Http\Response
     */
    public function edit(Reject $reject)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateRejectRequest  $request
     * @param  \App\Models\Reject  $reject
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateRejectRequest $request, Reject $reject)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Reject  $reject
     * @return \Illuminate\Http\Response
     */
    public function destroy(Reject $reject)
    {
        //
    }
}
