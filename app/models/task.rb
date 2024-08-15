class Task < ApplicationRecord
  belongs_to :lists, class_name: 'List', foreign_key: 'list_id'

  validates :title, presence: true
end
