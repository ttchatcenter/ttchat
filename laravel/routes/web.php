<?php
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginTwitterController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    // return view('welcome');
    return response()->json(['url' => URL::current()], 200);
});
<<<<<<< HEAD
//Route::get('twitter/auth', [LoginTwitterController::class, 'getAuthorizationCode'])->name('twitter.auth');
Route::get('twitter/auth/{brand_id}', [LoginTwitterController::class, 'getAuthorizationCode'])->name('twitter.auth');
=======
Route::get('twitter/auth', [LoginTwitterController::class, 'getAuthorizationCode'])->name('twitter.auth');
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
Route::get('twitter/callback', [LoginTwitterController::class, 'handleCallback'])->name('twitter.callback');


