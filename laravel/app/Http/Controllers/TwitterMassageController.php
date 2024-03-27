<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use SmolBlog\OAuth2\Client\Provider\Twitter;
use SmolBlog\OAuth2\Client\Token\AccessToken;
use App\Traits\TwitterTrait;
class TwitterMassageController extends Controller
{
    use TwitterTrait;
    public function getTwitterDMEvents() {
        $url = "https://api.twitter.com/2/dm_conversations/196486978-1759785401148141568/dm_events";
       // $url = "https://api.twitter.com/2/dm_conversations/with/:196486978-1759785401148141568/messages";
        $response = Http::withToken(env('TWITTER_ACCESS_TOKENX'))
                        ->get($url, [
                            'dm_event.fields' => 'id,text,event_type,dm_conversation_id,created_at,sender_id,attachments,participant_ids,referenced_tweets'
                        ]);
    
        // Check if the request was successful
        if ($response->successful()) {
            // Return JSON response as an array
            return $response->json();
        } else {
            // If there's an error, return null or handle it as needed
            return null;
        }
    }
    public function getDms() {
        $dm_events_url= "https://api.twitter.com/2/dm_events?dm_event.fields=id,text,event_type,dm_conversation_id,created_at,sender_id&user.fields=created_at,description,id,location,name";
        $TwitterAccessToken = env('TWITTER_ACCESS_TOKENX'); // Get access token from where you stored it
        $header = array("Authorization: Bearer {$TwitterAccessToken}");
       // ZW10WGotSXBjTGpzZFROLWNEYTlsNWFyWXM2bkw3MEJuTkIwWVpPU0tKSVV2OjE3MTAyMjM5MTU5OTI6MTowOmF0OjE
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $dm_events_url,
            CURLOPT_HTTPHEADER => $header,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true
        ));
        $response = curl_exec($curl);
        curl_close($curl);
        return json_decode($response, true);
    }


}
