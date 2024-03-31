<?php

namespace App\Traits;

use GuzzleHttp\Client;

trait FacebookTrait
{


    public function longLivedPageAccessToken($fb_exchange_token, $fb_user_id, $fb_id)
    {
        $method = 'GET';
        $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        $grant_type = 'fb_exchange_token';
        $fb_exchange_token = $fb_exchange_token;
        $client_id = env('FACEBOOK_API_CLIENT_ID', '562935812391406');
        $client_secret = env('FACEBOOK_API_CLIENT_SECRET', '4c7293db2aedcfc93ef569aaa92b5e51');

        $url1 = $url . '/oauth/access_token?grant_type=' . $grant_type . '&client_id=' . $client_id . '&client_secret=' . $client_secret . '&fb_exchange_token=' . $fb_exchange_token;
        $client = new Client();
        $response1 = $client->request($method, $url1);
        $res1 = json_decode($response1->getBody(), true);

        $data['user_long_token'] = $res1['access_token'];


        $url2 = $url . '/' . $fb_user_id . '/accounts?access_token=' . $data['user_long_token'];
        $client = new Client();
        $response2 = $client->request($method, $url2);
        $res2 = json_decode($response2->getBody(), true);

        foreach ($res2['data'] as $key => $value) {
            if (array_key_exists('access_token', $value) && $fb_id == $value['id']) {
                $data['page_long_token'] = $value['access_token'];
            }
        }

        return $data;
    }


    public function longLivedPageAccessToken2($fb_exchange_token, $fb_user_id, $fb_id)
    {
        $method = 'GET';
        $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        $grant_type = 'fb_exchange_token';
        $fb_exchange_token = $fb_exchange_token;
        $client_id = env('FACEBOOK_API_CLIENT_ID', '562935812391406');
        $client_secret = env('FACEBOOK_API_CLIENT_SECRET', '4c7293db2aedcfc93ef569aaa92b5e51');

        $url1 = $url . '/oauth/access_token?grant_type=' . $grant_type . '&client_id=' . $client_id . '&client_secret=' . $client_secret . '&fb_exchange_token=' . $fb_exchange_token;
        $client = new Client();
        $response1 = $client->request($method, $url1);
        $res1 = json_decode($response1->getBody(), true);

        $data['user_long_token'] = $res1['access_token'];

        $url3 = $url . '/oauth/client_code' . $data['user_long_token'];

        $url2 = $url . '/' . $fb_user_id . '/accounts?access_token=' . $data['user_long_token'];
        $client = new Client();
        $response2 = $client->request($method, $url2);
        $res2 = json_decode($response2->getBody(), true);

        foreach ($res2['data'] as $key => $value) {
            if (array_key_exists('access_token', $value) && $fb_id == $value['id']) {
                $data['page_long_token'] = $value['access_token'];
            }
        }

        return $data;
    }

    public function replied($id, $token, $message)
    {
        $method = 'POST';
        $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        $path = '/me/messages';

        $data['access_token'] = $token;
        $data['recipient'] = ['id' => $id];
        $data['message'] = ['text' => $message];
        $data['messaging_type'] = 'MESSAGE_TAG';
        $data['tag'] = 'POST_PURCHASE_UPDATE';
        $url1 = $url . $path . '?access_token=' . $token;
        $client = new Client();
        $response1 = $client->request($method, $url1, ['json' => $data]);
        $res1 = json_decode($response1->getBody(), true);
        return $res1;
    }

    public function comment($id, $token, $message)
    {
        $method = 'POST';
        $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        $path = '/' . $id . '/comments';

        $data['access_token'] = $token; 
        $data['message'] = $message;
        $url1 = $url . $path . '?access_token=' . $token;
        $client = new Client();
        $response1 = $client->request($method, $url1, ['json' => $data]);
        $res1 = json_decode($response1->getBody(), true);
        return $res1;
    }

    public function getComment($id, $token)
    {
        $method = 'GET';
        $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        $path = '/' . $id . '/comments?fields=id,message,attachment,created_time,from,comments,parent{id,message,attachment,created_time,from,comments,is_hidden},is_hidden&access_token=' . $token;

        $url1 = $url . $path;
        $client = new Client();
        $response1 = $client->request($method, $url1);
        $res1 = json_decode($response1->getBody(), true);
        return $res1;
    }


    public function getChat($pid, $cid, $token)
    {
        $method = 'GET';
        $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v14.0');
        $path = '/' . $pid . '/conversations??user_id=' . $cid . '&fields=senders,messages.limit(100){message,from,created_time,sticker,attachments{image_data,video_data,file_url,name}}&limit=1&access_token=' . $token;

        $url1 = $url . $path;
        $client = new Client();
        $response1 = $client->request($method, $url1);
        $res1 = json_decode($response1->getBody(), true);
        return $res1;
    }

    public function getUserProfile($id, $token)
    {
        try {
            $method = 'GET';
            $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v18.0');
            $client_id = env('FACEBOOK_API_CLIENT_ID', '562935812391406');
            $client_secret = env('FACEBOOK_API_CLIENT_SECRET', '4c7293db2aedcfc93ef569aaa92b5e51');
            $path = '/' . $id . '/';

            $url1 = $url . $path . '?access_token=' . $token . '&fields=first_name,last_name,picture.width(48).height(48)&client_id=' . $client_id . '&client_secret=' . $client_secret;
            $client = new Client();
            $response1 = $client->request($method, $url1);
            $res1 = json_decode($response1->getBody(), true);
            return $res1;
        } catch (\Throwable $th) {
            return ['profile_pic' => null];
        }
    }

    public function getPost($id, $token)
    {
        try {
            $method = 'GET';
            $url = env('FACEBOOK_API_URL', 'https://graph.facebook.com/v18.0');
            $client_id = env('FACEBOOK_API_CLIENT_ID', '562935812391406');
            $client_secret = env('FACEBOOK_API_CLIENT_SECRET', '4c7293db2aedcfc93ef569aaa92b5e51');
            $path = '/' . $id . '';

            $url1 = $url . $path . '?access_token=' . $token . '&fields=full_picture,message,created_time&client_id=' . $client_id . '&client_secret=' . $client_secret;
            $client = new Client();
            $response1 = $client->request($method, $url1);
            $res1 = json_decode($response1->getBody(), true);
            return $res1;
        } catch (\Throwable $th) {
            return ['profile_pic' => null];
        }
    }
}
