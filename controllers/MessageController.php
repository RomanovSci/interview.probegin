<?php
namespace app\controllers;

use yii\web\Controller;
use yii\web\Response;
use yii\filters\VerbFilter;

use app\models\Message;

class MessageController extends Controller
{
    /**
     * @inheritdoc
     */
    public function behaviors()
    {
        return [
            'verbs' => [
                'class' => VerbFilter::class,
                'actions' => [
                    'create' => ['post'],
                    'check' => ['get'],
                    'get' => ['get'],
                ]
            ],
        ];
    }

    /**
     * Set JSON response format
     * @inheritdoc
     */
    public function beforeAction($action)
    {
        \Yii::$app->response->format = Response::FORMAT_JSON;
        return parent::beforeAction($action);
    }

    /**
     * Create new message
     * @return array
     */
    public function actionCreate()
    {
        return (new Message())->createMessage(\Yii::$app->request->bodyParams);
    }

    /**
     * Check message existing
     * @param  $token
     * @return array
     */
    public function actionCheck($token)
    {
        return Message::check($token);
    }

    /**
     * Get message
     * @param $password
     * @param $token
     * @return array
     */
    public function actionGet($password, $token)
    {
        return Message::get($password, $token);
    }
}