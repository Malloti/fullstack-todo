class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :title
      t.belongs_to :list, :foreign_key => 'list_id'
      t.boolean :done

      t.timestamps
    end
  end
end
