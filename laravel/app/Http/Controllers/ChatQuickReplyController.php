<?php

namespace App\Http\Controllers;

use App\UseCase\ChatQuickReplyUseCase;
use Illuminate\Http\Request;

class ChatQuickReplyController extends Controller
{
    protected ChatQuickReplyUseCase $chatQuickReplyUseCase;

    public function __construct()
    {
        $this->chatQuickReplyUseCase = new ChatQuickReplyUseCase();
    }

    public function get(Request $request, $id)
    {
        if (!$id) {
            return $this->badRequest('Id is required');
        }

        [$quickReply, $err, $code] = $this->chatQuickReplyUseCase->get($id);
        throwIfUseCaseError($err, $code);

        return $this->ok(['data' => $quickReply]);
    }

    public function getList(Request $request)
    {
        $req = $request->validate([
            'brand_id' => 'required',
        ]);
        extract($req);

        [$quickReplies, $err, $code] = $this->chatQuickReplyUseCase->getList($brand_id);
        throwIfUseCaseError($err, $code);

        return $this->ok(['data' => $quickReplies]);
    }

    public function create(Request $request)
    {
        $req = $request->validate([
            'brand_id' => 'required',
            'title' => 'required',
            'message' => 'required',
            'image.*' => '',

        ]);
        extract($req);

        $files = $request->file('image') ?? [];

        [$quickReply, $err, $code] = $this->chatQuickReplyUseCase->create(
            brandId: $brand_id,
            title: $title,
            message: $message,
            files: $files
        );
        throwIfUseCaseError($err, $code);

        return $this->ok(['data' => $quickReply]);
    }

    public function delete(Request $request, $id)
    {
        if (!$id) {
            return $this->badRequest('Id is required');
        }

        [$quickReply, $err, $code] = $this->chatQuickReplyUseCase->delete($id);
        throwIfUseCaseError($err, $code);

        return $this->ok(['message' => 'Delete quick reply success']);
    }

    public function update(Request $request, $id)
    {
        if (!$id) {
            return $this->badRequest('Id is required');
        }

        $req = $request->validate([
            'title' => 'required',
            'message' => 'required',
            'image_id.*' => '',
            'image_action.*' => '',
            'image.*' => '',
        ]);
        extract($req);

        $imageIds = $request->input('image_id') ?? [];
        $files = $request->file('image') ?? [];
        $imageActions = $request->input('image_action') ?? [];

        $images = [];
        foreach ($imageIds as $key => $imageId) {
            $images[] = [
                'id' => $imageId,
                'file' => $files[$key] ?? null,
                'action' => $imageActions[$key] ?? null,
            ];
        }

        [$quickReply, $err, $code] = $this->chatQuickReplyUseCase->update(
            quickReplyId: $id,
            title: $title,
            message: $message,
            images: $images
        );

        throwIfUseCaseError($err, $code);

        return $this->ok(['data' => $quickReply]);
    }
}
