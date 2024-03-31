<?php

namespace App\Traits;
<<<<<<< HEAD
=======

>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use SmolBlog\OAuth2\Client\Provider\Twitter;
use SmolBlog\OAuth2\Client\Token\AccessToken;
use App\Models\ChatConstant;
<<<<<<< HEAD
use App\Models\TwitterPosts;
use Carbon\Carbon;
=======
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
trait TwitterTrait
{
    ///////////////////////////// คนหาคนที่กล่าวถึง ////////////////////////////////////////////////////  
    public function searchTweets($query,$tweetFields,$max_results,$start_time,$end_time,$media,$userfile,$brandId, $platformId)
    {
<<<<<<< HEAD
        $carbonDateTime = Carbon::parse($start_time)->subHours(7)->toIso8601String();
=======
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
        $client = new Client();
        $url = 'https://api.twitter.com/2/tweets/search/recent';
        try {
           // $twitterBearerToken = ChatConstant::where('code', 1)->value('value');
<<<<<<< HEAD
           $dataconstant = ChatConstant::where('brand_id', $brandId)->first();
            $response = $client->request('GET', $url, [
                'headers' => [
                   // 'Authorization' => 'Bearer ' .env('TWITTER_BEARER_TOKEN')// $twitterBearerToken//env('TWITTER_BEARER_TOKEN'),
                   'Authorization' => 'Bearer ' .$dataconstant->twitter_bearer_token
=======
            $response = $client->request('GET', $url, [
                'headers' => [
                    'Authorization' => 'Bearer ' .env('TWITTER_BEARER_TOKEN')// $twitterBearerToken//env('TWITTER_BEARER_TOKEN'),
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
                ],
                'query' => [
                    'query' => $query,
                    'tweet.fields' => $tweetFields,
                    //'max_results' => $max_results,
                    'media.fields' => $media,
                    'user.fields' => $userfile,
<<<<<<< HEAD
                    'start_time' => $carbonDateTime,
=======
                    'start_time' => $start_time,
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
                    'expansions' => 'author_id,entities.mentions.username,in_reply_to_user_id,referenced_tweets.id.author_id,geo.place_id,edit_history_tweet_ids,attachments.media_keys', 
                ],
            ]);
            $responseData = json_decode($response->getBody()->getContents(), true);
<<<<<<< HEAD
           
            $users = $responseData['includes']['users'];
            //$attachments = $responseData['attachments']['media_keys'][0];
           
            
          // return $user ;
            // foreach ($responseData['data'] as $post) {
            //     // ตรวจสอบว่าโพสต์นี้เป็นการตอบกลับหรือไม่
            //     if (isset($post['referenced_tweets'][0]['type']) && $post['referenced_tweets'][0]['type'] === 'replied_to') {
            //         // หากเป็นการตอบกลับ ให้เพิ่มข้อมูลของการตอบกลับไปยังโพสต์เดียวกัน
            //         $userprofile = $this->getUserProfile($post['author_id'], $users);
            //         $post['userprofile_replay'] = $userprofile;
            //         $post['brandId']=$brandId;
            //         $post['platformId']=$platformId;
            //         $parentPostId = $post['referenced_tweets'][0]['id'];
            //         foreach ($responseData['includes']['tweets'] as $reply) {
            //             if ($reply['id'] === $parentPostId) {
            //                 $reply['userprofile_post'] = $this->getUserProfile($reply['author_id'], $users);
            //                 $post['at_post'] = $reply;
            //                 break;
            //             }
            //         }
            //     } else {
            //         // หากไม่ใช่การตอบกลับ ให้กำหนดค่าของการตอบกลับเป็น null
            //         $post['reply'] = null;
            //     }
            //     // เพิ่มโพสต์ที่ถูกจัดรูปแบบใหม่ลงใน formattedData
            //   if ($post['referenced_tweets'][0]['type'] === 'replied_to') {
            //     $formattedData[] = $post;
            //   }
            // }
            if (isset($responseData['includes']['media'])){
                $attachments = $responseData['includes']['media'];
            }
            foreach ($responseData['data'] as $post) {
                $userprofile = $this->getUserProfile($post['author_id'], $users);
                $media ='';
                $medias =[];
                if (isset($post['attachments']['media_keys'][0]) && isset($responseData['includes']['media'])){
                    foreach ($post['attachments']['media_keys'] as $media_key){
                        
                        $media = $this->getattachments($media_key, $attachments);
                        $medias[] = $media;
                    
                    }
                    $post['media']= $medias;
                }
                //return $media;
                $post['userprofile_replay'] = $userprofile;
                $post['brandId'] = $brandId;
                $post['platformId'] = $platformId;
    
                if (isset($post['referenced_tweets'][0]['type']) && $post['referenced_tweets'][0]['type'] === 'replied_to') {
                    $parentPostId = $post['referenced_tweets'][0]['id'];
                    foreach ($responseData['includes']['tweets'] as $reply) {
                        if ($reply['id'] === $parentPostId) {
                            $replyUserProfile = $this->getUserProfile($reply['author_id'], $users);
                            $replymedia = '';
                            $replymedias = [];
                            if (isset($reply['attachments']['media_keys'][0]) && isset($responseData['includes']['media'])){
                                foreach ($reply['attachments']['media_keys'] as $media_key){
                                    $replymedia = $this->getattachments($media_key, $attachments);
                                    $replymedias[] = $replymedia;
                                }
                            }
                            $post['at_post'] = [
                                'id' => $reply['id'],
                                'text' => $reply['text'],
                                'userprofile_post' => $replyUserProfile,
                                'created_at' => $reply['created_at'],
                                'media' => $replymedias ,
                            ];
=======
            $users = $responseData['includes']['users'];
           // return $user ;
            foreach ($responseData['data'] as $post) {
                // ตรวจสอบว่าโพสต์นี้เป็นการตอบกลับหรือไม่
                if (isset($post['referenced_tweets'][0]['type']) && $post['referenced_tweets'][0]['type'] === 'replied_to') {
                    // หากเป็นการตอบกลับ ให้เพิ่มข้อมูลของการตอบกลับไปยังโพสต์เดียวกัน
                    $userprofile = $this->getUserProfile($post['author_id'], $users);
                    $post['userprofile_replay'] = $userprofile;
                    $post['brandId']=$brandId;
                    $post['platformId']=$platformId;
                    $parentPostId = $post['referenced_tweets'][0]['id'];
                    foreach ($responseData['includes']['tweets'] as $reply) {
                        if ($reply['id'] === $parentPostId) {
                            $reply['userprofile_post'] = $this->getUserProfile($reply['author_id'], $users);
                            $post['at_post'] = $reply;
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
                            break;
                        }
                    }
                } else {
<<<<<<< HEAD
                    $post['at_post'] = null;
                }
    
                $formattedData[] = $post;
            }



=======
                    // หากไม่ใช่การตอบกลับ ให้กำหนดค่าของการตอบกลับเป็น null
                    $post['reply'] = null;
                }
                // เพิ่มโพสต์ที่ถูกจัดรูปแบบใหม่ลงใน formattedData
              if ($post['referenced_tweets'][0]['type'] === 'replied_to') {
                $formattedData[] = $post;
              }
            }
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
            usort($formattedData, function($a, $b) {
                return strtotime($a['created_at']) - strtotime($b['created_at']);
            });

            return $formattedData;
        } catch (\Exception $e) {
            Log::error('Error searching tweets: ' . $e->getMessage());
            return null;
        }
    }
    public function getUserProfile($id, $json)
    {
        foreach ($json as $user) {
            if ($user['id'] == $id) {
                return $user;
        
            }
        }
        return null;
    }
<<<<<<< HEAD
    public function getattachments($id, $json)
    {
        foreach ($json as $achments) {
            if ($achments['media_key'] == $id) {
                return $achments;
        
            }
        }
        return null;
    }
    ///////////////////////////////////////// reply comment //////////////////////////////////////
    public function replyToTweet($tweetId, $text,$twitterBearerToken)
    {
       ////$twitterBearerToken = ChatConstant::where('code', 1)->value('value');
=======
    ///////////////////////////////////////// reply comment //////////////////////////////////////
    public function replyToTweet($tweetId, $text)
    {
        $twitterBearerToken = ChatConstant::where('code', 1)->value('value');
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
        $client = new Client([
            'headers' => [
                'Authorization' => 'Bearer ' . $twitterBearerToken,
                'Content-Type' => 'application/json',
            ],
        ]);
        $jsonData = json_encode([
            'text' => $text,
            'reply' => [
                'in_reply_to_tweet_id' => $tweetId
            ]
        ]);
        $response = $client->post('https://api.twitter.com/2/tweets', [
            'body' => $jsonData, // ใช้ 'body' แทน 'json'
        ]);
        return $response->getBody()->getContents();
    }

<<<<<<< HEAD
    public function replyToTweetMulti($tweetId, $text,$media,$twitterBearerToken)
    {
        $client = new Client([
            'headers' => [
                'Authorization' => 'Bearer ' . $twitterBearerToken,
                // ไม่ต้องระบุ Content-Type อีกต่อไปเพราะเราจะใช้ multipart/form-data
            ],
        ]);
        
        $mediaFiles = [
            [
                'name' => 'media',
                'contents' => fopen('/path/to/image_file_1', 'r'),
                'filename' => 'image_filename_1.jpg',
            ],
            [
                'name' => 'media',
                'contents' => fopen('/path/to/image_file_2', 'r'),
                'filename' => 'image_filename_2.jpg',
            ],
            // เพิ่มข้อมูลของรูปภาพอื่นๆ ตามต้องการ
        ];
        $response = $client->post('https://api.twitter.com/2/tweets', [
            'multipart' => [
                [
                    'name' => 'text',
                    'contents' => $text,
                ],
                [
                    'name' => 'reply',
                    'contents' => json_encode(['in_reply_to_tweet_id' => $tweetId]),
                ], 
                ...$mediaFiles,
            ],
        ]);
        
        return $response->getBody()->getContents();
    }




    public function getComment_tw($chat_id)
    {
        $datapost = TwitterPosts::where('chat_id', $chat_id)->first();
        $dataconstant = ChatConstant::where('brand_id', $datapost->brand_id)->first();
        $client = new Client();
        $url = 'https://api.twitter.com/2/tweets/search/recent';
        try {
           $response = $client->request('GET', $url, [
                'headers' => [
                    //'Authorization' => 'Bearer ' .env('TWITTER_BEARER_TOKEN')// $twitterBearerToken//env('TWITTER_BEARER_TOKEN'),
                    'Authorization' => 'Bearer ' .$dataconstant->twitter_bearer_token
                ],
                'query' => [
                    'query' => 'conversation_id:'.$datapost->conversation_id,
                    'tweet.fields' => 'id,text,author_id,created_at,reply_settings,source,withheld,context_annotations,conversation_id,attachments,edit_controls,geo,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets',
                    //'max_results' => $max_results,
                    'media.fields' => 'duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,non_public_metrics,organic_metrics,promoted_metrics,alt_text,variants',
                    'user.fields' => 'created_at,description,entities,id,location,most_recent_tweet_id,name,pinned_tweet_id,profile_image_url,protected,url,username,verified,verified_type,withheld',
                    //'start_time' => $start_time,
=======
    public function getComment_tw($id)
    {
      
        $client = new Client();
        $url = 'https://api.twitter.com/2/tweets/search/recent';
        try {
         
            // $twitterBearerToken = ChatConstant::where('code', 1)->value('value');
           //https://api.twitter.com/2/tweets/search/recent?tweet.fields=
          // &expansions=author_id,entities.mentions.username,in_reply_to_user_id,referenced_tweets.id.author_id,geo.place_id,edit_history_tweet_ids,attachments.media_keys
           //&query=conversation_id:1770720599855317441
           //&media.fields=

           $response = $client->request('GET', $url, [
                'headers' => [
                    'Authorization' => 'Bearer ' .env('TWITTER_BEARER_TOKEN')// $twitterBearerToken//env('TWITTER_BEARER_TOKEN'),
                ],
                'query' => [
                    'query' => 'conversation_id:'.$id,
                    'tweet.fields' => 'id,text,author_id,created_at,reply_settings,source,withheld,context_annotations,conversation_id,attachments,edit_controls,geo,in_reply_to_user_id,lang,possibly_sensitive,referenced_tweets',
                    //'max_results' => $max_results,
                    'media.fields' => 'duration_ms,height,media_key,preview_image_url,type,url,width,public_metrics,non_public_metrics,organic_metrics,promoted_metrics,alt_text,variants',
                    'user.fields' => $userfile,
                    'start_time' => $start_time,
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
                    'expansions' => 'author_id,entities.mentions.username,in_reply_to_user_id,referenced_tweets.id.author_id,geo.place_id,edit_history_tweet_ids,attachments.media_keys', 
                ],
            ]);
            $responseData = json_decode($response->getBody()->getContents(), true);
            $users = $responseData['includes']['users'];
<<<<<<< HEAD
            //return $responseData;
            if (isset($responseData['includes']['media'])){
                $attachments = $responseData['includes']['media'];
            }
            foreach ($responseData['data'] as $post) {
                $userprofile = $this->getUserProfile($post['author_id'], $users);
                $post['userprofile_replay'] = $userprofile;
                $media ='';
                $medias =[];
                if (isset($post['attachments']['media_keys'][0])){
                    foreach ($post['attachments']['media_keys'] as $media_key){
                        $media = $this->getattachments($media_key, $attachments);
                        if ( $media === null || $media === '' ){
                            $dataposttweet = TwitterPosts::where('tweet_id', $post['id'])->first();
                            $decodedData = json_decode($dataposttweet->content, true);
                            if (isset($decodedData['media'])){
                                $media = $this->getattachments($media_key, $decodedData['media']);
                            }
                        }
                        $medias[] = $media;
                    }
                    $post['media']= $medias;
                }
                
                if (isset($post['referenced_tweets'][0]['type']) && $post['referenced_tweets'][0]['type'] === 'replied_to') {
                    $parentPostId = $post['referenced_tweets'][0]['id'];
                    foreach ($responseData['includes']['tweets'] as $reply) {
                        if ($reply['id'] === $parentPostId) {
                            $replyUserProfile = $this->getUserProfile($reply['author_id'], $users);
                            $replymedia = '';
                            //"media_key": "3_1773327680043409408",
                            $replymedias = [];
                            //return $reply['attachments']['media_keys'][0];
                            if (isset($reply['attachments']['media_keys'][0])){
                                foreach ($reply['attachments']['media_keys'] as $media_key){
                                    $replymedia = $this->getattachments($media_key, $attachments);
                                    if ( $replymedia  === null || $replymedia  === '' ){
                                        $dataposttweet = TwitterPosts::where('tweet_id', $reply['id'])->first();
                                        $decodedData = json_decode($dataposttweet->content, true);
                                        if (isset($decodedData['media'])){
                                            $replymedia  = $this->getattachments($media_key, $decodedData['media']);
                                        }
                                    }
                                    $replymedias[] = $replymedia;
                                }
                            }
                            $post['at_post'] = [
                                'id' => $reply['id'],
                                'text' => $reply['text'],
                                'userprofile_post' => $replyUserProfile,
                                'created_at' => $reply['created_at'],
                                'media' => $replymedias,
                            ];
=======
           // return $user ;
            foreach ($responseData['data'] as $post) {
                // ตรวจสอบว่าโพสต์นี้เป็นการตอบกลับหรือไม่
                if (isset($post['referenced_tweets'][0]['type']) && $post['referenced_tweets'][0]['type'] === 'replied_to') {
                    // หากเป็นการตอบกลับ ให้เพิ่มข้อมูลของการตอบกลับไปยังโพสต์เดียวกัน
                    $userprofile = $this->getUserProfile($post['author_id'], $users);
                    $post['userprofile_replay'] = $userprofile;
                    $post['brandId']=$brandId;
                    $post['platformId']=$platformId;
                    $parentPostId = $post['referenced_tweets'][0]['id'];
                    foreach ($responseData['includes']['tweets'] as $reply) {
                        if ($reply['id'] === $parentPostId) {
                            $reply['userprofile_post'] = $this->getUserProfile($reply['author_id'], $users);
                            $post['at_post'] = $reply;
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
                            break;
                        }
                    }
                } else {
<<<<<<< HEAD
                    $post['at_post'] = null;
                }
    
                if ($post['id'] === $datapost->tweet_id || $post['at_post']['id'] === $datapost->tweet_id ){
                    $formattedData[] = $post;
                }
            }
            
            $redatacomment = [];
            $existingIds = [];
            foreach ($formattedData as $tweetData) {
                // เช็คว่า id มีอยู่ใน array ที่มีอยู่แล้วหรือไม่
                if (!in_array($tweetData['id'], $existingIds)) {
                    $redatacomment[] = [
                        'id' => $tweetData['id'],
                        'text' => $tweetData['text'],
                        'userprofile' => $tweetData['userprofile_replay'],
                        'media' => $tweetData['media'],
                        'created_at' => $tweetData['created_at']
                    ];
                    
                    // เพิ่ม id เข้าไปใน array เพื่อใช้ในการตรวจสอบซ้ำ
                    $existingIds[] = $tweetData['id'];
                }
                // เพิ่มข้อมูลจาก at_post
                if (!in_array($tweetData['at_post']['id'], $existingIds)) {
                    $redatacomment[] = [
                        'id' => $tweetData['at_post']['id'],
                        'text' => $tweetData['at_post']['text'],
                        'userprofile' => $tweetData['at_post']['userprofile_post'],
                        'media' => $tweetData['at_post']['media'],
                        'created_at' => $tweetData['at_post']['created_at']
                    ];
                    $existingIds[] = $tweetData['at_post']['id'];
                }
            }

            usort($redatacomment, function($a, $b) {
                return strtotime($a['created_at']) - strtotime($b['created_at']);
            });
            return $redatacomment;
=======
                    // หากไม่ใช่การตอบกลับ ให้กำหนดค่าของการตอบกลับเป็น null
                    $post['reply'] = null;
                }
                // เพิ่มโพสต์ที่ถูกจัดรูปแบบใหม่ลงใน formattedData
              if ($post['referenced_tweets'][0]['type'] === 'replied_to') {
                $formattedData[] = $post;
              }
            }
            usort($formattedData, function($a, $b) {
                return strtotime($a['created_at']) - strtotime($b['created_at']);
            });

            return $formattedData;
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
        } catch (\Exception $e) {
            Log::error('Error searching tweets: ' . $e->getMessage());
            return null;
        }
<<<<<<< HEAD
=======
        // $method = 'GET';
        // $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        // $path = '/' . $id . '/comments?fields=id,message,attachment,created_time,from,comments,parent{id,message,attachment,created_time,from,comments,is_hidden},is_hidden&access_token=' . $token;

        // $url1 = $url . $path;
        // $client = new Client();
        // $response1 = $client->request($method, $url1);
        // $res1 = json_decode($response1->getBody(), true);
        // return $res1;
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
    }

    /////////////////////////////////////////////get now token /////////////////////////////   
    public function callTwitterApi($authorization_code) {
        $token_url = "https://api.twitter.com/2/oauth2/token";
        $callback_uri =  env('TWITTER_REDIRECT_URI');
        $client_id = env('TWITTER_CLIENT_ID');
        $client_secret = env('TWITTER_CLIENT_SECRET');
        $str = (pack('H*', hash("sha256", env('TWITTER_CODE_CHALLENGE'))));
<<<<<<< HEAD
        // $dataconstant = ChatConstant::where('brand_id', $brand_id)->first();
        // $callback_uri =  $dataconstant->twitter_redirect_url;
        // $client_id =  $dataconstant->twitter_client_id;
        // $client_secret = $dataconstant->twitter_client_secret;
        // $str = (pack('H*', hash("sha256", $dataconstant->twitter_code_challenge)));

=======
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
        $code_verifier = rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
        $authorization = base64_encode("$client_id:$client_secret");
        $header = array("Authorization: Basic {$authorization}","Content-Type: application/x-www-form-urlencoded");
       // $content = "grant_type=authorization_code&code=$authorization_code&client_id=$client_id&code_verifier=$code_verifier&redirect_uri=$callback_uri";
        $content = "grant_type=authorization_code&code=$authorization_code&client_id=$client_id&code_verifier=$code_verifier&redirect_uri=$callback_uri";
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $token_url,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $content
        ));
        $response = curl_exec($curl);
        curl_close($curl);
        return json_decode($response, true);
    }

    //////////////////////////////// get newtoken from reftoken //////////////////
    public function getTwitterToken()
    {
        $TwitterRefreshToken = ChatConstant::where('code', 1)->value('value2');
        $client_id = env('TWITTER_CLIENT_ID');
        $client_secret = env('TWITTER_CLIENT_SECRET');
        $token_url = "https://api.twitter.com/2/oauth2/token";
        $authorization = base64_encode("$client_id:$client_secret");
        $header = array("Authorization: Basic {$authorization}","Content-Type: application/x-www-form-urlencoded");
        $content = "grant_type=refresh_token&client_id=$client_id&refresh_token=".$TwitterRefreshToken;
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $token_url,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $content
        ));
        $response = curl_exec($curl);
        curl_close($curl);

        if ($response === false) {
            //save error  
            $twitterError = curl_error($curl);
            return $twitterError;
        } elseif (isset(json_decode($response)->error)) {
            //save error  
            $twitterError = $response;
            return $twitterError;
        } else {
            //save access_token & refresh_token
            $TwitterAccessToken = json_decode($response)->access_token;
            $TwitterRefreshToken = json_decode($response)->refresh_token;
            ChatConstant::where('code', 1)->update([
                'value' => $TwitterAccessToken,
                'value2' => $TwitterRefreshToken,
                // อัปเดต timestamp ให้เป็นปัจจุบัน
            ]);
            return $TwitterAccessToken;
        }
    }

<<<<<<< HEAD
    public function getReTwitterToken($client_id,$client_secret,$TwitterRefreshToken)
    {
       
       
       
      //  return $client_id.'---------------'.$client_secret.'------------------------'.$TwitterRefreshToken;
       
        $token_url = "https://api.twitter.com/2/oauth2/token";
        $authorization = base64_encode("$client_id:$client_secret");
        $header = array("Authorization: Basic {$authorization}","Content-Type: application/x-www-form-urlencoded");
        $content = "grant_type=refresh_token&client_id=$client_id&refresh_token=".$TwitterRefreshToken;
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $token_url,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $content
        ));
        $response = curl_exec($curl);
        curl_close($curl);
        if ($response === false) {
            //save error  
            $twitterError = curl_error($curl);
            return $twitterError;
        } elseif (isset(json_decode($response)->error)) {
            //save error  
            $twitterError = $response;
            return $twitterError;
        } else {
            //save access_token & refresh_token
            $TwitterAccessToken = json_decode($response)->access_token;
            $TwitterRefreshToken = json_decode($response)->refresh_token;
            ChatConstant::where('code', 1)->update([
                'value' => $TwitterAccessToken,
                'value2' => $TwitterRefreshToken,
                // อัปเดต timestamp ให้เป็นปัจจุบัน
            ]);
            return $TwitterAccessToken;
        }
    }



=======
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
}




   