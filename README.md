## How to run
1) Check and install required packages: `php requirements.php`
2) Install application dependencies: `composer install`
3) Configure DB:
* Create MYSQL database
* Configure connection in `config/db.php` file
* Apply migration with `php yii migrate` console command
4) Setup shceduler for execution next command every 1 minute: `php $PATH_TO_PROJECT/yii msg/destroy`
5) Run server: `php yii serve`
