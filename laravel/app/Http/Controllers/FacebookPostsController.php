<?php

namespace App\Http\Controllers;

use App\Models\Chats;
use App\Models\ChatActivities;
use App\Models\Platform;
use App\Models\FacebookPosts;
use App\Traits\FacebookTrait;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Log;

class FacebookPostsController extends Controller
{
    //
    use FacebookTrait;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($id)
    {
        $post = FacebookPosts::where('chat_id', $id)->first();

        return response()->json([
            'post' => $post,
        ]);
    }

    /**
    * Store a newly created resource in storage.
    *
    * @param  \Illuminate\Http\Request  $request
    * @return \Illuminate\Http\Response
    */
    public function reply(Request $request, $id)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'text' => 'required',
        ]);

        $data = $request->all();
        $chat = Chats::findOrFail($id);
        $platform = Platform::findOrFail($chat->platform_id);
        $post = FacebookPosts::where('chat_id', $id)->first();

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

        if (!isset($request->bypass)) {
            $this->comment($request->get('comment_id', $post->comment_id), $platform->platform_secret, $request->text);
        }
        $chat->latest_message = $request->text;
        $chat->latest_message_time = Carbon::now();
        $chat->status = 'replied';
        $chat->replied_at = Carbon::now();
        $chat->save();
        // todo:: add tag
        return response()->json([
            'success' => 'ok',
        ]);
    }
}
