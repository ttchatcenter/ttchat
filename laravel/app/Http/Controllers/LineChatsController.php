<?php

namespace App\Http\Controllers;

use App\Models\Chats;
use App\Models\ChatActivities;
use App\Models\Platform;
use App\Models\LineChats;
use App\Traits\LineTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Log;

class LineChatsController extends Controller
{
    use LineTrait;
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $chat = LineChats::where('chat_id', $id)->orderBy('created_at', 'desc')->get();

        return response()->json([
            'chat' => $chat->toArray(JSON_PRETTY_PRINT),
        ]);
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $id)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'text' => 'required',
        ]);

        $data = $request->all();
        $chat = Chats::findOrFail($id);
        $platform = Platform::findOrFail($chat->platform_id);
        
        $this->replied($chat->customer_id, $platform->platform_secret, $request->text, $request->is_image);

        LineChats::create([
            'chat_id' => $chat->id,
            'type' => $request->is_image ? 'image' : 'text',
            'content' => $request->text,
            'sender' => 'admin',
        ]);

        if ($chat->status === 'new') {
            if (!$chat->assignee) {
                $chat->assignee = $user->id;
                ChatActivities::create([
                    'chat_id' => $chat->id,
                    'action' => 'assigned',
                    'to' => $user->id,
                    'by_system' => true,
                ]);
            }
            ChatActivities::create([
                'chat_id' => $chat->id,
                'action' => 'replied',
                'actor' => $user->id,
            ]);
        }

        $chat->latest_message = $request->is_image ? 'Send an Image' : $request->text;
        $chat->latest_message_time = Carbon::now();
        $chat->status = 'replied';
        $chat->replied_at = Carbon::now();
        $chat->save();
        // todo:: add tag
        return response()->json([
            'success' => 'ok',
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\LineChats  $lineChats
     * @return \Illuminate\Http\Response
     */
    public function show(LineChats $lineChats)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\LineChats  $lineChats
     * @return \Illuminate\Http\Response
     */
    public function edit(LineChats $lineChats)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\LineChats  $lineChats
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, LineChats $lineChats)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\LineChats  $lineChats
     * @return \Illuminate\Http\Response
     */
    public function destroy(LineChats $lineChats)
    {
        //
    }
}
