<?php
namespace app\commands;

use \yii\console\Controller;
use \app\models\Message;

class MsgController extends Controller
{
    /**
     * Destroy old messages
     * @return boolean
     */
    public function actionDestroy()
    {
        /**
         * Select all messages where time
         * since creation > one hour and where
         * message has destroyByTime method
         */
        $messages = Message::find()
            ->where(['destroy_method' => Message::DESTROY_BY_TIME])
            ->andWhere(['>', 'TIME_TO_SEC(TIMEDIFF(NOW(), message.created_at))/60', 60])
            ->all();

        /** Destroy selected messages */
        foreach ($messages as $message) {
           $message->delete();
        }

        return true;
    }
}