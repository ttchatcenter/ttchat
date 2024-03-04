<?php
use App\Exceptions\Error;

/**
 * 500
 */

if (!function_exists('throwServerErrorWhenEmpty')) {
    function throwServerErrorWhenEmpty($value, $message = '')
    {
        if (isEmpty($value)) {
            throw Error::server($message);
        }
    }
}

if (!function_exists('throwServerError')) {
    function throwServerError($message = '')
    {
        throw Error::server($message);
    }
}

/**
 * 404
 */

if (!function_exists('throwNotFoundWhenEmpty')) {
    function throwNotFoundWhenEmpty($value, $message = '')
    {
        if (isEmpty($value)) {
            throw Error::notFound($message);
        }
    }
}

if (!function_exists('throwNotFound')) {
    function throwNotFound($message = '')
    {
        throw Error::notFound($message);
    }
}

/**
 * 400
 */

if (!function_exists('throwBadRequest')) {
    function throwBadRequest($message = '')
    {
        throw Error::badRequest($message);
    }
}

/**
 * custom
 */

if (!function_exists('throwCustomError')) {
    function throwCustomError($message = '', $code = 500)
    {
        throw Error::custom($message, $code);
    }
}