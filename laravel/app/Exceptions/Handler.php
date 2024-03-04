<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->renderable(function (ValidationException $exception, $request) {
            return response()->json([
                'message' => 'Validation Errors',
                'errors' => $exception->validator->errors()->all(),
            ], 422);
        });

        $this->renderable(function (Error $e, $request) {
            return response()->json([
                'message' => $e->getMessage()
            ], $e->getCode());
        });

        // $this->renderable(function (Throwable $e, $request) {
        //     return response()->json([
        //         'message' => $e->getMessage(),
        //         'file' => pathinfo($e->getFile(), PATHINFO_FILENAME),
        //         'line' => $e->getLine()
        //     ], 500);
        // });

    }
}