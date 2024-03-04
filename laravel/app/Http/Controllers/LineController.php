<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\LineTrait;
use App\Models\Platform;
use App\Models\Chats;
use App\Models\ChatActivities;
use App\Models\BrandMember;
use App\Models\LineChats;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Log;

class LineController extends Controller
{
    use LineTrait;
    //
    public function hook(Request $request, $brandId, $platformId)
    {
        $body = $request->all();
        if ($body['events'][0]['type'] === 'message') {
            $customer_id = $body['events'][0]['source']['userId'];
            $platform = Platform::findOrFail($platformId);

            // handle chat record
            $chat = Chats::where('platform_id', $platformId)
                ->where('customer_id', $customer_id)
                ->whereNotIn('status', ['rejected', 'closed'])
                ->first();
            if (!$chat) {
                $user = $this->getUserInfo($customer_id, $platform->platform_secret);
                $chat = Chats::create([
                    'brand_id' => $brandId,
                    'platform_id' => $platformId,
                    'customer_name' => $user['displayName'],
                    'customer_id' => $customer_id,
                    'customer_profile' => $user['pictureUrl'],
                    'source' => 'line',
                ]);
                ChatActivities::create([
                    'chat_id' => $chat->id,
                    'action' => 'new',
                    'by_system' => true,
                ]);

                // auto assign line
                $type = 'line';
                $member = BrandMember::where('brand_id', $brandId)->where('status', 'active')->with('user');
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
            } else {
                $user = $this->getUserInfo($customer_id, $platform->platform_secret);
                $chat->customer_profile = $user['pictureUrl'];
                $chat->save();
            }
            
            // handle message
            $message = $body['events'][0]['message'];
            if (
                $message['type'] === 'image' ||
                $message['type'] === 'video' ||
                $message['type'] === 'file' ||
                $message['type'] === 'audio'
            ) {
                $content = $this->getMessageContent($message['id'], $platform->platform_secret, $message['type'] === 'file' || $message['type'] === 'image');
                $path = 'public/files/' . $chat->id . '/';
                $file_name = $chat->gen_uuid();
                Storage::put($path . $file_name, $content, 'public');
                LineChats::create([
                    'chat_id' => $chat->id,
                    'type' => $message['type'],
                    'content' => json_encode(array_merge($message, ['link' => url(Storage::url($path . $file_name))])),
                    'sender' => 'user',
                ]);
                $chat->latest_message = 'Send an Attachment';
                $chat->unread_count += 1;
                $chat->latest_message_time = Carbon::now();
            } else if (
                $message['type'] === 'sticker'
            ) {
                LineChats::create([
                    'chat_id' => $chat->id,
                    'type' => $message['type'],
                    'content' => 'https://stickershop.line-scdn.net/stickershop/v1/sticker/'. $message['stickerId'] . '/iPhone/sticker@2x.png',
                    'sender' => 'user',
                ]);
                $chat->latest_message = 'Send a Sticker';
                $chat->unread_count += 1;
                $chat->latest_message_time = Carbon::now();
            } else if (
                $message['type'] === 'text'
            ) {
                LineChats::create([
                    'chat_id' => $chat->id,
                    'type' => $message['type'],
                    'content' => $message['text'],
                    'sender' => 'user',
                ]);
                $chat->latest_message = $message['text'];
                $chat->unread_count += 1;
                $chat->latest_message_time = Carbon::now();
            }
            $chat->save();
        }
        return response()->json(['message' => 'ok'], 200);
    }
}
