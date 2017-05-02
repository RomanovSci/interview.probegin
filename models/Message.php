<?php
namespace app\models;

use yii\db\ActiveRecord;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;
use yii\web\Request;

class Message extends ActiveRecord
{
    public static $FAIL_RESPONSE = ['success' => false];

    const DESTROY_BY_TIME = 0;
    const DESTROY_BY_READ = 1;

    const ACCESS_TOKEN_LENGTH = 16;

    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'message';
    }

    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'timestamp' => [
                'class' => TimestampBehavior::class,
                'attributes' => [
                    ActiveRecord::EVENT_BEFORE_INSERT => ['created_at', 'updated_at'],
                    ActiveRecord::EVENT_BEFORE_UPDATE => ['updated_at'],
                ],
                'value' => new Expression('now()'),
            ]
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['message', 'key', 'password', 'destroy_method'], 'required'],
            [['message', 'key', 'password'], 'string'],
            ['destroy_method', 'in', 'range' => [
                self::DESTROY_BY_TIME,
                self::DESTROY_BY_READ,
            ]]
        ];
    }

    /**
     * Create message and return
     * access token if message was created
     *
     * @param $data
     * @return array
     */
    public function createMessage(array $data): array
    {
        if (!$this->load($data) || !$this->validate()) {
            return self::$FAIL_RESPONSE;
        }

        $this->access_token = \Yii::$app
            ->security
            ->generateRandomString(self::ACCESS_TOKEN_LENGTH);

        $this->password = \Yii::$app
            ->security
            ->generatePasswordHash($this->password);

        if (!$this->save()) {
            return self::$FAIL_RESPONSE;
        }

        return [
            'success' => true,
            'accessToken' => $this->access_token,
        ];
    }

    /**
     * Check message existing
     * @param $token
     * @return array
     */
    public static function check(string $token): array
    {
        $message = self::findOne(['access_token' => $token]);

        /** If not exists */
        if (!$message instanceof self) {
            return self::$FAIL_RESPONSE;
        }

        return ['success' => true];
    }

    /**
     * Get message by access token
     * @param $password
     * @param $token
     * @return array
     */
    public static function get($password, $token): array
    {
        $message = self::findOne(['access_token' => $token]);

        /** If not exists */
        if (!$message instanceof self) {
            return self::$FAIL_RESPONSE;
        }

        /** If wrong password */
        if (!\Yii::$app->security->validatePassword(
            $password,
            $message->attributes['password']
        )) {
            return self::$FAIL_RESPONSE;
        }

        /** If message should be remover after reading */
        if ($message->attributes['destroy_method'] == self::DESTROY_BY_READ) {
            $message->delete();
        }

        /** Return encrypted message */
        return [
            'success' => true,
            'key' => $message->attributes['key'],
            'message' => $message->attributes['message'],
        ];
    }
}