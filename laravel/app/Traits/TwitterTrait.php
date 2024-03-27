<?php

namespace App\Traits;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use SmolBlog\OAuth2\Client\Provider\Twitter;
use SmolBlog\OAuth2\Client\Token\AccessToken;
use App\Models\ChatConstant;
trait TwitterTrait
{
    ///////////////////////////// คนหาคนที่กล่าวถึง ////////////////////////////////////////////////////  
    public function searchTweets($query,$tweetFields,$max_results,$start_time,$end_time,$media,$userfile,$brandId, $platformId)
    {
        $client = new Client();
        $url = 'https://api.twitter.com/2/tweets/search/recent';
        try {
           // $twitterBearerToken = ChatConstant::where('code', 1)->value('value');
            $response = $client->request('GET', $url, [
                'headers' => [
                    'Authorization' => 'Bearer ' .env('TWITTER_BEARER_TOKEN')// $twitterBearerToken//env('TWITTER_BEARER_TOKEN'),
                ],
                'query' => [
                    'query' => $query,
                    'tweet.fields' => $tweetFields,
                    //'max_results' => $max_results,
                    'media.fields' => $media,
                    'user.fields' => $userfile,
                    'start_time' => $start_time,
                    'expansions' => 'author_id,entities.mentions.username,in_reply_to_user_id,referenced_tweets.id.author_id,geo.place_id,edit_history_tweet_ids,attachments.media_keys', 
                ],
            ]);
            $responseData = json_decode($response->getBody()->getContents(), true);
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
                            break;
                        }
                    }
                } else {
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
    ///////////////////////////////////////// reply comment //////////////////////////////////////
    public function replyToTweet($tweetId, $text)
    {
        $twitterBearerToken = ChatConstant::where('code', 1)->value('value');
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
                    'expansions' => 'author_id,entities.mentions.username,in_reply_to_user_id,referenced_tweets.id.author_id,geo.place_id,edit_history_tweet_ids,attachments.media_keys', 
                ],
            ]);
            $responseData = json_decode($response->getBody()->getContents(), true);
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
                            break;
                        }
                    }
                } else {
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
        } catch (\Exception $e) {
            Log::error('Error searching tweets: ' . $e->getMessage());
            return null;
        }
        // $method = 'GET';
        // $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        // $path = '/' . $id . '/comments?fields=id,message,attachment,created_time,from,comments,parent{id,message,attachment,created_time,from,comments,is_hidden},is_hidden&access_token=' . $token;

        // $url1 = $url . $path;
        // $client = new Client();
        // $response1 = $client->request($method, $url1);
        // $res1 = json_decode($response1->getBody(), true);
        // return $res1;
    }

    /////////////////////////////////////////////get now token /////////////////////////////   
    public function callTwitterApi($authorization_code) {
        $token_url = "https://api.twitter.com/2/oauth2/token";
        $callback_uri =  env('TWITTER_REDIRECT_URI');
        $client_id = env('TWITTER_CLIENT_ID');
        $client_secret = env('TWITTER_CLIENT_SECRET');
        $str = (pack('H*', hash("sha256", env('TWITTER_CODE_CHALLENGE'))));
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

}




   