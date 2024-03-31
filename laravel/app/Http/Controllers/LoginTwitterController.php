<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Traits\TwitterTrait;
use App\Models\ChatConstant;
class LoginTwitterController extends Controller
{
    use TwitterTrait;
<<<<<<< HEAD
      public function getAuthorizationCode($brand_id) {
        $dataconstant = ChatConstant::where('brand_id', $brand_id)->first();
        $authorize_url = "https://twitter.com/i/oauth2/authorize";
        $callback_uri =  $dataconstant->twitter_redirect_url;
        $client_id =  $dataconstant->twitter_client_id;
        $client_secret = $dataconstant->twitter_client_secret;
        $str = (pack('H*', hash("sha256", $dataconstant->twitter_code_challenge)));
        // $callback_uri =  env('TWITTER_REDIRECT_URI');
        // $client_id = env('TWITTER_CLIENT_ID');
        // $client_secret = env('TWITTER_CLIENT_SECRET');
        // $str = (pack('H*', hash("sha256", env('TWITTER_CODE_CHALLENGE'))));

        $code_challenge = rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
        $authorization_redirect_url = $authorize_url . "?response_type=code&client_id=" . $client_id . "&redirect_uri=" . $callback_uri . "&scope=tweet.read%20tweet.write%20users.read%20follows.read%20dm.read%20dm.write%20offline.access&state=state&code_challenge=".$code_challenge."&code_challenge_method=plain&brand_id=".$brand_id;
=======
      public function getAuthorizationCode() {
        $authorize_url = "https://twitter.com/i/oauth2/authorize";
        $callback_uri =  env('TWITTER_REDIRECT_URI');
        $client_id = env('TWITTER_CLIENT_ID');
        $client_secret = env('TWITTER_CLIENT_SECRET');
        $str = (pack('H*', hash("sha256", env('TWITTER_CODE_CHALLENGE'))));
        $code_challenge = rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
        $authorization_redirect_url = $authorize_url . "?response_type=code&client_id=" . $client_id . "&redirect_uri=" . $callback_uri . "&scope=tweet.read%20tweet.write%20users.read%20follows.read%20dm.read%20dm.write%20offline.access&state=state&code_challenge=".$code_challenge."&code_challenge_method=plain";
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
        return redirect()->to($authorization_redirect_url);
    }
    public function handleCallback(Request $request) {
        $authorization_code = $request->input('code');
<<<<<<< HEAD
        $brand_id= $request->input('brand_id');
=======
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
        $token_response = $this->callTwitterApi($authorization_code);
        if(isset($token_response['error'])) {
            // Handle error
            // Redirect to appropriate route
            return response()->json(['access_token' => $token_response]);
        } else {
            $TwitterAccessToken = $token_response['access_token'];
            $TwitterRefreshToken = $token_response['refresh_token'];

            // {"token_type":"bearer"
            //     ,"expires_in":7200
            //     ,"access_token":"bkRuU09YLS1WX04zcGwtZ1NJbUlRWkJrX1hLTXNKY1Jwc0cwQWtMeTgyak5YOjE3MTA0NzQ2MzkwMzk6MTowOmF0OjE"
            //     ,"scope":"follows.read offline.access dm.read tweet.write users.read dm.write tweet.read"
            //     ,"refresh_token":"Y0tFQXdNaU9nellyb3lkX2VCckJyZWI4M0xrSS1JQkxtWk1zdHNFSmowSWZSOjE3MTA0NzQ2MzkwMzk6MTowOnJ0OjE"
            // }
<<<<<<< HEAD
            ChatConstant::where('brand_id', $brand_id)->update([
=======
            ChatConstant::where('code', 1)->update([
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
                'value' => $TwitterAccessToken,
                'value2' => $TwitterRefreshToken,
                // อัปเดต timestamp ให้เป็นปัจจุบัน
            ]);
<<<<<<< HEAD
           //return response()->json(['access_token' => $TwitterAccessToken]);
           return response()->json(['data_access_token' => $token_response]);
=======
           return response()->json(['access_token' => $TwitterAccessToken]);
>>>>>>> a16dc34e5dd1886417551a7181d2f7f6869871fb
        }
    }




    
   
}
