<?php

namespace App\Utils;

use App\Traits\ErrorHandlerTrait;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Log;

class FacebookApiUtil
{
    use ErrorHandlerTrait;

    const FB_API_URL = 'https://graph.facebook.com/v18.0/';
    private $http;

    public function __construct()
    {
        $this->http = new Client([
            'base_uri' => self::FB_API_URL
        ]);
    }

    public function subscribePage($pageId, $accessToken, $fields = [])
    {
        $fields = implode(',', $fields);

        try {
            $response = $this->http->post("$pageId/subscribed_apps", [
                'query' => [
                    'access_token' => $accessToken
                ],
                'json' => [
                    'subscribed_fields' => $fields
                ]
            ]);
            $res = json_decode($response->getBody(), true);
            $this->success($res['success']);
        } catch (RequestException $e) {
            $response = $e->getResponse();
            Log::info($response);
            $res = json_decode($response->getBody(), true);
            $err = match ($res['error']['code']) {
                100 => 'Invalid parameter',
                200 => 'Permission error',
                210 => 'User not visible',
                default => 'Unknown error'
            };
            $this->error($err);
        }

        return $this->error("failed subscribe $pageId");
    }

    public function unsubscribePage($pageId, $accessToken)
    {
        try {
            $response = $this->http->delete("$pageId/subscribed_apps", [
                'query' => [
                    'access_token' => $accessToken
                ]
            ]);
            $res = json_decode($response->getBody(), true);
            $this->success($res['success']);
        } catch (RequestException $e) {
            $response = $e->getResponse();
            $res = json_decode($response->getBody(), true);
            $this->error($res['error']['message']);
        }

        return $this->error("failed unsubscribe $pageId");
    }
}