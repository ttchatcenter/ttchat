<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chats;
use App\Models\ChatActivities;
use App\Models\BrandMember;
use App\Models\Platform;
use App\Models\FacebookPosts;
use App\Traits\FacebookTrait;
use Carbon\Carbon;
use Log;

class FacebookController extends Controller
{
    use FacebookTrait;
    //
    private $verify_token = 'uJYuWCLpMkzVZd6v';

    public function verifier(Request $request)
    {
        if ($request->input('hub_verify_token') === $this->verify_token) {
            return $request->input('hub_challenge');
        }
        return false;
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
                        });
                    });
                    $list = $member->get()->toArray(JSON_PRETTY_PRINT);
                    $available_list = array_filter($list, function ($member) use ($type) {
                        $is_free = false;
                        if (($member['platform_1'] === $type && ($member['current_ticket_1'] < $member['concurrent_1'])) ||
                            ($member['platform_2'] === $type && ($member['current_ticket_2'] < $member['concurrent_2'])) ||
                            ($member['platform_3'] === $type && ($member['current_ticket_3'] < $member['concurrent_3'])) ||
                            ($member['platform_4'] === $type && ($member['current_ticket_4'] < $member['concurrent_4']))
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
        
                            if ($b['platform_1'] === $type) { $b_priority = 1; }
                            else if ($b['platform_2'] === $type) { $b_priority = 2; }
                            else if ($b['platform_3'] === $type) { $b_priority = 3; }
                            else if ($b['platform_4'] === $type) { $b_priority = 4; }
        
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
            $platform_client_id = $body['entry'][0]['id'];
            $customer_id = $body['entry'][0]['changes'][0]['value']['from']['id'];
            $post_id = $body['entry'][0]['changes'][0]['value']['post_id'];
            $parent_id = $body['entry'][0]['changes'][0]['value']['parent_id'];
            $verb = $body['entry'][0]['changes'][0]['value']['verb'];
            if (
                $post_id === $parent_id &&
                $verb === 'add'    
            ) {
                $platform = Platform::where('platform_id', $platform_client_id)->first();
                if ($platform) {
                    $user = $this->getUserProfile($customer_id, $platform->platform_secret);
                    $chat = Chats::create([
                        'brand_id' => $platform->brand_id,
                        'platform_id' => $platform->id,
                        'customer_name' => $user['first_name'] . ' ' . $user['last_name'],
                        'customer_id' => $customer_id,
                        'customer_profile' => $user['picture']['data']['url'],
                        'source' => 'facebook',
                    ]);
                    ChatActivities::create([
                        'chat_id' => $chat->id,
                        'action' => 'new',
                        'by_system' => true,
                    ]);
                    $post = FacebookPosts::create([
                        'chat_id' => $chat->id,
                        'post_id' => $post_id,
                        'post_url' => $body['entry'][0]['changes'][0]['value']['post']['permalink_url'],
                        'comment_id' => $body['entry'][0]['changes'][0]['value']['comment_id'],
                    ]);
                    $chat->latest_message = $body['entry'][0]['changes'][0]['value']['message'];
                    $chat->unread_count += 1;
                    $chat->latest_message_time = Carbon::createFromTimestamp($body['entry'][0]['changes'][0]['value']['created_time']);
                    $chat->save();

                    // auto assign post
                    $type = 'facebook';
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
                        });
                    });
                    $list = $member->get()->toArray(JSON_PRETTY_PRINT);
                    $available_list = array_filter($list, function ($member) use ($type) {
                        $is_free = false;
                        if (($member['platform_1'] === $type && ($member['current_ticket_1'] < $member['concurrent_1'])) ||
                            ($member['platform_2'] === $type && ($member['current_ticket_2'] < $member['concurrent_2'])) ||
                            ($member['platform_3'] === $type && ($member['current_ticket_3'] < $member['concurrent_3'])) ||
                            ($member['platform_4'] === $type && ($member['current_ticket_4'] < $member['concurrent_4']))
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
        
                            if ($b['platform_1'] === $type) { $b_priority = 1; }
                            else if ($b['platform_2'] === $type) { $b_priority = 2; }
                            else if ($b['platform_3'] === $type) { $b_priority = 3; }
                            else if ($b['platform_4'] === $type) { $b_priority = 4; }
        
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
            } else if (
                $post_id !== $parent_id &&
                $verb === 'add'
            ) {
                $post = FacebookPosts::where('comment_id', $parent_id)->first();
                if ($post) {
                    $chat = Chats::findOrFail($post->chat_id);
                    $chat->latest_message = $body['entry'][0]['changes'][0]['value']['message'];
                    $chat->unread_count += 1;
                    $chat->latest_message_time = Carbon::createFromTimestamp($body['entry'][0]['changes'][0]['value']['created_time']);
                    $chat->save();
                }
            }
        } catch (\Throwable $th) {
            Log::info($th);
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
