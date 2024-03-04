<?php

namespace App\Utils;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class HttpUtil
{
    private static $client;
    private static $options = [];

    private static function getClient()
    {
        if (!self::$client) {
            self::$client = new Client();
        }
        return self::$client;
    }

    public static function get($url): self
    {
        self::$options['method'] = 'GET';
        self::$options['url'] = $url;
        return new self();
    }

    public static function post($url): self
    {
        self::$options['method'] = 'POST';
        self::$options['url'] = $url;
        return new self();
    }

    public static function put($url): self
    {
        self::$options['method'] = 'PUT';
        self::$options['url'] = $url;
        return new self();
    }

    public static function delete($url): self
    {
        self::$options['method'] = 'DELETE';
        self::$options['url'] = $url;
        return new self();
    }

    public function formParams($params): self
    {
        self::$options['form_params'] = $params;
        return $this;
    }

    public function json($data): self
    {
        self::$options['json'] = $data;
        return $this;
    }

    public function query($params): self
    {
        self::$options['query'] = $params;
        return $this;
    }

    public function multipart($data): self
    {
        self::$options['multipart'] = $data;
        return $this;
    }

    public function send(): array
    {
        return $this->sendRequest(self::$options);
    }

    private function sendRequest($options): array
    {
        $client = self::getClient();
        try {
            $response = $client->request($options['method'], $options['url'], $options);
            $response = json_decode($response->getBody()->getContents(), true);
            return [null, $response];
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                return [$e->getResponse()->getBody()->getContents(), null];
            } else {
                return [$e->getMessage(), null];
            }
        }
    }
}