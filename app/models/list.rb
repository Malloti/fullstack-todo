class List < ApplicationRecord
  has_many :tasks, class_name: "Task", foreign_key: "list_id", dependent: :destroy

  validates :title, presence: true, uniqueness: true
end
