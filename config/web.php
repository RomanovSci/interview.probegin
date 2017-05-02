<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'messages',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'components' => [
        'request' => [
            'cookieValidationKey' => 'wIs93K7kFQMzyQSzvAcT',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => \yii\log\FileTarget::class,
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                'api/<controller:[\w\d\-]+>/<action:[\w\d\-]+>' => '<controller>/<action>',
                '<url:(.*)>' => 'app/index'
            ],
        ],
        'errorHandler' => [
            'errorAction' => 'app/error',
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    $modules = [
        'debug' => \yii\debug\Module::class,
        'gii' => yii\gii\Module::class,
    ];

    foreach ($modules as $name => $class) {
        $config['bootstrap'][] = $name;
        $config['modules'][$name] = [
            'class' => $class,
        ];
    }
}

return $config;
