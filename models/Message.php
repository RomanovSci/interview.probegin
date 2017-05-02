<?php
namespace app\models;

use yii\db\ActiveRecord;
use yii\behaviors\TimestampBehavior;
use yii\db\Expression;
use yii\db\Query;
use yii\db\QueryBuilder;
use yii\web\Request;

class Message extends ActiveRecord
{
    public static $FAIL_RESPONSE = ['success' => false];

    const DESTROY_BY_TIME = 0;
    const DESTROY_BY_VISIT = 1;

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
            [['destroy_option', 'visit_count'], 'integer'],
            ['destroy_option', 'integer', 'min' => 1],
            ['visit_count', 'integer', 'min' => 0],
            ['destroy_method', 'in', 'range' => [
                self::DESTROY_BY_TIME,
                self::DESTROY_BY_VISIT,
            ]]
        ];
    }

    public function getMinutesAfterCreating()
    {
        $value = (new Query())
            ->select([
                'diff' => 'TIME_TO_SEC(TIMEDIFF(NOW(), message.created_at)) / 60'
            ])
            ->from(self::tableName())
            ->where([
                'id' => $this->attributes['id']
            ])
            ->one();

        return (float) $value['diff'];
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

        $attrs = $message->attributes;

        /** Destroy message if visit count > destroy option */
        if (
            $attrs['destroy_method'] == self::DESTROY_BY_VISIT &&
            $attrs['visit_count'] >= $attrs['destroy_option']
        ) {
            $message->delete();
            return self::$FAIL_RESPONSE;
        }

        /** Update visits for current link */
        $message->visit_count += 1;
        $message->save();

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

        /** Return encrypted message */
        return [
            'success' => true,
            'key' => $message->attributes['key'],
            'message' => $message->attributes['message'],
        ];
    }
}