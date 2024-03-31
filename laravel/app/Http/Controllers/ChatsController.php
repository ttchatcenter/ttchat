<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chats;
use App\Models\ChatClose;
use App\Models\ChatReject;
use App\Models\BrandMember;
use App\Models\ChatActivities;
use App\Models\BrandTags;
use App\Models\ChatTags;
use App\Models\BrandCrm;
use App\Models\Category;
use App\Models\SubcategoryLevel1;
use App\Models\SubcategoryLevel2;
use App\Models\LineChats;
use App\Models\ChatConstant;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Log;
use App\Traits\FacebookTrait;
use App\Traits\TwitterTrait;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


class ChatsController extends Controller
{
    use FacebookTrait;
    //use TwitterTrait;

    public function gen_uuid()
    {
        return sprintf( '%04x%04x%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000
        );
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $auth = auth()->user();

        $id = $request->get('brand_id');
    
        $chats = Chats::where('brand_id', $id);

        if ($auth->role === 'super_admin') {
            $chats = $chats->with("assigned");
        } else if ($auth->role === 'admin') {
            $chats = $chats->where('assignee', $auth->id);
        }

        if ($request->has('keyword')) {
            $keyword = '%' . $request->get('keyword') . '%';
            $chats = $chats->where(function ($query) use ($keyword) {
                $query->where('customer_name', 'LIKE', $keyword);
            });
        }

        if ($request->has('status')) {
            $chats = $chats->whereIn('status', $request->status);
        }

        if ($request->has('source')) {
            $chats = $chats->whereIn('source', $request->source);
        }

        if ($request->has('platform_id')) {
            $chats = $chats->whereIn('platform_id', $request->platform_id);
        }

        if ($request->has('assignee')) {
            $chats = $chats->whereIn('assignee', $request->assignee);
        }


        $sort_field = $request->get('sort_field', 'updated_at');
        $sort_order = $request->get('sort_order', 'desc');

        $total = $chats;
        $total = $total->count();
        $chats = $chats->orderBy($sort_field, $sort_order)->get();

        return response()->json([
            'chats' => $chats->toArray(JSON_PRETTY_PRINT),
            'total' => $total,
        ]);
    }

    public function seen(Request $request, $id)
    {
        $data = $request->all();
        $chat = Chats::findOrFail($id);
        $chat->unread_count = 0;
        $chat->save();
        return response()->json([
            'success' => 'ok',
        ]);
    }

    public function getTags(Request $request, $id)
    {
        $chat = Chats::findOrFail($id);
        $brandTags = BrandTags::where('brand_id', $chat->brand_id)->get();
        $chatTags = ChatTags::where('chat_id', $chat->id)->get();

        return response()->json([
            'brand_tags' => $brandTags,
            'chat_tags' => $chatTags,
        ]);
    }

    public function createTags(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);
    
        $chat = Chats::findOrFail($id);
        ChatTags::create([
            'chat_id' => $chat->id,
            'name' => $request->name,
        ]);
        $brandTags = BrandTags::where('name', $request->name)->first();
        if (!$brandTags) {
            BrandTags::create([
                'brand_id' => $chat->brand_id,
                'name' => $request->name,
            ]);
        }
        return response()->json([
            'success' => 'ok',
        ]);
    }

    public function getActivities(Request $request, $id)
    {
        $chat = Chats::findOrFail($id);
        $members = BrandMember::where('brand_id', $chat->brand_id)->get()->toArray(JSON_PRETTY_PRINT);
        $activities = ChatActivities::where('chat_id', $id)->with('actor_user')->with('to_user')->orderBy('id', 'desc')->get()->toArray(JSON_PRETTY_PRINT);
        for ($i = 0; $i < count($activities); $i++) {
            if ($activities[$i]['actor']) {
                $found_key = array_search($activities[$i]['actor'], array_column($members, 'user_id'));
                if ($found_key === 0 || $found_key) {
                    $activities[$i]['name'] = $members[$found_key]['display_name'];
                } else if ($activities[$i]['actor_user']) {
                    $activities[$i]['name'] = $activities[$i]['actor_user']['firstname'];
                }
            }
            if ($activities[$i]['to']) {
                $found_key = array_search($activities[$i]['to'], array_column($members, 'user_id'));
                if ($found_key === 0 || $found_key) {
                    $activities[$i]['to_name'] = $members[$found_key]['display_name'];
                } else if ($activities[$i]['to_user']) {
                    $activities[$i]['to_name'] = $activities[$i]['to_user']['firstname'];
                }
            }
        }
        return response()->json([
            'activities' => $activities,
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
     * @param  \App\Http\Requests\StoreChatsRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Chats  $chats
     * @return \Illuminate\Http\Response
     */
    public function show(Chats $chats)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Chats  $chats
     * @return \Illuminate\Http\Response
     */
    public function edit(Chats $chats)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateChatsRequest  $request
     * @param  \App\Models\Chats  $chats
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Chats $chats)
    {
        //
    }

    public function updateNote(Request $request, $id)
    {
        $data = $request->all();
        $chat = Chats::findOrFail($id);
        $chat->note = $request->note;
        $chat->save();
        return response()->json([
            'success' => 'ok',
        ]);
    }


    public function assign(Request $request, $id)
    {
        $auth = auth()->user();

        $validated = $request->validate([
            'member_id' => 'required|exists:brand_members,id'
        ]);
    
        $chat = Chats::findOrFail($id);
        $member = BrandMember::findOrFail($request->member_id);
        $user = $member->user;

        if ($chat->assignee) {
            $prevMember = BrandMember::where('brand_id', $chat->brand_id)->where('user_id', $chat->assignee)->first();
            if ($prevMember->platform_1 === $chat->source && $prevMember->current_ticket_1 > 0) {
                $prevMember->current_ticket_1 -= 1;
            } else if ($prevMember->platform_2 === $chat->source && $prevMember->current_ticket_2 > 0) {
                $prevMember->current_ticket_2 -= 1;
            } else if ($prevMember->platform_3 === $chat->source && $prevMember->current_ticket_3 > 0) {
                $prevMember->current_ticket_3 -= 1;
            } else if ($prevMember->platform_4 === $chat->source && $prevMember->current_ticket_4 > 0) {
                $prevMember->current_ticket_4 -= 1;
            } else if ($prevMember->platform_5 === $chat->source && $prevMember->current_ticket_5 > 0) {
                $prevMember->current_ticket_5 -= 1;   
            } else if ($prevMember->platform_6 === $chat->source && $prevMember->current_ticket_6 > 0) {
                $prevMember->current_ticket_6 -= 1;
            } else if ($prevMember->platform_7 === $chat->source && $prevMember->current_ticket_7 > 0) {
                $prevMember->current_ticket_7 -= 1;         
            }
            $prevMember->save();
        }
        $chat->assignee = $user->id;
        if ($member->platform_1 === $chat->source) {
            $member->current_ticket_1 += 1;
        } else if ($member->platform_2 === $chat->source) {
            $member->current_ticket_2 += 1;
        } else if ($member->platform_3 === $chat->source) {
            $member->current_ticket_3 += 1;
        } else if ($member->platform_4 === $chat->source) {
            $member->current_ticket_4 += 1;
        } else if ($member->platform_5 === $chat->source) {
            $member->current_ticket_5 += 1;
        } else if ($member->platform_6 === $chat->source) {
            $member->current_ticket_6 += 1;
        } else if ($member->platform_7 === $chat->source) {
            $member->current_ticket_7 += 1;        
        }
        $member->latest_assigned = Carbon::now();

        $member->save();
        $chat->save();

        ChatActivities::create([
            'chat_id' => $chat->id,
            'action' => 'assigned',
            'to' => $user->id,
            'actor' => $auth->id,
        ]);
    
        return response()->json([
            'success' => 'ok',
        ]);
    }

    public function close(Request $request, $id)
    {
        $auth = auth()->user();

        $validated = $request->validate([
            'category' => 'required',
            // 'subcategory' => 'required',
            // 'subcategoryLevel2' => 'required',
        ]);
    
        $chat = Chats::findOrFail($id);

        if ($chat->assignee) {
            $prevMember = BrandMember::where('brand_id', $chat->brand_id)->where('user_id', $chat->assignee)->first();
            if ($prevMember) {
                if ($prevMember->platform_1 === $chat->source && $prevMember->current_ticket_1 > 0) {
                    $prevMember->current_ticket_1 -= 1;
                } else if ($prevMember->platform_2 === $chat->source && $prevMember->current_ticket_2 > 0) {
                    $prevMember->current_ticket_2 -= 1;
                } else if ($prevMember->platform_3 === $chat->source && $prevMember->current_ticket_3 > 0) {
                    $prevMember->current_ticket_3 -= 1;
                } else if ($prevMember->platform_4 === $chat->source && $prevMember->current_ticket_4 > 0) {
                    $prevMember->current_ticket_4 -= 1;
                } else if ($prevMember->platform_5 === $chat->source && $prevMember->current_ticket_5 > 0) {
                    $prevMember->current_ticket_5 -= 1;
                } else if ($prevMember->platform_6 === $chat->source && $prevMember->current_ticket_6 > 0) {
                    $prevMember->current_ticket_6 -= 1;
                } else if ($prevMember->platform_7 === $chat->source && $prevMember->current_ticket_7 > 0) {
                    $prevMember->current_ticket_7 -= 1;    
                }
                $prevMember->latest_assigned = Carbon::now();
                $prevMember->save();
            }
        } else {
            $chat->assignee = $auth->id;
            ChatActivities::create([
                'chat_id' => $chat->id,
                'action' => 'assigned',
                'to' => $auth->id,
                'by_system' => true,
            ]);
        }

        $chat->status = 'closed';
        $chat->closed_at = Carbon::now();
        $chat->save();

        ChatClose::create([
            'chat_id' => $chat->id,
            'category' => $request->category,
            'subcategory' => $request->subcategory,
            'subcategoryLevel2' => $request->subcategoryLevel2,
        ]);
    
        ChatActivities::create([
            'chat_id' => $chat->id,
            'action' => 'closed',
            'actor' => $auth->id,
        ]);
    
        $privateKey = <<<EOD
        -----BEGIN RSA PRIVATE KEY-----
        MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCUui4eJHOwvzhv
        XOkgTj1gdQdBZnWaF41vnv3bvGpDlzwm7ZGj7ZX1SZ8d1MxkUfT5FCn8fLkeCZrW
        m1yIbFOgbncyiL1zZR/F7ZcySlH8x4CUFEOIzjT/jstqcNsZdQQ1f6sCVWwvyX2o
        NWqIh6r4FQeRGXCFy2Imt4LiQj1643EnGoeRcL89uMVhcTvyvapCdVLUcNqAttjS
        Q9ytYbcMVqII8fA+EUGxxJWHD/9y0fYRieE3v3kP7Ymr5qZmILg5cjmbRub/aPAM
        Ejg5kv3r8AAS9ACz57hxHpmH03A1O4QFLNQIl1sAu4/iaZRxxuAQKdgO4i552x0z
        zRvYMrQ/AgMBAAECggEAAvhkMwlPiFf81e35MqisFIfwhhiCnKMentM/mMgnrKot
        3AW6pPOJTThJ4zZAbgeZttx6sSU6XuhiFEi1cBZgo1fyE+tFE5TjOBmidSH2pagL
        3ZndH1d3vXVWyt8w+F2vaHRG0YHu4CL3kpWImTP2gryMJFwNci+RzKvzDXwbtBpN
        TAfLfFHYPFJ6AZJxgAGraVreuDXGFmX2xLVUJCs0eNGAOIpV8ZPJDA+mpMQ2p4s0
        DLSc/Gs4KRfFM2oBpxMHER/XYXrXbBQX/TjO5iVYKhzkhA/htnPVupS7KvqttHTS
        YjHmv9YwP7ExDmeUvN//02LTxs0TYrzIP1WwRNu/1QKBgQDQYhi3MIzhWnHHoQF9
        +qXW40Vqs4/+0oAtlfH0d4yK1wG5/s39/AHRgwOLRjkPGtvf3HLQM7o46W7cyqUO
        /d15B3JZ5ZgvGif5xAIXacrgvyMfrOc4s3/d2JyVIWjUkTE43SxTBTZaGF+QkGq6
        2BBJdnh0wEIwmKTxEOmyVFw0rQKBgQC2tlvmTSAsB1J5gfaSWMB1uvEpm6nLzNc5
        OkpQ+QTEdnnuh2+ijXRgocfshCqKqylsL+IILDSUYHsy7rwflbG9RjPNUPEB4CFO
        Zks+PcTmfRIuI46/epndsteWCs8B6HLPIRvAspzFWLDIs1dZoWyIqVxuUDTzp9bv
        S/CHGDx+GwKBgFng5b4lr64HX6n19PnMYTlFP4ydNE95pZWD5h9GbRT5VaJOl7Sj
        vHkMZDvvJu8v64Qrxk2s8fZYINwUf4ruzlbEcnr5v2EZjAJ7m1dT5xB3AIRKBFT9
        fvpF0ou0JE4C7dMT+mk4h0/m0Vk+IPrD9IprEdtxjVr+i636WIH1RuvlAoGBAI/6
        zBiDlmKbsoZFv8Q7ZA5iLkCXhgovdTqHkKCWWwdmRVeOKo5x4c90LVNYIx37Gz1B
        zmCaVSTHks3kCyLol5OLiq60pfbQY+6f9ZMqocrvrC/nnUmOl0l48SIvikj6n95R
        PMlw9tEcvtKpYKAk8J4Qt+HGGrQXAuy3budGVgUZAoGAMTZ8TKPX4dLcZjFpHP+e
        83VlslzG0UR/Z+UaVKKjb54L7fAGd/VR99ovfJe1jGym35oI8LS1Kfplss674RV5
        If5GefGbiFrBnFVQvc54zNevQti5PcjBdoQBzWNAi78uMwk4PfN55TcwLAPo2k9I
        z6jvirvpXJuOcCxzdmlOc6k=
        -----END RSA PRIVATE KEY-----
        EOD;
        
        $payload = [
            "iss" => "truetouch",
            "aud" => "truetouch",
            "userName" => "ChatCenter",
            "iat" => Carbon::now()->timestamp,
            "nbf" => Carbon::now()->timestamp,
            "exp" => Carbon::now()->add(1, 'minutes')->timestamp
        ];
        
        $jwt = JWT::encode($payload, $privateKey, 'RS256');

        $crm = BrandCrm::where('brand_id', $chat->brand_id)->first();

        if ($crm && $crm->link && $crm->status === 'active') {
            $client = new Client();
            $path = "/chatcenter/restapi/social_restapi.php";

            if ($chat->source === 'facebook') {
                $data['post_id'] = $chat->fbPost->post_id;
            } else {
                $data['post_id'] = '-';
            }
            $data['thread_id'] = (string)$chat->id;
            $data['channel'] = $chat->source;
            $data['author'] = $chat->customer_name;
            $data['author_social_id'] = $chat->customer_id;
            if ($chat->source === 'facebook') {
                $post = $this->getPost($chat->fbPost->post_id, $chat->platform->platform_secret);
                $data['detail'] = $post['message'];
            } else {
                $data['detail'] = '-';
            }
            $data['post_time'] = $chat->created_at->format('d/m/Y H:i:s');
            $data['close_time'] = Carbon::now()->format('d/m/Y H:i:s');
            $code = '';
            if ($request->subcategoryLevel2) {
                $model = SubcategoryLevel2::find($request->subcategoryLevel2);
                if ($model) {
                    $code = $model->code;
                }
            } else if ($request->subcategory) {
                $model = SubcategoryLevel1::find($request->subcategory);
                if ($model) {
                    $code = $model->code;
                }
            } else {
                $model = Category::find($request->category);
                if ($model) {
                    $code = $model->code;
                }
            }
            $data['category_id'] = $code; // code level 2
            if ($chat->source === 'facebook') {
                $data['link'] = $chat->fbPost->post_url;
            } else {
                $data['link'] = '-';
            }
            $data['note_by_agent'] = $chat->note ?? '-';

            $conversation = '-';
            $commentList = [];
            if ($chat->source === 'facebook') {
                $comments = $this->getComment($chat->fbPost->comment_id, $chat->platform->platform_secret);
                if (count($comments['data'])) {
                    foreach ($comments['data'] as $c) {
                        if (count($commentList) === 0) {
                            array_push($commentList, [
                                "post_author_type" => "Customer",
                                "post_author_name" => $c['parent']['from']['name'],
                                "post_body" => $c['parent']['message'],
                                "post_date" => Carbon::parse($c['parent']['created_time'])->format('d/m/Y H:i:s')
                            ]);
                        }
                        array_push($commentList, [
                            "post_author_type" => $chat->customer_id === $c['from']['id'] ? "Customer" : "Agent",
                            "post_author_name" => $chat->customer_id === $c['from']['id'] ? $c['from']['name'] : '[' . $auth->firstname. ' ' . $auth->lastname . '] '. $c['from']['name'],
                            "post_body" => $c['message'],
                            "post_date" => Carbon::parse($c['created_time'])->format('d/m/Y H:i:s')
                        ]);
                        if (isset($c['comments']) && isset($c['comments']['data'])) {
                            foreach ($c['comments']['data'] as $cm) {
                                array_push($commentList, [
                                    "post_author_type" => $chat->customer_id === $cm['from']['id'] ? "Customer" : "Agent",
                                    "post_author_name" => $chat->customer_id === $cm['from']['id'] ? '[' . $auth->firstname. ' ' . $auth->lastname . '] '. $cm['from']['name'] : $cm['from']['name'],
                                    "post_body" => $cm['message'],
                                    "post_date" => Carbon::parse($cm['created_time'])->format('d/m/Y H:i:s')
                                ]);
                            }
                        }
                    }
                } else {
                    array_push($commentList, [
                        "post_author_type" => "Customer",
                        "post_author_name" => $chat->customer_name,
                        "post_body" => $chat->latest_message,
                        "post_date" => $chat->latest_message_time
                    ]);
                }
            } else if ($chat->source === 'messenger') {
                $comments = $this->getChat($chat->platform->platform_id, $chat->customer_id, $chat->platform->platform_secret);
                if (isset($comments['data']) && isset($comments['data'][0]) && isset($comments['data'][0]['messages'])) {
                    foreach ($comments['data'][0]['messages']['data'] as $msg) {
                        if ($chat->created_at->subSeconds(15)->lessThanOrEqualTo(Carbon::parse($msg['created_time']))) {
                            array_push($commentList, [
                                "post_author_type" => $chat->customer_id === $msg['from']['id'] ? "Customer" : "Agent",
                                "post_author_name" => $chat->customer_id === $msg['from']['id'] ? $msg['from']['name'] : '[' . $auth->firstname. ' ' . $auth->lastname . '] '. $msg['from']['name'],
                                "post_body" => isset($msg['message']) && $msg['message'] !== '' ? $msg['message'] : 'Send an attachment / images / stickers',
                                "post_date" => Carbon::parse($msg['created_time'])->format('d/m/Y H:i:s')
                            ]);
                        }
                    }
                    $commentList = array_reverse($commentList);
                }
            } else if ($chat->source === 'line') {
                $chats = LineChats::where('chat_id', $chat->id)->orderBy('created_at', 'asc')->get();
                foreach ($chats as $msg) {
                    array_push($commentList, [
                        "post_author_type" => $msg->sender === 'user' ? "Customer" : "Agent",
                        "post_author_name" => $msg->sender === 'user' ? $chat->customer_name : '[' . $auth->firstname. ' ' . $auth->lastname . '] '. $chat->platform->name,
                        "post_body" => $msg->content,
                        "post_date" => Carbon::parse($msg->created_at)->format('d/m/Y H:i:s')
                    ]);
                }
            } else if ($chat->source === 'twitter') {
                $datapost = TwitterPosts::where('chat_id', $chat->twPost->chat_id)->first();
                $dataconstant = ChatConstant::where('brand_id', $datapost->brand_id)->first();
                $client = new Client();
                $url = 'https://api.twitter.com/2/tweets/search/recent';
                $redatacomment = [];
                $existingIds = [];
                try {
                   $response = $client->request('GET', $url, [
                        'headers' => [
                            //'Authorization' => 'Bearer ' .env('TWITTER_BEARER_TOKEN')// $twitterBearerToken//env('TWITTER_BEARER_TOKEN'),
                            'Authorization' => 'Bearer ' .$dataconstant->twitter_bearer_token
                        ],
                        'query' => [
                            'query' => 'conversation_id:'.$datapost->conversation_id,
                            'tweet.fields' => 'id,text,author_id,created_at,reply_settings,source,withheld,context_annotations,conversation_id,attachments,edit_controls,geo,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets',
                            'media.fields' => 'duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,non_public_metrics,organic_metrics,promoted_metrics,alt_text,variants',
                            'user.fields' => 'created_at,description,entities,id,location,most_recent_tweet_id,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,verified_type,withheld',
                            'expansions' => 'author_id,entities.mentions.username,in_reply_to_user_id,referenced_tweets.id.author_id,geo.place_id,edit_history_tweet_ids,attachments.media_keys', 
                        ],
                    ]);
                    $responseData = json_decode($response->getBody()->getContents(), true);
                    $users = $responseData['includes']['users'];
                    foreach ($responseData['data'] as $post) {
                        $userprofile = $this->getUserProfile($post['author_id'], $users);
                        $post['userprofile_replay'] = $userprofile;
                        if (isset($post['referenced_tweets'][0]['type']) && $post['referenced_tweets'][0]['type'] === 'replied_to') {
                            $parentPostId = $post['referenced_tweets'][0]['id'];
                            foreach ($responseData['includes']['tweets'] as $reply) {
                                if ($reply['id'] === $parentPostId) {
                                    $replyUserProfile = $this->getUserProfile($reply['author_id'], $users);
                                    $post['at_post'] = [
                                        'id' => $reply['id'],
                                        'text' => $reply['text'],
                                        'userprofile_post' => $replyUserProfile,
                                        'created_at' => $reply['created_at'],
                                        'media' => $replymedias,
                                    ];
                                    break;
                                }
                            }
                        } else {
                            $post['at_post'] = null;
                        }
                        //if ($post['id'] === $datapost->tweet_id || $post['at_post']['id'] === $datapost->tweet_id ){
                            $formattedData[] = $post;
                        //}
                    }
                    foreach ($formattedData as $tweetData) {
                        // เช็คว่า id มีอยู่ใน array ที่มีอยู่แล้วหรือไม่
                        if (!in_array($tweetData['id'], $existingIds)) {
                            $post_author_type='';
                            if  ($tweetData['userprofile_replay']['id'] === $dataconstant->tw_userid ){
                                $post_author_type='Customer';
                            }else{
                                $post_author_type='Agent';
                            }
                            $redatacomment[] = [
                                'post_author_type' => $post_author_type,
                                'post_author_name' => $tweetData['userprofile_replay']['name'],
                                'post_body' => $tweetData['text'],
                                'post_date' => $tweetData['created_at']
                            ];
                            // เพิ่ม id เข้าไปใน array เพื่อใช้ในการตรวจสอบซ้ำ
                            $existingIds[] = $tweetData['id'];
                        }
                        // เพิ่มข้อมูลจาก at_post
                        if (!in_array($tweetData['at_post']['id'], $existingIds)) {
                            $post_author_type='';
                            if  ($tweetData['at_post']['userprofile_post']['id'] === $dataconstant->tw_userid ){
                                $post_author_type='Customer';
                            }else{
                                $post_author_type='Agent';
                            }
                            $redatacomment[] = [
                                'post_author_type' => $post_author_type,
                                'post_author_name' => $tweetData['at_post']['userprofile_post']['name'],
                                'post_body' => $tweetData['at_post']['text'],
                                'post_date' => $tweetData['at_post']['created_at']
                            ];
                            $existingIds[] = $tweetData['at_post']['id'];
                        }
                    }
                    usort($redatacomment, function($a, $b) {
                        return strtotime($a['post_date']) - strtotime($b['post_date']);
                    });
                    $commentList = $redatacomment;
                } catch (\Exception $e) {
                    Log::error('Error searching tweets: ' . $e->getMessage());
                    $commentList =  null;
                }
            }

            $data['conversation'] = $commentList; // array string
            // $data['conversation'] = json_encode($commentList); // array string
            $data['employee_id'] = $auth->employee_id;

            try {
                Log::info($crm->link . $path);
                Log::info($jwt);
                Log::info($data);
                $response = $client->request(
                    'POST',
                    $crm->link . $path,
                    [
                        'headers' => ['tokenid' => $jwt],
                        'json' => $data,
                    ],
                );
                $res = json_decode($response->getBody(), true);
                Log::info('success');
                Log::info($res);
            } catch (\Throwable $th) {
                Log::info('error');
                Log::info($th);
            }
        }
    
        return response()->json([
            'success' => 'ok',
        ]);
    }
    public function reject(Request $request, $id)
    {
        $auth = auth()->user();

        $validated = $request->validate([
            'reason' => 'required|string',
        ]);
    
        $chat = Chats::findOrFail($id);

        if ($chat->assignee) {
            $prevMember = BrandMember::where('brand_id', $chat->brand_id)->where('user_id', $chat->assignee)->first();
            if ($prevMember) {
                if ($prevMember->platform_1 === $chat->source && $prevMember->current_ticket_1 > 0) {
                    $prevMember->current_ticket_1 -= 1;
                } else if ($prevMember->platform_2 === $chat->source && $prevMember->current_ticket_2 > 0) {
                    $prevMember->current_ticket_2 -= 1;
                } else if ($prevMember->platform_3 === $chat->source && $prevMember->current_ticket_3 > 0) {
                    $prevMember->current_ticket_3 -= 1;
                } else if ($prevMember->platform_4 === $chat->source && $prevMember->current_ticket_4 > 0) {
                    $prevMember->current_ticket_4 -= 1;
                } else if ($prevMember->platform_5 === $chat->source && $prevMember->current_ticket_5 > 0) {
                    $prevMember->current_ticket_5 -= 1;
                } else if ($prevMember->platform_6 === $chat->source && $prevMember->current_ticket_6 > 0) {
                    $prevMember->current_ticket_6 -= 1;
                } else if ($prevMember->platform_7 === $chat->source && $prevMember->current_ticket_7 > 0) {
                    $prevMember->current_ticket_7 -= 1;    
                }
                $prevMember->latest_assigned = Carbon::now();
                $prevMember->save();
            }
        } else {
            $chat->assignee = $auth->id;
            ChatActivities::create([
                'chat_id' => $chat->id,
                'action' => 'assigned',
                'to' => $auth->id,
                'by_system' => true,
            ]);
        }

        $chat->status = 'rejected';
        $chat->closed_at = Carbon::now();
        $chat->save();

        ChatReject::create([
            'chat_id' => $chat->id,
            'reason' => $request->reason,
        ]);
    
        ChatActivities::create([
            'chat_id' => $chat->id,
            'action' => 'rejected',
            'actor' => $auth->id,
        ]);
    
        return response()->json([
            'success' => 'ok',
        ]);
    }
    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Chats  $chats
     * @return \Illuminate\Http\Response
     */
    public function destroy(Chats $chats)
    {
        //
    }

    public function uploadImage(Request $request)
    {
        if ($request->hasfile('image')) {
            $image = $request->file('image');
            $path = 'public/image/chat/';
            $image_resize = Image::make($image);
            $image_name = $this->gen_uuid() . '.' . $image->getClientOriginalExtension();
            Storage::put($path . $image_name, $image_resize->stream(), 'public');
            return response()->json(['url' => url(Storage::url($path . $image_name))]);
        }
        return response()->json(['url' => null]);
    }

    public function crm(Request $request)
    {
        $validated = $request->validate([
            'brand_id' => 'required|exists:brands,id',
            'link' => 'string',
            'status' => 'required|in:active,inactive',
        ]);

        $crm = BrandCrm::where('brand_id', $request->brand_id)->first();
        if ($crm) {
            $crm->link = $request->link;
            $crm->status = $request->status;
            $crm->save();
        } else {
            $crm = BrandCrm::create([
                'brand_id' => $request->brand_id,
                'link' => $request->link,
                'status' => $request->status,
            ]);
        }
        return response()->json(['data' => $crm]);
    }

    public function getCrm(Request $request, $id)
    {
        $crm = BrandCrm::where('brand_id', $id)->first();
        return response()->json(['data' => $crm]);
    }

    public function cronAutoAssign()
    {
        $chats = Chats::whereNull('assignee')->where('status', 'new')->get();
        foreach ($chats as $chat) {
            Log::info($chat);
            $type = $chat->source;
            $member = BrandMember::where('brand_id', $chat->brand_id)->where('status', 'active')->with('user');
            $member = $member->where(function ($query) use ($type) {
                $query->where(function ($query2) use ($type) {
                    $query2->where('platform_1', $type)
                        ->where('concurrent_1', '>', 0);
                })->orWhere(function ($query2) use ($type) {
                    $query2->where('platform_2', $type)
                        ->where('concurrent_2', '>', 0);
                })->orWhere(function ($query2) use ($type) {
                    $query2->where('platform_3', $type)
                        ->where('concurrent_3', '>', 0);
                })->orWhere(function ($query2) use ($type) {
                    $query2->where('platform_4', $type)
                        ->where('concurrent_4', '>', 0);
                })->orWhere(function ($query2) use ($type) {
                    $query2->where('platform_5', $type)
                        ->where('concurrent_5', '>', 0);
                })->orWhere(function ($query2) use ($type) {
                    $query2->where('platform_6', $type)
                        ->where('concurrent_6', '>', 0);
                })->orWhere(function ($query2) use ($type) {
                    $query2->where('platform_7', $type)
                        ->where('concurrent_7', '>', 0);        
                });
            });
            $list = $member->get()->toArray(JSON_PRETTY_PRINT);
            $available_list = array_filter($list, function ($member) use ($type) {
                $is_free = false;
                if (($member['platform_1'] === $type && ($member['current_ticket_1'] < $member['concurrent_1'])) ||
                    ($member['platform_2'] === $type && ($member['current_ticket_2'] < $member['concurrent_2'])) ||
                    ($member['platform_3'] === $type && ($member['current_ticket_3'] < $member['concurrent_3'])) ||
                    ($member['platform_4'] === $type && ($member['current_ticket_4'] < $member['concurrent_4'])) ||
                    ($member['platform_5'] === $type && ($member['current_ticket_5'] < $member['concurrent_5'])) ||
                    ($member['platform_6'] === $type && ($member['current_ticket_6'] < $member['concurrent_6'])) ||
                    ($member['platform_7'] === $type && ($member['current_ticket_7'] < $member['concurrent_7']))
                ) {
                    $is_free = true;
                }
                return $is_free && ($member['user']['badge_status'] === 'available');
            });

            if (count($available_list)) {
                usort($available_list, function ($a, $b) use ($type) {
                    $a_priority = 0;
                    $b_priority = 0;
                    if ($a['platform_1'] === $type) { $a_priority = 1; }
                    else if ($a['platform_2'] === $type) { $a_priority = 2; }
                    else if ($a['platform_3'] === $type) { $a_priority = 3; }
                    else if ($a['platform_4'] === $type) { $a_priority = 4; }
                    else if ($a['platform_5'] === $type) { $a_priority = 5; }
                    else if ($a['platform_6'] === $type) { $a_priority = 6; }
                    else if ($a['platform_7'] === $type) { $a_priority = 7; }

                    if ($b['platform_1'] === $type) { $b_priority = 1; }
                    else if ($b['platform_2'] === $type) { $b_priority = 2; }
                    else if ($b['platform_3'] === $type) { $b_priority = 3; }
                    else if ($b['platform_4'] === $type) { $b_priority = 4; }
                    else if ($b['platform_5'] === $type) { $b_priority = 5; }
                    else if ($b['platform_6'] === $type) { $b_priority = 6; }
                    else if ($b['platform_7'] === $type) { $b_priority = 7; }

                    if ($a_priority === $b_priority) {
                        if (!$a['latest_assigned']) {
                            return -1;
                        } else if (!$b['latest_assigned']) {
                            return 1;
                        } else {
                            return (strtotime($a['latest_assigned']) < strtotime($b['latest_assigned'])) ? -1 : 1;
                        }
                    }
                    return ($a_priority < $b_priority) ? -1 : 1;
                });

                $member = BrandMember::findOrFail($available_list[0]['id']);

                $chat->assignee = $member->user_id;
                if ($member->platform_1 === $type) {
                    $member->current_ticket_1 += 1;
                } else if ($member->platform_2 === $type) {
                    $member->current_ticket_2 += 1;
                } else if ($member->platform_3 === $type) {
                    $member->current_ticket_3 += 1;
                } else if ($member->platform_4 === $type) {
                    $member->current_ticket_4 += 1;
                } else if ($member->platform_5 === $type) {
                    $member->current_ticket_5 += 1;  
                } else if ($member->platform_6 === $type) {
                    $member->current_ticket_6 += 1;
                } else if ($member->platform_7 === $type) {
                    $member->current_ticket_7 += 1;        
                }
                $member->latest_assigned = Carbon::now();
        
                $member->save();
                $chat->save();

                ChatActivities::create([
                    'chat_id' => $chat->id,
                    'action' => 'assigned',
                    'to' => $member->user_id,
                    'by_system' => true,
                ]);
            }
        }
        return response()->json(['message' => 'Successfully']);
    }
    
   




}
