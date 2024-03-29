<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Chats;
use App\Models\ChatActivities;
use App\Models\BrandMember;
use App\Models\Platform;
use App\Models\TwitterPosts;
use App\Models\ChatConstant;
use App\Traits\TwitterTrait;
use Carbon\Carbon;
use Log;
use DateTime;
class TwitterController extends Controller
{
    use TwitterTrait;
    public function search(Request $request)
    {
        $query = $request->input('query');
        $tweetFields = $request->input('tweet_fields'); //
        $max_results = $request->input('max_results');
        $start_time= $request->input('start_time'); //
        $end_time = $request->input('end_time');
        $media = $request->input('media');
        $userfile = $request->input('userfile');
        $platformId = $request->input('platformId');
        $brandId = $request->input('brandId');
        $tweets = $this->searchTweets($query, $tweetFields,$max_results,$start_time,$end_time,$media,$userfile,$brandId, $platformId);
        if ($tweets === null) {
            // เกิดข้อผิดพลาดในการค้นหา Tweets
            return response()->json(['error' => 'Error searching tweets.'], 500);
        }
       
        //วนลูปผ่านทุกโพสต์และบันทึกข้อมูลลงในฐานข้อมูล
         foreach ($tweets as $tweet) {
          //  $existingPost = TwitterPosts::where('tweet_id', $tweet['id'])->first();
            $existingPost = TwitterPosts::where('tweet_id', $tweet['id'])
            ->where('conversation_id', $tweet['conversation_id'])
            ->first();
            // ตรวจสอบว่าโพสต์นี้ยังไม่มีอยู่ในฐานข้อมูลหรือไม่
            if (!$existingPost) {
                // สร้างโพสต์ใหม่ในฐานข้อมูล
               /////////////สร้าง chat //////////////
              //$status = $this->handlePost($tweet);
           

                $platform_client_id = $tweet['platformId']; //$body['entry'][0]['id'];
                $customer_id = $tweet['userprofile_replay']['id'];
                $customer_name = $tweet['userprofile_replay']['name'];
                $customer_profile = $tweet['userprofile_replay']['profile_image_url'];
                $tweet_id = $tweet['id'];
                $content = json_encode($tweet, JSON_UNESCAPED_UNICODE);
               // $created_at =  date('Y-m-d H:i:s',  strtotime($tweet['created_at']));
                // แปลงวันที่และเวลาจาก API Twitter เป็นรูปแบบของ PHP DateTime
                $carbonDateTime = Carbon::parse($tweet['created_at'])->timezone('Asia/Bangkok');
                $dateTime = new DateTime($carbonDateTime);
                // แปลงรูปแบบของ DateTime เป็นรูปแบบที่ถูกต้องสำหรับฐานข้อมูล MySQL
                $created_at  = $dateTime->format('Y-m-d H:i:s');
                // $datetime = $tweet['created_at'];
                // $datetime_object = new DateTime($datetime, new DateTimeZone('UTC'));
                // $datetime_object->setTimezone(new DateTimeZone('Asia/Bangkok'));
                // $formatted_datetime = $datetime_object->format('Y-m-d\TH:i:s');

                $createdate = date('Y-m-d H:i:s');
                $conversation_id = $tweet['conversation_id'];
                if (isset($tweet['in_reply_to_user_id'])) {
                    $in_reply_to_user_id = $tweet['in_reply_to_user_id'];
                }
                if (isset($tweet['referenced_tweets'])) {
                    foreach ($tweet['referenced_tweets'] as $referenced_tweets) {
                    $message_type = $referenced_tweets['type'];
                    }
                }
                $platform = Platform::where('platform_id', $platform_client_id)->first();
                if ($platform) {
                   // $user = $this->getUserProfile($customer_id, $platform->platform_secret);
                    $chat = Chats::create([
                        'brand_id' => $platform->brand_id,
                        'platform_id' => $platform->id,
                        'customer_name' => $customer_name,
                        'customer_id' => $customer_id,
                        'customer_profile' => $customer_profile,
                        'source' => 'twitter',
                    ]);
                    ChatActivities::create([
                        'chat_id' => $chat->id,
                        'action' => 'new',
                        'by_system' => true,
                    ]);
                   
                    $post = TwitterPosts::create([
                        'chat_id' => $chat->id,
                        'tweet_id' => $tweet_id,
                        'content' => $content,
                        'created_at' => $created_at,
                        'createdate' => $createdate,
                        'conversation_id' => $conversation_id,
                        'in_reply_to_user_id' => $in_reply_to_user_id,
                        'message_type' => $message_type,
                        
                    ]);
                    $chat->latest_message = $tweet['text'];
                    $chat->unread_count += 1;
                    $chat->latest_message_time = $created_at;
                    $chat->save();

                    // auto assign post
                    $type = 'twitter';
                    $member = BrandMember::where('brand_id', $platform->brand_id)->where('status', 'active')->with('user');
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
                        });
                    });
                    $list = $member->get()->toArray(JSON_PRETTY_PRINT);
                    $available_list = array_filter($list, function ($member) use ($type) {
                        $is_free = false;
                        if (($member['platform_1'] === $type && ($member['current_ticket_1'] < $member['concurrent_1'])) ||
                            ($member['platform_2'] === $type && ($member['current_ticket_2'] < $member['concurrent_2'])) ||
                            ($member['platform_3'] === $type && ($member['current_ticket_3'] < $member['concurrent_3'])) ||
                            ($member['platform_4'] === $type && ($member['current_ticket_4'] < $member['concurrent_4'])) ||
                            ($member['platform_5'] === $type && ($member['current_ticket_5'] < $member['concurrent_5']))
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
                           


                            if ($b['platform_1'] === $type) { $b_priority = 1; }
                            else if ($b['platform_2'] === $type) { $b_priority = 2; }
                            else if ($b['platform_3'] === $type) { $b_priority = 3; }
                            else if ($b['platform_4'] === $type) { $b_priority = 4; }
                            else if ($b['platform_5'] === $type) { $b_priority = 5; }

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
            }
         }
        // ดำเนินการต่อไปตามที่ต้องการ
        return response()->json($tweets);
       // return response()->json($tweets);
    }
    public function sendReplyToTweet(Request $request)
    {
       
        $this->getTwitterToken();
        $tweetId = $request->input('tweetId');
        $text = $request->input('text');
        $response = $this->replyToTweet($tweetId, $text);
        // foreach ($tweets as $tweet) {
         // }
        return response()->json($response);
    }

    private function handleChat($body) {
        Log::info($body);
        try {
            $platform_client_id = $body['entry'][0]['id'];
            $customer_id = $body['entry'][0]['messaging'][0]['sender']['id'];
            $platform = Platform::where('platform_id', $platform_client_id)->first();
            if ($platform) {
                $chat = Chats::where('platform_id', $platform->id)
                    ->where('customer_id', $customer_id)
                    ->whereNotIn('status', ['rejected', 'closed'])
                    ->Where('source', 'messenger')
                    ->first();
                if (!$chat) {
                    $user = $this->getUserProfile($customer_id, $platform->platform_secret);
                    $chat = Chats::create([
                        'brand_id' => $platform->brand_id,
                        'platform_id' => $platform->id,
                        'customer_name' => $user['first_name'] . ' ' . $user['last_name'],
                        'customer_id' => $customer_id,
                        'customer_profile' => $user['picture']['data']['url'],
                        'source' => 'messenger',
                    ]);
                    ChatActivities::create([
                        'chat_id' => $chat->id,
                        'action' => 'new',
                        'by_system' => true,
                    ]);
                    // auto assign chat
                    $type = 'messenger';
                    $member = BrandMember::where('brand_id', $platform->brand_id)->where('status', 'active')->with('user');
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
                        });
                    });
                    $list = $member->get()->toArray(JSON_PRETTY_PRINT);
                    $available_list = array_filter($list, function ($member) use ($type) {
                        $is_free = false;
                        if (($member['platform_1'] === $type && ($member['current_ticket_1'] < $member['concurrent_1'])) ||
                            ($member['platform_2'] === $type && ($member['current_ticket_2'] < $member['concurrent_2'])) ||
                            ($member['platform_3'] === $type && ($member['current_ticket_3'] < $member['concurrent_3'])) ||
                            ($member['platform_4'] === $type && ($member['current_ticket_4'] < $member['concurrent_4'])) ||
                            ($member['platform_5'] === $type && ($member['current_ticket_5'] < $member['concurrent_5']))
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

                            if ($b['platform_1'] === $type) { $b_priority = 1; }
                            else if ($b['platform_2'] === $type) { $b_priority = 2; }
                            else if ($b['platform_3'] === $type) { $b_priority = 3; }
                            else if ($b['platform_4'] === $type) { $b_priority = 4; }
                            else if ($b['platform_5'] === $type) { $b_priority = 5; }

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
                if (isset($body['entry'][0]['messaging'][0]['message']['attachments'])) {
                    $att = $body['entry'][0]['messaging'][0]['message']['attachments'];
                    if (isset($att[0]['payload']['sticker_id'])) {
                        $chat->latest_message = 'Send a Sticker';
                    } else {
                        $chat->latest_message = 'Send an Attachment';
                    }
                } else {
                    $chat->latest_message = $body['entry'][0]['messaging'][0]['message']['text'];
                }
                $chat->unread_count += 1;
                $chat->latest_message_time = Carbon::createFromTimestampMs($body['entry'][0]['messaging'][0]['timestamp']);
                $chat->save();
            }
        } catch (\Throwable $th) {
            Log::info($th);
        }
    }

  
    private function handlePost($body) {
        try {
            $platform_client_id = $body['platformId']; //$body['entry'][0]['id'];
            //$customer_id = $body['entry'][0]['changes'][0]['value']['from']['id'];
            $customer_id = $body['userprofile_replay']['id'];
            $customer_name = $body['userprofile_replay']['name'];
            $customer_profile = $body['userprofile_replay']['profile_image_url'];
            $tweet_id = $body['id'];
            $content = json_encode($body, JSON_UNESCAPED_UNICODE);
            $created_at =  date('Y-m-d H:i:s',  strtotime($body['created_at']));
            $createdate = date('Y-m-d H:i:s');
            $conversation_id = $body['conversation_id'];
            if (isset($body['in_reply_to_user_id'])) {
                $in_reply_to_user_id = $body['in_reply_to_user_id'];
            }
            if (isset($body['referenced_tweets'])) {
                foreach ($body['referenced_tweets'] as $referenced_tweets) {
                   $message_type = $referenced_tweets['type'];
                }
            }

            // $post_id = $body['entry'][0]['changes'][0]['value']['post_id'];//postid
            // $parent_id = $body['entry'][0]['changes'][0]['value']['parent_id'];//commentid
            // $verb = $body['entry'][0]['changes'][0]['value']['verb'];
            // if (
            //     $post_id === $parent_id &&
            //     $verb === 'add'
            // ) {
                $platform = Platform::where('platform_id', $platform_client_id)->first();
                if ($platform) {
                   // $user = $this->getUserProfile($customer_id, $platform->platform_secret);
                    $chat = Chats::create([
                        'brand_id' => $platform->brand_id,
                        'platform_id' => $platform->id,
                        'customer_name' => $customer_name,
                        'customer_id' => $customer_id,
                        'customer_profile' => $customer_profile,
                        'source' => 'twitter',
                    ]);
                    ChatActivities::create([
                        'chat_id' => $chat->id,
                        'action' => 'new',
                        'by_system' => true,
                    ]);
                   
                    $post = TwitterPosts::create([
                        'chat_id' => $chat->id,
                        'tweet_id' => $tweet_id,
                        'content' => $content,
                        'created_at' => $created_at,
                        'createdate' => $createdate,
                        'conversation_id' => $conversation_id,
                        'in_reply_to_user_id' => $in_reply_to_user_id,
                        'message_type' => $message_type,
                        
                    ]);
                    $chat->latest_message = $body['text'];
                    $chat->unread_count += 1;
                    $chat->latest_message_time = Carbon::createFromTimestamp($body['created_at']);
                    $chat->save();

                    // auto assign post
                    $type = 'twitter';
                    $member = BrandMember::where('brand_id', $platform->brand_id)->where('status', 'active')->with('user');
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
                        });
                    });
                    $list = $member->get()->toArray(JSON_PRETTY_PRINT);
                    $available_list = array_filter($list, function ($member) use ($type) {
                        $is_free = false;
                        if (($member['platform_1'] === $type && ($member['current_ticket_1'] < $member['concurrent_1'])) ||
                            ($member['platform_2'] === $type && ($member['current_ticket_2'] < $member['concurrent_2'])) ||
                            ($member['platform_3'] === $type && ($member['current_ticket_3'] < $member['concurrent_3'])) ||
                            ($member['platform_4'] === $type && ($member['current_ticket_4'] < $member['concurrent_4'])) ||
                            ($member['platform_5'] === $type && ($member['current_ticket_5'] < $member['concurrent_5']))
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
                           


                            if ($b['platform_1'] === $type) { $b_priority = 1; }
                            else if ($b['platform_2'] === $type) { $b_priority = 2; }
                            else if ($b['platform_3'] === $type) { $b_priority = 3; }
                            else if ($b['platform_4'] === $type) { $b_priority = 4; }
                            else if ($b['platform_5'] === $type) { $b_priority = 5; }

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
            // } else if (
            //     $post_id !== $parent_id &&
            //     $verb === 'add'
            // ) {
            //     $post = FacebookPosts::where('comment_id', $parent_id)->first();
            //     if ($post) {
            //         $chat = Chats::findOrFail($post->chat_id);
            //         $chat->latest_message = $body['entry'][0]['changes'][0]['value']['message'];
            //         $chat->unread_count += 1;
            //         $chat->latest_message_time = Carbon::createFromTimestamp($body['entry'][0]['changes'][0]['value']['created_time']);
            //         $chat->save();
            //     }
            // }
            return true;
        } catch (\Throwable $th) {
            Log::info($th);
            return false;
        }
    }

    public function hooks(Request $request)
    {
        try {
            $body = $request->all();
            // handle chat message
            if (isset($body['entry'][0]['messaging'])) {
                $this->handleChat($body);
            }

            if (
                isset($body['entry'][0]['changes']) &&
                ($body['entry'][0]['changes'][0]['field'] === 'feed') &&
                ($body['entry'][0]['id'] !== $body['entry'][0]['changes'][0]['value']['from']['id']) &&
                isset($body['entry'][0]['changes'][0]['value']['message'])
            ) {
                Log::info($request->all());
                $this->handlePost($body);
            }
            return true;
        } catch (\Throwable $th) {
            Log::info($th);
            return false;
        }
    }



   


}
