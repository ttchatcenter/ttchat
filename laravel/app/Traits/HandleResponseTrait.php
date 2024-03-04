<?php

namespace App\Traits;

trait HandleResponseTrait
{
    private function jsonResponse($statusCode, $message, $data = null)
    {
        $code = [
            200 => 'OK',
            201 => 'Created',
            202 => 'Accepted',
            204 => 'No Content',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',
            500 => 'Internal Server Error',
        ];

        $message = $message ?? $code[$statusCode] ?? 'Unknown Error';

        return response()->json([
            'status_code' => $statusCode,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    public function ok($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(200, $message, $data);
    }

    public function created($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(201, $message, $data);
    }

    public function accepted($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(202, $message, $data);
    }

    public function noContent($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(204, $message, $data);
    }

    public function badRequest($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(400, $message, $data);
    }

    public function unauthorized($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(401, $message, $data);
    }

    public function forbidden($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(403, $message, $data);
    }

    public function notFound($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(404, $message, $data);
    }

    public function internalServerError($args = [])
    {
        @[
            'data' => $data,
            'message' => $message,
        ] = $args;

        return $this->jsonResponse(500, $message, $data);
    }
}