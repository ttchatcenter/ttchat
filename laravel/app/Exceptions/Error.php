<?php

namespace App\Exceptions;

use Exception;

class Error extends Exception
{
    public static function notFound($message = 'Not Found', int $code = 404): Error
    {
        return new self($message, $code);
    }

    public static function server($message = 'Internal Server Error', int $code = 500): Error
    {
        return new self($message, $code);
    }

    public static function badRequest($message = 'Bad Reqeust', int $code = 400): Error
    {
        return new self($message, $code);
    }

    public static function custom($message = 'Something Wrong', int $code = 500): Error
    {
        return new self($message, $code);
    }
}