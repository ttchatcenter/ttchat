<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\BrandMemberController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\PantipTagController;
use App\Http\Controllers\LineController;
use App\Http\Controllers\ChatsController;
use App\Http\Controllers\LineChatsController;
use App\Http\Controllers\FacebookController;
use App\Http\Controllers\FacebookChatsController;
use App\Http\Controllers\FacebookPostsController;
use App\Http\Controllers\ChatQuickReplyController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubcategoryLevel1Controller;
use App\Http\Controllers\SubcategoryLevel2Controller;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RejectController;
use App\Http\Controllers\TwitterController;
use App\Http\Controllers\TwitterMassageController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
    'middleware' => 'api',
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', 'AuthController@login')->name('login');
    Route::delete('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::get('user', 'AuthController@user');
    Route::delete('user', 'AuthController@deleteUser');
    Route::post('forgot-password', 'AuthController@forgotPassword')->name('forget.password.post');
    Route::post('reset-password', 'AuthController@resetPassword')->name('reset.password.post');
});

Route::get('fb/callback', [FacebookController::class, 'verifier']);
Route::post('fb/callback', [FacebookController::class, 'hooks']);

Route::post('line/webhook/{brandId}/{platformId}', [LineController::class, 'hook']);

Route::middleware(['auth:api', 'update.user'])->group(function () {
    Route::get('user', [UserController::class, 'index']);
    Route::put('user/status', [UserController::class, 'updateBadgeStatus']);
    Route::get('user/{id}', [UserController::class, 'show']);
    Route::put('user/{id}/profile', [UserController::class, 'updateProfile']);
    Route::put('user/{id}', [UserController::class, 'update']);

    Route::get('brand', [BrandController::class, 'index']);
    Route::post('brand/crm', [ChatsController::class, 'crm']);
    Route::get('brand/{id}', [BrandController::class, 'show']);
    Route::post('brand', [BrandController::class, 'store']);
    Route::get('brand/{id}/crm', [ChatsController::class, 'getCrm']);
    Route::put('brand/{id}/logo', [BrandController::class, 'updateLogo']);
    Route::get('brand/{id}/assignee', [BrandController::class, 'getAssignee']);
    Route::put('brand/{id}', [BrandController::class, 'update']);

    Route::get('brand-member', [BrandMemberController::class, 'index']);
    Route::get('brand-member/{id}', [BrandMemberController::class, 'show']);
    Route::post('brand-member', [BrandMemberController::class, 'store']);
    Route::put('brand-member/{id}', [BrandMemberController::class, 'update']);

    Route::get('platform', [PlatformController::class, 'index']);
    Route::get('platform/check', [PlatformController::class, 'check']);
    Route::get('platform/{id}', [PlatformController::class, 'show']);
    Route::post('platform/facebook', [PlatformController::class, 'storeFacebook']);
    Route::post('platform', [PlatformController::class, 'store']);
    Route::put('platform/{id}', [PlatformController::class, 'update']);
    Route::delete('platform/{id}', [PlatformController::class, 'delete']);

    Route::get('pantip-tag', [PantipTagController::class, 'index']);
    Route::get('pantip-tag/{id}', [PantipTagController::class, 'show']);
    Route::post('pantip-tag', [PantipTagController::class, 'store']);
    Route::put('pantip-tag/{id}', [PantipTagController::class, 'update']);

    Route::get('chat', [ChatsController::class, 'index']);
    Route::post('chat/image', [ChatsController::class, 'uploadImage']);
    Route::post('chat/{id}/seen', [ChatsController::class, 'seen']);
    Route::post('chat/{id}/note', [ChatsController::class, 'updateNote']);
    Route::post('chat/{id}/assign', [ChatsController::class, 'assign']);
    Route::post('chat/{id}/close', [ChatsController::class, 'close']);
    Route::post('chat/{id}/reject', [ChatsController::class, 'reject']);
    Route::get('chat/{id}/activities', [ChatsController::class, 'getActivities']);
    Route::get('chat/{id}/tags', [ChatsController::class, 'getTags']);
    Route::post('chat/{id}/tags', [ChatsController::class, 'createTags']);
    

    Route::get('line-chat/{id}', [LineChatsController::class, 'index']);
    Route::post('line-chat/{id}', [LineChatsController::class, 'store']);

    Route::get('facebook-post/{id}', [FacebookPostsController::class, 'index']);
    Route::post('facebook-post/{id}', [FacebookPostsController::class, 'reply']);

    Route::post('messenger-chat/{id}', [FacebookChatsController::class, 'reply']);

    Route::get('chat-quick-reply', [ChatQuickReplyController::class, 'getList']);
    Route::post('chat-quick-reply', [ChatQuickReplyController::class, 'create']);
    Route::get('chat-quick-reply/{id}', [ChatQuickReplyController::class, 'get']);
    Route::delete('chat-quick-reply/{id}', [ChatQuickReplyController::class, 'delete']);
    Route::put('chat-quick-reply/{id}', [ChatQuickReplyController::class, 'update']);

    Route::get('rejects', [RejectController::class, 'index']);

    Route::get('category', [CategoryController::class, 'list']);
    Route::post('category', [CategoryController::class, 'create']);
    Route::put('category/{id}', [CategoryController::class, 'update']);
    Route::delete('category/{id}', [CategoryController::class, 'delete']);

    Route::get('subcategory-level1', [SubcategoryLevel1Controller::class, 'list']);
    Route::post('subcategory-level1', [SubcategoryLevel1Controller::class, 'create']);
    Route::put('subcategory-level1/{id}', [SubcategoryLevel1Controller::class, 'update']);
    Route::delete('subcategory-level1/{id}', [SubcategoryLevel1Controller::class, 'delete']);

    Route::get('subcategory-level2', [SubcategoryLevel2Controller::class, 'list']);
    Route::post('subcategory-level2', [SubcategoryLevel2Controller::class, 'create']);
    Route::put('subcategory-level2/{id}', [SubcategoryLevel2Controller::class, 'update']);
    Route::delete('subcategory-level2/{id}', [SubcategoryLevel2Controller::class, 'delete']);

    Route::get('report/overall-performance', [ReportController::class, 'overallPerformance']);
    Route::get('report/agent-performance', [ReportController::class, 'agentPerformance']);
    Route::get('report/total-queue-waiting', [ReportController::class, 'totalQueueWaiting']);
    Route::get('report/member-with-time-in-status', [ReportController::class, 'memberWithTimeInStatus']);
    Route::get('report/time-in-status', [ReportController::class, 'userTimeInStatus']);
    Route::get('report/dashboard-overall-performance', [ReportController::class, 'dashboardOverallPerformance']);

    Route::get('/twitter/search', [TwitterController::class, 'search']);
    Route::get('/twitter/send-message', [TwitterMassageController::class, 'getTwitterDMEvents']);
    Route::get('/twitter/dms', [TwitterMassageController::class, 'getDms'])->name('twitter.dms');
    Route::post('/twitter/reply-to-tweet', [TwitterController::class, 'sendReplyToTweet']);
    Route::get('/twitter/gettoken', [TwitterController::class, 'getToken']);
<<<<<<< HEAD
    Route::get('/twitter/commenttw', [TwitterController::class, 'getComTw']);
=======
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
  
});

require __DIR__ . '/test.php';

Route::group([
    'namespace' => 'App\Http\Controllers',
    'prefix' => 'auth'
], function ($router) {
    Route::post('register', 'AuthController@register');
});
