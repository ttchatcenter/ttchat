<?php

require_once __DIR__ . '/../../../../app/Utils/Global/TryCatchUtil.php';

it('returns the result of the callback if it succeeds', function () {
    $result = tryCatch(function () {
        return 42;
    });

    expect($result)->toEqual([null, 42]);
});

it('returns the exception if the callback throws an exception', function () {
    $result = tryCatch(function () {
        throw new Exception('Something went wrong');
    });

    expect($result[0])->toBeInstanceOf(Exception::class);
    expect($result[1])->toBeNull();
});