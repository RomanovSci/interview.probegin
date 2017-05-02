<?php

use yii\db\Migration;

/**
 * Handles the creation of table `message`.
 */
class m170427_135743_create_message_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('message', [
            'id' => $this->primaryKey(),
            'message' => $this->text()->notNull(),
            'key' => $this->char(128)->notNull(),
            'access_token' => $this->char(16)->notNull()->unique(),
            'password' => 'varchar(128) not null',
            'destroy_method' => $this->smallInteger(1)->notNull()->defaultValue(0),
            'created_at' => 'timestamp not null default current_timestamp',
            'updated_at' => 'timestamp not null default current_timestamp on update current_timestamp',
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('message');
    }
}
