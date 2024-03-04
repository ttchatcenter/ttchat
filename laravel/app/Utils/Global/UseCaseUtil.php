<?php

if (!function_exists('throwIfUseCaseError')) {
    function throwIfUseCaseError($err, $errCode)
    {
        if ($errCode && $err) {
            throwCustomError($err, $errCode);
        }

        if ($err) {
            throwServerError($err);
        }
    }
}
