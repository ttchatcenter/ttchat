<?php

namespace App\Providers;

use App\Mocks\SocialCommentMock;
use Illuminate\Support\ServiceProvider;
use Opcodes\LogViewer\Facades\LogViewer;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        LogViewer::auth(function ($request) {
            // check env local return true
            if (app()->environment('local')) {
                return true;
            }

            // api ของ side bar
            if (strpos($request->url(), '/log-viewer/api/') !== false) {
                // check same site return true
                $referer = $request->headers->get('referer');
                $refererHost = parse_url($referer, PHP_URL_HOST);
                $requestHost = $request->getHost();
                if ($refererHost === $requestHost) {
                    return true;
                }

                return false;
            }

            // ถ้าจะเปลี่ยนรหัส ใช้ \Hash::make แล้วเอามาใส่ใหม่
            $sessionKey = 'can-access-log-viewer';
            $pwd = $request->input('pwd');
            $encryptPwd = '$2y$10$kYelKmIGQL368QUfj6125e0itv5BRgJR7Nst9IJQunGsEqdq5qNlW';
            $passes = \Hash::check($pwd, $encryptPwd);
            $clear = $request->input('clear');

            if ($clear) {
                session()->forget($sessionKey);
                return false;
            }

            if (session($sessionKey)) {
                return true;
            }

            if ($passes) {
                session([$sessionKey => true]);
                return true;
            } else {
                session()->forget($sessionKey);
                return false;
            }
        });
    }
}