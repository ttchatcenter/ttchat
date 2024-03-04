<?php

namespace App\Repositories;

use App\Models\QuickReply;
use App\Models\QuickReplyImage;

class QuickReplyRepository
{
    public function get($quickReplyId)
    {
        return QuickReply::where('id', $quickReplyId)->with('quickReplyImage')->first();
    }

    public function getList($brandId)
    {
        return QuickReply::where('brand_id', $brandId)->with('quickReplyImage')->get();
    }

    public function create($brandId, $title, $message)
    {
        return QuickReply::create([
            'brand_id' => $brandId,
            'title' => $title,
            'message' => $message,
        ]);
    }

    public function delete($id)
    {
        return QuickReply::where('id', $id)->delete();
    }


    public function update($quickReplyId, $title, $message)
    {
        return QuickReply::where('id', $quickReplyId)->update([
            'title' => $title,
            'message' => $message,
        ]);
    }

    public function createImage($quickReplyId, $image)
    {
        return QuickReplyImage::create([
            'quick_reply_id' => $quickReplyId,
            'image' => $image,
        ]);
    }

    public function deleteImages($quickReplyId)
    {
        return QuickReplyImage::where('quick_reply_id', $quickReplyId)->delete();
    }

    public function deleteImage($quickReplyId, $imageId)
    {
        return QuickReplyImage::where('quick_reply_id', $quickReplyId)->where('id', $imageId)->delete();
    }

    public function updateImage($imageId, $image)
    {
        return QuickReplyImage::where('id', $imageId)->update([
            'image' => $image,
        ]);
    }
}
