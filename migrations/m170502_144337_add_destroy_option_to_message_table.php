<?php

use yii\db\Migration;

class m170502_144337_add_destroy_option_to_message_table extends Migration
{
    public function safeUp()
    {
        $columns = [
            'destroy_option' => $this->integer()->notNull()->defaultValue(1),
            'visit_count' => $this->integer()->notNull()->defaultValue(0),
        ];

        foreach ($columns as $attr => $type) {
            $this->addColumn('message', $attr, $type);
        }
    }

    public function safeDown()
    {
        $this->dropColumn('message', 'destroy_option');
        $this->dropColumn('message', 'visit_count');
    }
}
