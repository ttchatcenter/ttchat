<?php

if (!function_exists('tryCatch')) {
    function tryCatch($callback)
    {
        try {
            return [null, $callback()];
        } catch (\Exception $e) {
            return [$e, null];
        }
    }
}