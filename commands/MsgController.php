<?php
namespace app\commands;

use \yii\console\Controller;
use Carbon\Carbon;
use \app\models\Message;

class MsgController extends Controller
{
    /**
     * Destroy old messages
     * @return boolean
     */
    public function actionDestroy()
    {
        $messages = Message::findAll([
            'destroy_method' => Message::DESTROY_BY_TIME
        ]);

        /** Remove old messages */
        foreach ($messages as $message) {
            if ($message->getMinutesAfterCreating() > (int) $message->attributes['destroy_option'] * 60) {
                $message->delete();
            }
        }

        return true;
    }
}