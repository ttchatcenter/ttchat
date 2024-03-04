<?php

namespace App\UseCase;

use App\Repositories\QuickReplyRepository;
use App\Utils\FileUtil;
use Illuminate\Support\Facades\DB;

class ChatQuickReplyUseCase extends BaseUseCase
{
    protected $quickReplyRepo;

    public const CREATE_IMAGE = 'create';
    public const UPDATE_IMAGE = 'update';
    public const DELETE_IMAGE = 'delete';

    public function __construct()
    {
        $this->quickReplyRepo = new QuickReplyRepository();
    }

    public function get($id)
    {
        $quickReply = $this->quickReplyRepo->get($id);

        if (!$quickReply) {
            return $this->error('Quick reply not found', 404);
        }

        return $this->success($quickReply);
    }

    public function getList($brandId)
    {
        $items = $this->quickReplyRepo->getList($brandId);
        return $this->success($items);
    }

    public function create($brandId, $title, $message, $files = [])
    {
        DB::beginTransaction();
        try {
            $quickReply = $this->quickReplyRepo->create($brandId, $title, $message);

            if (!$quickReply->wasRecentlyCreated) {
                DB::rollBack();
                return $this->error('Create quick reply failed');
            }

            foreach ($files as $file) {
                try {
                    $file = FileUtil::uploadImage([
                        'file' => $file,
                        'path' => "public/quick-reply/$quickReply->brand_id/$quickReply->id/",
                    ]);

                    $this->quickReplyRepo->createImage($quickReply->id, $file['link']);
                } catch (\Throwable $th) {
                    DB::rollBack();
                    return $this->error($th->getMessage());
                }
            }

            DB::commit();
            return $this->success($this->quickReplyRepo->get($quickReply->id));

        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error('Create quick reply failed');
        }
    }

    public function delete($quickReplyId)
    {
        DB::beginTransaction();
        try {
            $quickReply = $this->quickReplyRepo->delete($quickReplyId);
            $this->quickReplyRepo->deleteImages($quickReplyId);

            DB::commit();
            return $this->success($quickReply);

        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }

    public function update($quickReplyId, $title, $message, $images = [])
    {
        DB::beginTransaction();
        try {
            $quickReply = $this->quickReplyRepo->update($quickReplyId, $title, $message);

            if (!$quickReply) {
                DB::rollBack();
                return $this->error("Not found or update failed'");
            }

            $quickReply = $this->quickReplyRepo->get($quickReplyId);

            foreach ($images as $image) {
                $imageId = $image['id'];
                $file = $image['file'];
                $action = $image['action'];

                if ($action == self::CREATE_IMAGE) {
                    try {
                        $file = FileUtil::uploadImage([
                            'file' => $file,
                            'path' => "public/quick-reply/$quickReply->brand_id/$quickReply->id/",
                        ]);

                        $this->quickReplyRepo->createImage($quickReply->id, $file['link']);
                    } catch (\Throwable $th) {
                        DB::rollBack();
                        return $this->error($th->getMessage());
                    }
                }

                if ($action == self::UPDATE_IMAGE) {
                    try {
                        $file = FileUtil::uploadImage([
                            'file' => $file,
                            'path' => "public/quick-reply/$quickReply->brand_id/$quickReply->id/",
                        ]);

                        $this->quickReplyRepo->updateImage($imageId, $file['link']);
                    } catch (\Throwable $th) {
                        DB::rollBack();
                        return $this->error($th->getMessage());
                    }
                }

                if ($action == self::DELETE_IMAGE) {
                    $this->quickReplyRepo->deleteImage($quickReply->id, $imageId);
                }
            }

            DB::commit();
            return $this->success($quickReply->refresh());

        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->error($th->getMessage());
        }
    }
}
