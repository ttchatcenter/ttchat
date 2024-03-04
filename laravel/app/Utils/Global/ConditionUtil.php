<?php

if (!function_exists('isEmpty')) {
    function isEmpty($value)
    {
        if (is_string($value) && $value === '0') {
            return false;
        }

        if (is_int($value) && $value === 0) {
            return false;
        }

        return !isset($value) || empty($value) || is_null($value) || !$value;
    }
}

if (!function_exists('isNotEmpty')) {
    function isNotEmpty($value)
    {
        if (is_string($value) && $value === '0') {
            return true;
        }

        if (is_int($value) && $value === 0) {
            return true;
        }

        return isset($value) && !empty($value) || !is_null($value) && $value;
    }
}

if (!function_exists('hasValue')) {
    function hasValue($value)
    {
        return isNotEmpty($value);
    }
}

if (!function_exists('isExists')) {
    function isExists($value)
    {
        return isNotEmpty($value);
    }
}