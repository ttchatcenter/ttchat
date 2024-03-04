<?php

namespace App\Traits;

use GuzzleHttp\Client;
use Log;

trait LineTrait
{

    public function getUserInfo($id, $token)
    {
        $client = new Client();
        $path = "/profile/" . $id;
        try {
            $response = $client->request(
                'GET',
                env('LINE_API_URL', 'https://api.line.me/v2/bot') . $path,
                [
                    'headers' => ['Authorization' => 'Bearer ' . $token],
                ],
            );
            $res = json_decode($response->getBody(), true);
            return $res;
        } catch (\Throwable $th) {
            Log::info($th);
            return null;
        }
    }

    public function checkFile($id, $token)
    {
        $client = new Client();
        $path = "/message/" . $id . "/content/transcoding";
        try {
            $response = $client->request(
                'GET',
                env('LINE_RESOURCE_API_URL', 'https://api-data.line.me/v2/bot') . $path,
                [
                    'headers' => ['Authorization' => 'Bearer ' . $token],
                ],
            );
            $res = json_decode($response->getBody(), true);
            return $res;
        } catch (\Throwable $th) {
            Log::info($th);
            return false;
        }
    }

    public function getMessageContent($id, $token, $bypass = false)
    {
        if (!$bypass) {
            $processingFile = true;
            while($processingFile) {
                $result = $this->checkFile($id, $token);
                $processingFile = $result['status'] !== 'succeeded';
                if ($processingFile) {
                    sleep(3);
                }
            }
        }
        $client = new Client();
        $path = "/message/" . $id . "/content";
        try {
            $response = $client->request(
                'GET',
                env('LINE_RESOURCE_API_URL', 'https://api-data.line.me/v2/bot') . $path,
                [
                    'headers' => ['Authorization' => 'Bearer ' . $token],
                ],
            );
            $res = $response->getBody();
            return $res;
        } catch (\Throwable $th) {
            Log::info($th);
            return null;
        }
    }

    public function replied($id, $token, $text, $is_image)
    {
        $client = new Client();
        $path = "/message/push";
        $data['to'] = $id;
        if ($is_image) {
            $data['messages'][0]['type'] = 'image';
            $data['messages'][0]['originalContentUrl'] = $text;
            $data['messages'][0]['previewImageUrl'] = $text;
        } else {
            $data['messages'][0]['type'] = 'text';
            $data['messages'][0]['text'] = $text;
        }

        try {
            $response = $client->request(
                'POST',
                env('LINE_API_URL', 'https://api.line.me/v2/bot') . $path,
                [
                    'headers' => ['Authorization' => 'Bearer ' . $token],
                    'json' => $data,
                ],
            );
            $res = json_decode($response->getBody(), true);
            return $res;
        } catch (\Throwable $th) {
            Log::info($th);
            return null;
        }
    }
}
