<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\ChatActivities;
use App\Models\Chats;
use App\Models\ReportOverallPerformance;
use App\Models\UserStatusLog;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\BrandMember;

use DB;

class ReportController extends Controller
{
    public function overallPerformance(Request $request)
    {
        $query = $request->all();
        $platform_id = $query['platform_id'] ?? '';
        $brand_id = $query['brand_id'] ?? '';
        $date_start = $query['date_start'] ?? Carbon::now();
        $date_end = $query['date_end']  ?? Carbon::now();

        $date_start = Carbon::parse($date_start);
        $date_start_d = $date_start->format('Y-m-d');
        $date_start_h = $date_start->format('H');
        $date_start_m = $date_start->format('i');
        if ($date_start_m < 31) {
            $date_start_m = 0;
        } else {
            $date_start_m = 31;
        }
        

        $date_end = Carbon::parse($date_end);
        $date_end_d = $date_end->format('Y-m-d');
        $date_end_h = $date_end->format('H');
        $date_end_m = $date_end->format('i');
        if ($date_end_m < 31) {
            $date_end_m = 30;
        } else {
            $date_end_m = 0;
            if ($date_end_h == 23) {
                // $date_end_h = 0;
                // $date_end_d = $date_end->addDays(1)->format('Y-m-d');
                $date_end_m = 59;
            } else {
                $date_end_h = $date_end_h + 1;
            }
        }


        $startDate = Carbon::parse($date_start_d . '  '.$date_start_h . ':' . $date_start_m . ':00');
        $endDate = Carbon::parse($date_end_d . '  '.$date_end_h . ':' . $date_end_m . ':00');

        $result = [];
        if (!empty($platform_id)) {
            $result = ReportOverallPerformance::where('date_start', '>=',  Carbon::parse($date_start))
                ->where('date_end', '<=',  $endDate)
                ->where('platform_id', $platform_id)
                ->where('brand_id', $brand_id)
                ->get()
                ->toArray(JSON_PRETTY_PRINT);
        } else {
            $result = ReportOverallPerformance::where('date_start', '>=',  Carbon::parse($date_start))
                ->where('date_end', '<=',  $endDate)
                ->where('brand_id', $brand_id)
                ->select('*',
                    DB::raw('sum(total_incoming_chat) as total_incoming_chat'),
                    DB::raw('sum(total_chat_handled) as total_chat_handled'),
                    DB::raw('sum(total_no_response) as total_no_response'),
                    DB::raw('sum(total_no_assigned) as total_no_assigned'),
                    DB::raw('sum(total_abandon) as total_abandon'),
                    DB::raw('sum(total_chat_rejected) as total_chat_rejected'),
                    DB::raw('sum(avg_chat_handling_time) as avg_chat_handling_time'),
                    DB::raw('sum(avg_chat_response_time) as avg_chat_response_time'),
                    DB::raw('sum(avg_waiting_time_in_queue) as avg_waiting_time_in_queue'),
                    DB::raw('sum(percent_sla)/count(id) as percent_sla'),
                    DB::raw('sum(percent_sla_messenger)/count(id) as percent_sla_messenger'),
                    DB::raw('sum(percent_sla_facebook)/count(id) as percent_sla_facebook'),
                    DB::raw('sum(percent_sla_line)/count(id) as percent_sla_line'),
                    DB::raw('sum(percent_sla_pantip)/count(id) as percent_sla_pantip'),
                    )
                ->groupBy('date_start')
                ->get()
                ->toArray(JSON_PRETTY_PRINT);
        }


        $timeStart = Carbon::parse($startDate);
        $timeEnd = Carbon::parse($endDate);
        $resultFormat = [];
        foreach ($result as $key => $value) {
            $itemTimeStart = Carbon::parse($value['date_start']);
            $itemTimeEnd = Carbon::parse($value['date_end']);
            $itemTimeKey = Carbon::parse($value['date_start'])->format('H:i') . ' - ' . Carbon::parse($value['date_end'])->format('H:i');

            if ($itemTimeStart >= $timeStart && $itemTimeEnd <= $timeEnd) {
                if (!empty($resultFormat[$itemTimeKey])) {
                    array_push($resultFormat[$itemTimeKey], $value);
                } else {
                    $resultFormat[$itemTimeKey] = [$value];
                }
            }
        }


        $time = [];
        foreach ($resultFormat as $key => $val) {
            array_push($time, $key);
        }

        array_multisort($time, SORT_ASC, $resultFormat);
        return response()->json([
            'data' => $resultFormat, 
            'timeStart' => $startDate,
            'timeEnd' => $endDate
        ]);
    }
    
    
    public function scriptOverallPerformance()
    {
        $now = Carbon::now();
        $currH = $now->format('H');
        $currM = $now->format('i');

        $startD = $now->format('Y-m-d');
        // $startD = '2023-11-25';
        $startH = '';
        $startM = '';
        $endD = $now->format('Y-m-d');
        // $endD = '2023-11-25';
        $endH = '';
        $endM = '';


        // scrip run xx.15 , xx.45

        // $currH = 22;
        // $currM = 00; 

        if ($currH == 0 && $currM > 0 && $currM < 31) {
                $startH = 23;
                $startM = 31;
                $startD = Carbon::yesterday()->format('Y-m-d');
    
                $endH = $currH;
                $endM = 0;
        } else if($currH != 0 && $currM > 0 && $currM < 31) {
            $startH = $currH  - 1;
            $startM = 31;

            $endH = $currH;
            $endM = 0;
        } else {
            $startH = $currH;
            $startM = 1;

            $endH = $currH;
            $endM = 30;
        }


        $startDate = Carbon::parse($startD . '  '.$startH . ':' . $startM . ':00');
        $endDate = Carbon::parse($endD . '  '.$endH . ':' . $endM . ':00');

        $chatResult = ChatActivities::whereBetween('chat_activities.created_at', [$startDate, $endDate])
            ->leftJoin('chats', 'chats.id', '=', 'chat_activities.chat_id')
            ->select([
                'chat_activities.*',
                'chats.brand_id as brand_id',
                'chats.source as source',
                'chats.platform_id as platform_id',
            ])
            ->whereNotNull('chats.brand_id')
            ->orderBy('chat_activities.created_at', 'desc')
            ->orderBy('chat_activities.id', 'desc')
            ->get();
        $chatData = $chatResult->toArray(JSON_PRETTY_PRINT);

        $dataPerBrand = $this->groupData($chatData, 'brand_id');
        foreach ($dataPerBrand as $brand_id => $chatsPerBrand) {
            $dataPerPlatform = $this->groupData($chatsPerBrand, 'platform_id');
            foreach ($dataPerPlatform as $platform_id => $chats) {
            
                $chatsPerID = $this->groupData($chats, 'chat_id');
                $result = [
                    'brand_id' =>  $brand_id,
                    'platform_id' =>  $platform_id,
                    'date_start' =>  $startDate,
                    'date_end' =>  $endDate,
                    'total_incoming_chat' => count($chatsPerID)
                ];

                $countHandleChat = 0;
                $countChatNoResponse = 0;
                $countChatNoAssign = 0;
                $countChatAbandon = 0;
                $countChatRejected = 0;


                $totalTimeHandleChat = 0;
                $countTimeHandleChat = 0;
                $totalTimeResponseChat = 0;
                $countTimeResponseChat = 0;
                $totalWaitingTimeInQueue = 0;
                $countWaitingTimeInQueue = 0;

                $totalReply = 0;
                $totalSla = 0;
                $totalReplyMessenger = 0;
                $totalSlaMessenger = 0;
                $totalReplyFacebook = 0;
                $totalSlaFacebook = 0;
                $totalReplyLine = 0;
                $totalSlaLine = 0;
                $totalReplyPantip = 0;
                $totalSlaPantip = 0;


                $minuteSLA = 2;

                foreach ($chatsPerID as $chatID => $chats) {
                    if (!empty($chats)) {

                        if($this->isChatHandle($chats)) {
                            $countHandleChat  += 1;
                        } else if($this->isChatNoResponse($chats)) {
                            $countChatNoResponse  += 1;
                        } else if($this->isNoAssign($chats)) {
                            $countChatNoAssign  += 1;
                        }  else if($this->isAbandon($chats)) {
                            $countChatAbandon  += 1;
                        } 
                        if($this->isRejected($chats)) {
                            $countChatRejected  += 1;
                        }
                     
                        $timeHandleChat = $this->sumChatHandle($chats);
                        if ($timeHandleChat > 0) {
                            $countTimeHandleChat  += 1;
                            $totalTimeHandleChat += $timeHandleChat;
                        }


                        $timeResponseChat = $this->sumChatResponse($chats);
                        if ($timeResponseChat > 0) {
                            $countTimeResponseChat  += 1;
                            $totalTimeResponseChat += $timeResponseChat;
                        }

                        
                        $waitingTimeInQueue = $this->sumWaitingTimeInQueue($chats);
                        if ($waitingTimeInQueue > 0) {
                            $countWaitingTimeInQueue  += 1;
                            $totalWaitingTimeInQueue += $waitingTimeInQueue;
                        }

                        $timeReply =  $this->calSLA($chats);
                        if ($timeReply > 0) {
                            $totalReply += 1;
                            if ($timeReply <= $minuteSLA) {
                                $totalSla += 1;
                            }
                        }

                        $timeReplyFacebook =  $this->calSLA($chats, 'facebook');
                        if ($timeReplyFacebook > 0) {
                            $totalReplyFacebook += 1;
                            if ($timeReplyFacebook <= $minuteSLA) {
                                $totalSlaFacebook += 1;
                            }
                        }

                        $timeReplyMessenger =  $this->calSLA($chats, 'messenger');
                        if ($timeReplyMessenger > 0) {
                            $totalReplyMessenger += 1;
                            if ($timeReplyMessenger <= $minuteSLA) {
                                $totalSlaMessenger += 1;
                            }
                        }

                        $timeReplyLine =  $this->calSLA($chats, 'line');
                        if ($timeReplyLine > 0) {
                            $totalReplyLine += 1;
                            if ($timeReplyLine <= $minuteSLA) {
                                $totalSlaLine += 1;
                            }
                        }

                        $timeReplyPantip =  $this->calSLA($chats, 'pantip');
                        if ($timeReplyPantip > 0) {
                            $totalReplyPantip += 1;
                            if ($timeReplyPantip <= $minuteSLA) {
                                $totalSlaPantip += 1;
                            }
                        }
                    }
                }

                $result['total_chat_handled'] = $countHandleChat;
                $result['total_no_response'] = $countChatNoResponse;
                $result['total_no_assigned'] = $countChatNoAssign;
                $result['total_abandon'] = $countChatAbandon;
                $result['total_chat_rejected'] = $countChatRejected;
                $result['avg_chat_handling_time'] = $countTimeHandleChat > 0 ? round($totalTimeHandleChat / $countTimeHandleChat, 2) : 0;
                $result['avg_chat_response_time'] = $countTimeResponseChat > 0 ? round($totalTimeResponseChat / $countTimeResponseChat, 2) : 0;
                $result['avg_waiting_time_in_queue'] = $countWaitingTimeInQueue > 0 ? round($totalWaitingTimeInQueue / $countWaitingTimeInQueue, 2) : 0;
                $result['percent_sla'] = $totalReply > 0 ? round($totalSla / $totalReply, 2) * 100 : 0;
                $result['percent_sla_messenger'] = $totalReplyMessenger > 0 ? round($totalSlaMessenger / $totalReplyMessenger, 2) * 100 : 0;
                $result['percent_sla_facebook'] = $totalReplyFacebook > 0 ? round($totalSlaFacebook / $totalReplyFacebook, 2) * 100 : 0;
                $result['percent_sla_line'] = $totalSlaLine > 0 ? round($totalSlaLine / $totalSlaLine, 2) * 100 : 0;
                $result['percent_sla_pantip'] = $totalSlaPantip > 0 ? round($totalSlaPantip / $totalSlaPantip, 2) * 100 : 0;

                $result = ReportOverallPerformance::create($result);
            }
        }
        return;
    }

    public function groupData($data, $keyData)
    {
        $result = [];
        foreach ($data as $key => $item) {
            $result[$item[$keyData]][] = $item;
        }
        return $result;
    }

    public function isChatHandle($chats)
    {
        // replied -> assigned, closed, rejected
        $lastChat = $chats[0];
        if(in_array($lastChat['action'], ['replied', 'assigned', 'closed', 'rejected'])) {
            $chatResult = ChatActivities::where('chat_id', $lastChat['chat_id'])
                ->where('action', 'replied')
                ->whereDate('created_at', '<=',  $lastChat['created_at'])
                ->get();
            $chatResult = $chatResult->toArray(JSON_PRETTY_PRINT);
            if(!empty($chatResult)) {
                return true;
            }
        } 
        return false;
    }

    public function isChatNoResponse($chats)
    {
        //  assigned with no replied
        $lastChat = $chats[0];
        if($lastChat['action'] === 'assigned') {
            // $chatResult = ChatActivities::where('chat_id', $lastChat['chat_id'])
            //     ->where('action', 'replied')
            //     ->get();
            // $chatResult = $chatResult->toArray(JSON_PRETTY_PRINT);
            // if(empty($chatResult)) {
                return true;
            // }
        } 
        return false;
    }

    public function isNoAssign($chats)
    {
        // new with no assign
        $lastChat = $chats[0];
        if($lastChat['action'] === 'new') {
            return true;
        } 
        return false;
    }

    public function isAbandon($chats)
    {
        // new then close
        $lastChat = $chats[0];
        if($lastChat['action'] === 'closed') {
            $chatResult = ChatActivities::where('chat_id', $lastChat['chat_id'])
                ->where('action', '!=', 'closed')
                ->whereDate('created_at', '<=',  $lastChat['created_at'])
                ->get();
                
            $chatResult = $chatResult->toArray(JSON_PRETTY_PRINT);
            if(empty($chatResult) || (count($chatResult) === 1) && $chatResult[0]['action'] == 'new'  ) {
                return true;
            }
        } 
        return false;
    }


    public function isRejected($chats)
    {
        // rejected
        $lastChat = $chats[0];
        if($lastChat['action'] === 'rejected') {
            return true;
        } 
        return false;
    }


    public function sumChatHandle($chats)
    {
        // assigned -> closed
        $found_key = array_search('closed', array_column($chats, 'action'));
        $chat = is_numeric($found_key) ? $chats[$found_key] : [];
        if(!empty($chat)) {
            $chatResult = ChatActivities::where('chat_id', $chat['chat_id'])
                ->where('action', 'assigned')
                ->whereDate('created_at', '<=',  $chat['created_at'])
                ->get();
            $chatResult = $chatResult->toArray(JSON_PRETTY_PRINT);
            if(!empty($chatResult[0])) {
                return $this->getDiffTime($chat['created_at'], $chatResult[0]['created_at']);
            }
        } 
        return 0;
    }


    public function sumChatResponse($chats)
    {
        // assigned -> replied
        $found_key = array_search('replied', array_column($chats, 'action'));
        $chat = is_numeric($found_key) ? $chats[$found_key] : [];
        if(!empty($chat)) {
            $chatResult = ChatActivities::where('chat_id', $chat['chat_id'])
                ->where('action', 'assigned')
                ->whereDate('created_at', '<=',  $chat['created_at'])
                ->get();
            $chatResult = $chatResult->toArray(JSON_PRETTY_PRINT);
            if(!empty($chatResult[0])) {
                return $this->getDiffTime($chat['created_at'], $chatResult[0]['created_at']);
            }
        } 
        return 0;
    }


    public function sumWaitingTimeInQueue($chats)
    {
        // new -> assigned
        $found_key = array_search('assigned', array_column($chats, 'action'));
        $chat = is_numeric($found_key) ? $chats[$found_key] : [];
        if(!empty($chat)) {
            $chatResult = ChatActivities::where('chat_id', $chat['chat_id'])
                ->where('action', 'new')
                ->whereDate('created_at', '<=',  $chat['created_at'])
                ->get();
            $chatResult = $chatResult->toArray(JSON_PRETTY_PRINT);
            if(!empty($chatResult[0])) {
                return $this->getDiffTime($chat['created_at'], $chatResult[0]['created_at']);
            }
        } 
        return 0;
    }


    public function calSLA($chats, $source = '')
    {

 

        // new -> replied in x minute
        $found_key = array_search('replied', array_column($chats, 'action'));
        $chat = is_numeric($found_key) ? $chats[$found_key] : [];

        if(!empty($chat) && !empty($source) && $chat['source'] != $source) {
            // if (!empty($source)) {
            //     $found_key = array_search($source, array_column($chats, 'source'));
            //     $chat = is_numeric($found_key) ? $chats[$found_key] : [];
            // }
            return 0;
        }

        if(!empty($chat)) {
            $chatResult = ChatActivities::where('chat_activities.chat_id', $chat['chat_id'])
                ->where('chat_activities.action', 'new')
                ->whereDate('chat_activities.created_at', '<=',  $chat['created_at'])
                ->leftJoin('chats', 'chats.id', '=', 'chat_activities.chat_id')
                ->select([
                    'chat_activities.*',
                    'chats.brand_id as brand_id',
                    'chats.source as source',
                ]);
            if (!empty($source)) {
                $chatResult = $chatResult->where('chats.source', $source);
            }
            $chatResult =  $chatResult->get();
                $chatResult = $chatResult->toArray(JSON_PRETTY_PRINT);

            if(!empty($chatResult[0])) {
                return $this->getDiffTime($chat['created_at'], $chatResult[0]['created_at']);
            }
        } 
        return 0;
    }



    public function getDiffTime($date1, $date2)
    {
        $diff = (strtotime($date1) - strtotime($date2)) / 60;
        return round($diff, 2);
    }

    //================ AGENT PERFORMANCE

    private function getChatActivities($brand_id, $keyword,  $date_start, $date_end)
    {
        $chatResult = ChatActivities::whereBetween('chat_activities.created_at', [$date_start, $date_end])
            ->leftJoin('chats', 'chats.id', '=', 'chat_activities.chat_id')
            ->leftJoin('users', function ($join) {
                $join->on('users.id', '=', 'chat_activities.actor')
                     ->orOn('users.id', '=', 'chat_activities.to');
            })
            ->select([
                'chat_activities.*',
                'chats.brand_id as brand_id',
                'chats.source as source',
                'users.employee_id as employee_id',
                'users.firstname as firstname',
                'users.lastname as lastname',
            ])
            ->whereNotNull('employee_id')
            ->where('chats.brand_id', $brand_id)
            ->orderBy('chat_activities.created_at', 'desc')
            ->orderBy('chat_activities.id', 'desc');


        if($keyword) {
            $chatResult = $chatResult->where('firstname', 'like', '%' . $keyword . '%')
                ->orWhere('lastname', 'like', '%' . $keyword . '%')
                ->orWhere('employee_id', 'like', '%' . $keyword . '%');
        }

        $chatResult = $chatResult->get();
            
        $chatData = $chatResult->toArray(JSON_PRETTY_PRINT);
        $dataPerUser = $this->groupData($chatData, 'employee_id');
        return  $dataPerUser;   
    }

    public function agentPerformance(Request $request)
    {
        $query = $request->all();
        $brand_id = $query['brand_id'] ?? '';
        $keyword = $query['keyword'] ?? '';
        $date_start = $query['date_start'] ?? Carbon::now();
        $date_end = $query['date_end']  ?? Carbon::now();

        $date_start = Carbon::parse($date_start);
        $date_end = Carbon::parse($date_end);

        $resultData = [];

        $dataChatActivityPerUser = $this->getChatActivities($brand_id, $keyword,  $date_start, $date_end);

        $users = User::where('brand_members.brand_id', $brand_id )
            ->where('users.status', 'active' )
            ->where('brand_members.status', 'active')
            ->leftJoin('brand_members', 'users.id', '=', 'brand_members.user_id')
            ->select([
                'users.id',
                'users.employee_id',
                'users.firstname',
                'users.lastname',
                'users.badge_status',
                'brand_members.brand_id as brand_id',
            ])
            ->get();
        $users = $users->toArray(JSON_PRETTY_PRINT);
        
        foreach ($users as $user) {
            $result = [
                'agent_name' =>  $user['firstname'] . ' ' . $user['lastname'],
                'employee_id' =>  $user['employee_id'],
                'badge_status' =>  $user['badge_status'],
            ];

            $userLogResult = UserStatusLog::whereBetween('created_at', [$date_start, $date_end])
                ->where('user_id', $user['id'])
                ->orderBy('created_at', 'desc')
                ->get();
            $userLogData = $userLogResult->toArray(JSON_PRETTY_PRINT);
           
            if (!empty($userLogData)) {
                $countHandleChat = 0;
                $countChatNoResponse = 0;
                $totalTimeHandleChat = 0;
                $countTimeHandleChat = 0;

                $chatsPerUser = $dataChatActivityPerUser[$user['employee_id']] ?? [];

                if (!empty($chatsPerUser)) {
                    $chatsPerID = $this->groupData($chatsPerUser, 'chat_id');
                    foreach ($chatsPerID as $chatID => $chats) {
                        if (!empty($chats)) {
                            if($this->isChatHandle($chats)) {
                                $countHandleChat  += 1;
                            } else if($this->isChatNoResponse($chats)) {
                                $countChatNoResponse  += 1;
                            }
                        }

                        $timeHandleChat = $this->sumChatHandle($chats);

                        if ($timeHandleChat > 0) {
                            $countTimeHandleChat  += 1;
                            $totalTimeHandleChat += $timeHandleChat;
                        }
                    }
                }

                $total_awc = $this->sumUserLogByStatus($userLogData, 'awc');
                $result['total_chat_handled'] = $countHandleChat;
                $result['total_chat_handling_time'] = $totalTimeHandleChat;
                $result['total_no_response'] = $countChatNoResponse;
                $result['avg_aht_per_chat'] =  $countTimeHandleChat > 0 ? round(($totalTimeHandleChat + $total_awc) / $countTimeHandleChat, 2) : 0;
                $result['total_available'] = $this->sumUserLogByStatus($userLogData, 'available');
                $result['total_awc'] =  $total_awc;
                $result['total_break'] = $this->sumUserLogByStatus($userLogData, 'break');
                $result['total_toilet'] = $this->sumUserLogByStatus($userLogData, 'toilet');
                $result['total_meeting'] = $this->sumUserLogByStatus($userLogData, 'meeting');
                $result['total_consult'] = $this->sumUserLogByStatus($userLogData, 'consult');
                $result['total_training'] = $this->sumUserLogByStatus($userLogData, 'training');
                $result['total_special_assign'] = $this->sumUserLogByStatus($userLogData, 'special_assign');
            } else {
                $result['total_chat_handled'] = 0;
                $result['total_chat_handling_time'] = 0;
                $result['total_no_response'] = 0;
                $result['avg_aht_per_chat'] = 0;
                $result['total_available'] = 0;
                $result['total_awc'] = 0;
                $result['total_break'] = 0;
                $result['total_toilet'] = 0;
                $result['total_meeting'] = 0;
                $result['total_consult'] = 0;
                $result['total_training'] = 0;
                $result['total_special_assign'] = 0;
            }
            array_push($resultData, $result );
        }

        return response()->json($resultData);
    }
    
    public function sumUserLogByStatus($userLogData, $status)
    {
        $totalMinute = 0;
        foreach ($userLogData as $user) {
            if($user['status'] ==  $status) {
                $totalMinute += $this->getDiffTime($user['ended_at'] ?? Carbon::now() , $user['started_at']);
            }
        }
        return $totalMinute;
    }

    // ======== DASHBOARD

    public function totalQueueWaiting(Request $request)
    {
        $query = $request->all();
        $brand_id = $query['brand_id'] ?? '';
        $date_start = $query['date_start'] ?? Carbon::now();
        $date_end = $query['date_end']  ?? Carbon::now();
      
        $date_start = Carbon::parse($date_start);
        $date_end = Carbon::parse($date_end);

        $resultData = [];
     
        $chatResult = ChatActivities::whereBetween('chat_activities.created_at', [$date_start, $date_end])
            ->leftJoin('chats', 'chats.id', '=', 'chat_activities.chat_id')
            ->select([
                'chat_activities.*',
                'chat_activities.id as chat_activities_id',
                'chats.brand_id as brand_id',
                'chats.source as source',
            ])
            ->where('chats.brand_id', $brand_id)
            ->where('chats.status', 'new')
            // ->where('chat_activities.action', 'new')
            ->orderBy('chat_activities.created_at', 'desc')
            ->orderBy('chat_activities.id', 'desc')
            ->get();


        $chatData = $chatResult->toArray(JSON_PRETTY_PRINT);
        $chatsPerSource = $this->groupData($chatData, 'source');
        $result = [];
        foreach ($chatsPerSource as $source => $chats) {
            $chatsPerID = $this->groupData($chats, 'chat_id');
            $count  = 0;
            foreach ($chatsPerID as $chatID => $chat) {
                if ($chat[0]['action'] === 'new') {
                    $count ++;
                }
            }
            array_push($result, [
                "source" => $source,
                "total" =>   $count
            ]);
        }

        return response()->json($result);
    }

    public function memberWithTimeInStatus(Request $request)
    {
        $id = $request->get('brand_id');
        $users = BrandMember::where('brand_id', $id)
            ->leftJoin('users', 'users.id', '=', 'user_id')
            ->select([
                'brand_members.*',
                'users.firstname as firstname',
                'users.lastname as lastname',
                'users.username as username',
                'users.status as user_status',
                'users.email as email',
                'users.role as role',
            ])
            ->orderBy('created_at', 'desc')->get();
        $users = $users->toArray(JSON_PRETTY_PRINT);
    
        foreach ($users as $key => $user) {
            $userStatusLog = UserStatusLog::where('user_id', $user['user_id'])
                ->orderBy('created_at', 'desc')->first();

            $users[$key]['started_at'] = $userStatusLog['started_at'] ?? null;
            $users[$key]['ended_at'] = $userStatusLog['ended_at'] ?? null;
            $users[$key]['time_in_status'] = !empty($userStatusLog['started_at'] ?? null) ? $this->getDiffTime($userStatusLog['ended_at'] ?? Carbon::now() , $userStatusLog['started_at']) : 0;
        }
        return response()->json([
            'members' => $users
        ]);
    }

    public function userTimeInStatus(Request $request)
    {
        $user_id = $request->get('user_id');
        $data = [];
        
        $userStatusLog = UserStatusLog::where('user_id', $user_id)
            ->orderBy('created_at', 'desc')->first();
        $data['started_at'] = $userStatusLog['started_at'];
        $data['ended_at'] = $userStatusLog['ended_at'];
        $data['time_in_status'] = $this->getDiffTime($userStatusLog['ended_at'] ?? Carbon::now() , $userStatusLog['started_at']);
        return response()->json([
            'data' => $data
        ]);
    }


    public function dashboardOverallPerformance(Request $request)
    {
        $query = $request->all();
        $platform_id = $query['platform_id'] ?? '';
        $brand_id = $query['brand_id'] ?? '';
        $user_id = $query['user_id'] ?? '';
        $startDate = $query['date_start'] ?? Carbon::now();
        $endDate = $query['date_end']  ?? Carbon::now();


        $chatResult = ChatActivities::whereBetween('chat_activities.created_at', [$startDate, $endDate])
            ->leftJoin('chats', 'chats.id', '=', 'chat_activities.chat_id')
            ->select([
                'chat_activities.*',
                'chats.brand_id as brand_id',
                'chats.source as source',
                'chats.platform_id as platform_id',
            ])
            ->where('chats.brand_id', $brand_id)
            ->orderBy('chat_activities.created_at', 'desc')
            ->orderBy('chat_activities.id', 'desc');
        
            if (!empty($user_id)) {
                $chatResult = $chatResult->where(function ($query) use ($user_id) {
                    $query->where('actor', $user_id)
                    ->orWhere('to', $user_id);
                });
            }

        $chatResult = $chatResult->get();
        $chatData = $chatResult->toArray(JSON_PRETTY_PRINT);

        $chatsPerID = $this->groupData($chatData, 'chat_id');
        $result = [
            'total_incoming_chat' => count($chatsPerID)
        ];

        $countHandleChat = 0;
        $countChatNoResponse = 0;

        $totalTimeHandleChat = 0;
        $countTimeHandleChat = 0;
        $totalTimeResponseChat = 0;
        $countTimeResponseChat = 0;
        $totalWaitingTimeInQueue = 0;
        $countWaitingTimeInQueue = 0;

        foreach ($chatsPerID as $chatID => $chats) {
            if (!empty($chats)) {
                if($this->isChatHandle($chats)) {
                    $countHandleChat  += 1;
                } else if($this->isChatNoResponse($chats)) {
                    $countChatNoResponse  += 1;
                }

                $timeHandleChat = $this->sumChatHandle($chats);
                if ($timeHandleChat > 0) {
                    $countTimeHandleChat  += 1;
                    $totalTimeHandleChat += $timeHandleChat;
                }

                $timeResponseChat = $this->sumChatResponse($chats);
                if ($timeResponseChat > 0) {
                    $countTimeResponseChat  += 1;
                    $totalTimeResponseChat += $timeResponseChat;
                }

                $waitingTimeInQueue = $this->sumWaitingTimeInQueue($chats);
                if ($waitingTimeInQueue > 0) {
                    $countWaitingTimeInQueue  += 1;
                    $totalWaitingTimeInQueue += $waitingTimeInQueue;
                }            
            }
        }

        $result['total_chat_handled'] = $countHandleChat; //
        $result['total_no_response'] = $countChatNoResponse;  //
        $result['total_chat_handling_time'] = $totalTimeHandleChat;  //
        $result['avg_chat_handling_time'] = $countTimeHandleChat > 0 ? round($totalTimeHandleChat / $countTimeHandleChat, 2) : 0; //
        $result['avg_chat_response_time'] = $countTimeResponseChat > 0 ? round($totalTimeResponseChat / $countTimeResponseChat, 2) : 0; //
        $result['avg_waiting_time_in_queue'] = $countWaitingTimeInQueue > 0 ? round($totalWaitingTimeInQueue / $countWaitingTimeInQueue, 2) : 0; // 


        return response()->json( $result);
    }
}
