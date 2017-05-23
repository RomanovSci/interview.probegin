## Task

Build a web application which creates a text self-destructing messages.User opens website and creates a message. Application generates a safe link to this saved message (like: http://yourapp.com/message/ftr45e32fgHJKv56d2 ).

User should be able to choose destruction option:
- destroy message after the first link visit
- destroy after 1 hour

All the messages stored on the server side should be encrypted using AES algorithm (you can use any library for text encryption). Use any PHP framework (Zend, Laravel, Symfony or any other) for php backend. Also please deploy your application to GIT.

Bonus points for implementing:
- message should be encrypted on frontend side using password and should be sent to backend in encrypted format (to view message user should enter a right password)
- self-destruction of messages after given number of link visits or after given number of hours

## Requirements
1) php-7.0+
2) mysql-5.7+
3) nodejs-6+

## How to run
1) Install application dependencies: `composer install`
2) Check and install required packages: `php requirements.php`
3) Configure DB:
* Create MYSQL database
* Configure connection in `config/db.php` file
* Apply migration with `php yii migrate` console command
4) Setup scheduler for execution next command every 1 minute: `php $PATH_TO_PROJECT/yii msg/destroy`
5) Build frontend: `npm run build`
6) Run server: `php yii serve`
